import database
import google.generativeai as genai
from fastapi import FastAPI, Query
from fastapi import UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import json
from dotenv import load_dotenv
from io import BytesIO
from model_loader import predict_image
from schemas import UserSignup, UserLogin
from database import users_collection
from passlib.context import CryptContext
from fastapi import HTTPException
from datetime import datetime, timezone


# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

# -----------------------------
# Load Disease Knowledge Base (RAG)
# -----------------------------
with open("disease_knowledge.json", "r") as f:
    disease_knowledge = json.load(f)

from PIL import Image
import torch



# -----------------------------
# Configure Gemini
# -----------------------------
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

# -----------------------------
# FastAPI App Setup
# -----------------------------
app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def home():
    return {"message": "AI Farming Assistant Backend Running 🚀"}

# ==========================================================
# WEATHER MODULE
# ==========================================================

def generate_weather_advice(city, temperature, humidity, condition, advice_list, lang):
    try:
        prompt = f"""
        You are an expert agricultural advisor.

        City: {city}
        Temperature: {temperature}°C
        Humidity: {humidity}%
        Weather Condition: {condition}
        Rule-based Advice: {advice_list}

        Provide clear, practical farming guidance.
        Language: {"Hindi" if lang == "hi" else "English"}
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Gemini Weather Error:", e)
        return "AI advisory temporarily unavailable."

@app.get("/weather")
def get_weather(city: str = Query(...), lang: str = Query("en")):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"

    response = requests.get(url)
    data = response.json()

    if str(data.get("cod")) != "200":
        return {"error": "City not found"}

    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    weather_condition = data["weather"][0]["description"]
    wind_speed = data["wind"]["speed"]
    cloud_coverage = data["clouds"]["all"]

    advice = []

    if temperature > 35:
        advice.append("High temperature. Irrigate in early morning or evening.")
    if humidity > 80:
        advice.append("High humidity. Risk of fungal disease.")
    if "rain" in weather_condition.lower():
        advice.append("Rain expected. Avoid spraying pesticides.")
    if wind_speed > 8:
        advice.append("High wind speed. Avoid chemical spraying.")
    if not advice:
        advice.append("Weather conditions are favorable for farming.")

    llm_explanation = generate_weather_advice(
        city, temperature, humidity, weather_condition, advice, lang
    )

    return {
        "city": city,
        "temperature": temperature,
        "humidity": humidity,
        "condition": weather_condition,
        "wind_speed": wind_speed,
        "cloud_coverage": cloud_coverage,
        "advice": advice,
        "llm_explanation": llm_explanation
    }

# ==========================================================
# MARKET MODULE
# ==========================================================

@app.get("/market")
def get_market_price(commodity: str = Query(...), lang: str = Query("en")):
    base_url = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"

    params = {
    "api-key": DATA_GOV_API_KEY,
    "format": "json",
    "limit": 100,
    "filters[Commodity]": commodity.title()
}

    response = requests.get(base_url, params=params)
    data = response.json()

    if "records" not in data or len(data["records"]) == 0:
        return {"error": "Commodity not found"}

    records = data["records"]

    prices = []
    for r in records:
        try:
            prices.append(int(r["Modal_Price"]))
        except:
            continue

    if not prices:
        return {"error": "No valid price data"}

    avg_price = sum(prices) / len(prices)

    highest = max(records, key=lambda x: int(x["Modal_Price"]))
    lowest = min(records, key=lambda x: int(x["Modal_Price"]))

    # AI Market Insight
    try:
        prompt = f"""
        You are an agricultural market expert.

        Commodity: {commodity}
        National Average Price: {avg_price}
        Highest Price: {highest["Modal_Price"]} in {highest["State"]}
        Lowest Price: {lowest["Modal_Price"]} in {lowest["State"]}

        Give short practical advice for farmers.
        Language: {"Hindi" if lang == "hi" else "English"}
        """

        ai_response = model.generate_content(prompt)
        market_insight = ai_response.text

    except Exception as e:
        print("Gemini Market Error:", e)
        market_insight = "AI market insight unavailable."

    return {
        "commodity": commodity,
        "national_average_price": round(avg_price, 2),
        "highest_price": {
            "state": highest["State"],
            "market": highest["Market"],
            "price": highest["Modal_Price"]
        },
        "lowest_price": {
            "state": lowest["State"],
            "market": lowest["Market"],
            "price": lowest["Modal_Price"]
        },
        "ai_market_insight": market_insight
    }

# ==========================================================
# CROP DISEASE MODULE (RAG + AI)
# ==========================================================

def generate_disease_explanation(disease_name, disease_data, lang="en"):
    try:
        prompt = f"""
        You are an agricultural plant disease expert.

        Disease Name: {disease_name}
        Symptoms: {disease_data['symptoms']}
        Treatment: {disease_data['treatment']}
        Dosage: {disease_data['dosage']}
        Prevention: {disease_data['prevention']}

        Explain clearly to a farmer:
        - What this disease is
        - How to treat it
        - Important precautions

        Language: {"Hindi" if lang == "hi" else "English"}
        Keep it simple and practical.
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Disease AI Error:", e)
        return "AI explanation unavailable."

@app.get("/test-disease")
def test_disease(disease: str, lang: str = Query("en")):
    if disease in disease_knowledge:
        explanation = generate_disease_explanation(
            disease, disease_knowledge[disease], lang
        )
        return {
            "disease": disease,
            "knowledge": disease_knowledge[disease],
            "ai_explanation": explanation
        }
    else:
        return {"error": "Disease not found in knowledge base"}
@app.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...), lang: str = Query("en")):
    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")

        predicted_label, confidence = predict_image(image)

        knowledge = disease_knowledge.get(predicted_label)

        if not knowledge:
            return {
                "error": "Disease knowledge not found"
            }

        # Gemini explanation only for suggestion
        prompt = f"""
        You are an agricultural expert.

        Crop: {knowledge['crop']}
        Disease: {knowledge['disease']}
        Type: {knowledge['type']}
        Symptoms: {knowledge['symptoms']}
        Treatment: {knowledge['treatment']}
        Dosage: {knowledge['dosage']}
        Prevention: {knowledge['prevention']}

        Give a short practical advisory to a farmer.
        Language: {"Hindi" if lang == "hi" else "English"}
        Keep it simple.
        """

        try:
            response = model.generate_content(prompt)
            ai_explanation = response.text
        except:
            ai_explanation = "AI suggestion unavailable."

        return {
            "crop": knowledge["crop"],
            "disease": knowledge["disease"],
            "type": knowledge["type"],
            "symptoms": knowledge["symptoms"],
            "treatment": knowledge["treatment"],
            "dosage": knowledge["dosage"],
            "prevention": knowledge["prevention"],
            "confidence": confidence,
            "ai_suggestion": ai_explanation
        }

    except Exception as e:
        return {"error": str(e)}
    
 # ==========================================================
# FERTILIZER RECOMMENDATION MODULE
# ==========================================================

@app.get("/fertilizer")
def recommend_fertilizer(
    crop: str = Query(...),
    soil_type: str = Query(...),
    nitrogen: int = Query(...),
    phosphorus: int = Query(...),
    potassium: int = Query(...),
    lang: str = Query("en")
):
    recommendation = ""

    # Basic rule-based logic
    if nitrogen < 40:
        recommendation += "Apply nitrogen-rich fertilizer such as Urea. "
    if phosphorus < 40:
        recommendation += "Add DAP to improve phosphorus levels. "
    if potassium < 40:
        recommendation += "Use MOP fertilizer for potassium improvement. "

    if recommendation == "":
        recommendation = "Soil nutrient levels are balanced. Use organic compost for maintenance."

    # LLM explanation
    try:
        prompt = f"""
        You are an agricultural soil expert.

        Crop: {crop}
        Soil Type: {soil_type}
        Nitrogen Level: {nitrogen}
        Phosphorus Level: {phosphorus}
        Potassium Level: {potassium}

        Base Recommendation: {recommendation}

        Explain clearly:
        - Why this fertilizer is recommended
        - How to apply it
        - Precautions

        Language: {"Hindi" if lang == "hi" else "English"}
        Keep explanation simple for farmers.
        """

        response = model.generate_content(prompt)
        ai_explanation = response.text

    except Exception as e:
        print("Fertilizer AI Error:", e)
        ai_explanation = "AI explanation unavailable."

    return {
        "crop": crop,
        "soil_type": soil_type,
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium,
        "base_recommendation": recommendation,
        "ai_explanation": ai_explanation
    }

#================================================================================================
# SIGNUP MODULE
#================================================================================================
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    from datetime import datetime, timedelta
    from jose import jwt

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/signup")
def signup(user: UserSignup):

    # Check if email already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    user_dict = user.dict()
    user_dict["password"] = hashed_password

    users_collection.insert_one(user_dict)

    return {"message": "User created successfully"}

@app.post("/login")
def login(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    

    users_collection.update_one(
    {"_id": db_user["_id"]},
    {
        "$set": {"last_login": datetime.now(timezone.utc)},
        "$inc": {"login_count": 1}
    }
)

    token = create_access_token({"user_id": str(db_user["_id"])})

    return {"access_token": token, "token_type": "bearer"}
# ==========================================================
# AGRICULTURE CHATBOT MODULE (Domain Restricted)
# ==========================================================

ALLOWED_KEYWORDS = [
    "crop", "soil", "fertilizer", "irrigation",
    "pest", "disease", "farming", "agriculture",
    "weather", "mandi", "market", "harvest",
    "seed", "yield", "organic", "insect",
    "rice", "wheat", "cotton", "maize",
    "spray", "fungus", "bacteria", "virus"
]

def is_agriculture_query(query: str):
    query = query.lower()
    return any(word in query for word in ALLOWED_KEYWORDS)


from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_input: str
    lang: str = "en"


@app.post("/chat")
def agriculture_chat(request: ChatRequest):

    user_input = request.user_input
    lang = request.lang

    if not is_agriculture_query(user_input):
        return {
            "response": "I specialize only in agriculture and farming related queries 🌾."
        }

    try:
        prompt = f"""
        You are Smart Farming AI Assistant.

        Rules:
        - Only answer agriculture and farming related questions.
        - If unrelated, politely refuse.
        - Keep answers practical and simple.

        User Question: {user_input}
        Language: {"Hindi" if lang == "hi" else "English"}
        """

        response = model.generate_content(prompt)

        return {"response": response.text}

    except Exception as e:
        print("Chatbot Error:", e)
        return {"response": "AI chatbot temporarily unavailable."}