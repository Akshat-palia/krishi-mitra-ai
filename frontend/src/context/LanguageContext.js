import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    disease: "Crop Disease Detection",
    fertilizer: "Fertilizer Recommendation",
    market: "Market Price Awareness",
    weather: "Weather Advisory",
    detect: "Detect Disease",
    getWeather: "Get Weather",
    getMarket: "Get Market Info",
    getFertilizer: "Get Recommendation",
  },

  hi: {
    disease: "फसल रोग पहचान",
    fertilizer: "उर्वरक सिफारिश",
    market: "बाजार मूल्य जानकारी",
    weather: "मौसम सलाह",
    detect: "रोग पहचानें",
    getWeather: "मौसम देखें",
    getMarket: "बाजार जानकारी",
    getFertilizer: "सिफारिश प्राप्त करें",
  },

  mr: {
    disease: "पीक रोग शोध",
    fertilizer: "खत शिफारस",
    market: "बाजार भाव माहिती",
    weather: "हवामान सल्ला",
    detect: "रोग शोधा",
    getWeather: "हवामान पहा",
    getMarket: "बाजार माहिती",
    getFertilizer: "शिफारस मिळवा",
  },
  detect: {
  en: "Detect Disease",
  hi: "रोग पहचानें",
  mr: "रोग ओळखा"
},

raw_prediction: {
  en: "Raw Model Prediction",
  hi: "मॉडल अनुमान",
  mr: "मॉडेल अंदाज"
},

confidence: {
  en: "Confidence Score",
  hi: "विश्वास स्तर",
  mr: "विश्वास गुण"
},

detected: {
  en: "Detected Disease",
  hi: "पहचाना गया रोग",
  mr: "ओळखलेला रोग"
},

symptoms: {
  en: "Symptoms",
  hi: "लक्षण",
  mr: "लक्षणे"
},

treatment: {
  en: "Treatment",
  hi: "उपचार",
  mr: "उपचार"
},

dosage: {
  en: "Dosage",
  hi: "मात्रा",
  mr: "डोस"
},

prevention: {
  en: "Prevention",
  hi: "बचाव",
  mr: "प्रतिबंध"
},

ai_explanation: {
  en: "AI Explanation",
  hi: "एआई विवरण",
  mr: "एआय स्पष्टीकरण"
},

error: {
  en: "Something went wrong.",
  hi: "कुछ गलत हुआ।",
  mr: "काहीतरी चुकलं."
}
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}