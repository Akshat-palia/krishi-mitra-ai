from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
print("Connected to DB:", DB_NAME)

# Test connection immediately
try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)

users_collection = db["users"]
predictions_collection = db["predictions"]