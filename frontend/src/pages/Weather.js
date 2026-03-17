import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";

function Weather() {
  const { language, t } = useLanguage();

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setWeatherData(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/weather?city=${city}&lang=${language}`
      );
      setWeatherData(response.data);
    } catch (error) {
      setWeatherData({ error: t("error") });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white tracking-tight">
        🌦 {t("weather")}
      </h2>

      {/* Input Card */}
      <div
        className="
          backdrop-blur-xl
          bg-white/30 dark:bg-white/5
          border border-white/30 dark:border-white/10
          shadow-2xl
          rounded-3xl
          p-10
          space-y-6
          transition-all duration-500
        "
      >

        <input
          type="text"
          placeholder={t("enter_city")}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="
            w-full
            px-5 py-3
            rounded-xl
            bg-white/40 dark:bg-white/10
            border border-white/30 dark:border-white/10
            focus:outline-none
            focus:ring-2 focus:ring-emerald-500/50
            text-gray-900 dark:text-white
          "
        />

        <button
          onClick={fetchWeather}
          className="
            w-fit
            px-8 py-3
            rounded-xl
            bg-emerald-600
            hover:bg-emerald-500
            text-white
            font-semibold
            shadow-lg
            hover:shadow-emerald-500/40
            transition-all duration-300
          "
        >
          {t("get_weather")}
        </button>

      </div>

      {/* Loader */}
      {loading && <Loader type="weather" />}

      {/* Result Card */}
      {!loading && weatherData && !weatherData.error && (
        <div
          className="
            mt-12
            backdrop-blur-xl
            bg-white/30 dark:bg-white/5
            border border-white/30 dark:border-white/10
            shadow-2xl
            rounded-3xl
            p-10
            space-y-8
            transition-all duration-500
          "
        >

          {/* City + Temperature */}
          <div className="grid md:grid-cols-2 gap-6 text-gray-900 dark:text-gray-100 items-center">
            <div>
              <p className="text-lg">
                <strong>{t("city")}:</strong> {weatherData.city}
              </p>
              <p className="text-lg">
                <strong>{t("condition")}:</strong> {weatherData.condition}
              </p>
              <p className="text-lg">
                <strong>{t("humidity")}:</strong> {weatherData.humidity}%
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">
                {weatherData.temperature}°C
              </p>
            </div>
          </div>

          {/* Advice */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              🌾 {t("advice")}
            </h4>
            <ul className="space-y-2">
              {weatherData.advice.map((item, i) => (
                <li
                  key={i}
                  className="
                    bg-emerald-500/10
                    border border-emerald-500/20
                    rounded-xl
                    px-4 py-2
                    text-gray-800 dark:text-gray-200
                  "
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Explanation */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              🤖 {t("ai_explanation")}
            </h4>
            <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200">
              {weatherData.llm_explanation}
            </p>
          </div>

        </div>
      )}

      {/* Error */}
      {!loading && weatherData && weatherData.error && (
        <div className="mt-8 text-red-500 font-medium">
          {weatherData.error}
        </div>
      )}

    </div>
  );
}

export default Weather;