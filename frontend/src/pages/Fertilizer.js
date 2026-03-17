import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

function Fertilizer({ language }) {
  const [crop, setCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendation = async () => {
    if (!crop || !soilType) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/fertilizer?crop=${crop}&soil_type=${soilType}&nitrogen=${nitrogen}&phosphorus=${phosphorus}&potassium=${potassium}&lang=${language}`
      );

      setResult(response.data);
    } catch (error) {
      console.error("Error fetching fertilizer recommendation:", error);
      setResult({ error: "Something went wrong." });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white tracking-tight">
        💊 Fertilizer Recommendation
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

        {/* Crop Input */}
        <input
          type="text"
          placeholder="Enter Crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
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

        {/* Soil Type */}
        <input
          type="text"
          placeholder="Enter Soil Type"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
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

        {/* NPK Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <input
            type="number"
            placeholder="Nitrogen"
            value={nitrogen}
            onChange={(e) => setNitrogen(e.target.value)}
            className="
              px-5 py-3
              rounded-xl
              bg-white/40 dark:bg-white/10
              border border-white/30 dark:border-white/10
              focus:outline-none
              focus:ring-2 focus:ring-emerald-500/50
              text-gray-900 dark:text-white
            "
          />

          <input
            type="number"
            placeholder="Phosphorus"
            value={phosphorus}
            onChange={(e) => setPhosphorus(e.target.value)}
            className="
              px-5 py-3
              rounded-xl
              bg-white/40 dark:bg-white/10
              border border-white/30 dark:border-white/10
              focus:outline-none
              focus:ring-2 focus:ring-emerald-500/50
              text-gray-900 dark:text-white
            "
          />

          <input
            type="number"
            placeholder="Potassium"
            value={potassium}
            onChange={(e) => setPotassium(e.target.value)}
            className="
              px-5 py-3
              rounded-xl
              bg-white/40 dark:bg-white/10
              border border-white/30 dark:border-white/10
              focus:outline-none
              focus:ring-2 focus:ring-emerald-500/50
              text-gray-900 dark:text-white
            "
          />
        </div>

        {/* Button */}
        <button
          onClick={fetchRecommendation}
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
          Get Recommendation
        </button>

      </div>

      {/* Loader */}
      {loading && <Loader type="fertilizer" />}

      {/* Result */}
      {!loading && result && !result.error && (
        <div
          className="
            mt-12
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

          <div className="grid md:grid-cols-2 gap-6 text-gray-900 dark:text-gray-100">
            <p><strong>🌾 Crop:</strong> {result.crop}</p>
            <p><strong>🌍 Soil Type:</strong> {result.soil_type}</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">
              🌱 Base Recommendation
            </h4>
            <p className="leading-relaxed text-gray-800 dark:text-gray-200">
              {result.base_recommendation}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">
              🤖 AI Explanation
            </h4>
            <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200">
              {result.ai_explanation}
            </p>
          </div>

        </div>
      )}

      {/* Error */}
      {!loading && result && result.error && (
        <div className="mt-8 text-red-500 font-medium">
          {result.error}
        </div>
      )}

    </div>
  );
}

export default Fertilizer;