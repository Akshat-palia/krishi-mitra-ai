import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";

function DiseaseDetection() {
  const { language } = useLanguage();

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/detect-disease?lang=${language}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setResult({ error: "Failed to detect disease." });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white tracking-tight">
        🌿 Disease Detection
      </h2>

      {/* Upload Card */}
      <div
        className="
          backdrop-blur-xl
          bg-white/30 dark:bg-white/5
          border border-white/30 dark:border-white/10
          shadow-2xl
          rounded-3xl
          p-10
          transition-all duration-500
        "
      >
        <div className="flex flex-col gap-6">

          {/* Custom File Upload */}
          <label className="flex items-center gap-6 cursor-pointer">
            <span
              className="
                px-6 py-3
                rounded-xl
                bg-white/40 dark:bg-white/10
                border border-white/30 dark:border-white/10
                hover:bg-white/60 dark:hover:bg-white/20
                transition
              "
            >
              Choose Image
            </span>

            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {file ? file.name : "No file selected"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Action Button */}
          <button
            onClick={handleUpload}
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
            Detect Disease
          </button>

        </div>
      </div>

      {/* Loader */}
      {loading && <Loader type="disease" />}

      {/* Error */}
      {!loading && result && result.error && (
        <div className="mt-8 text-red-500 font-medium">
          {result.error}
        </div>
      )}

      {/* Result Card */}
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
    reveal-card
  "
>

          <div className="grid grid-cols-2 gap-6 text-gray-900 dark:text-gray-100">
            <p><strong>🌾 Crop:</strong> {result.crop}</p>
            <p><strong>🦠 Disease:</strong> {result.disease}</p>
            <p><strong>📊 Confidence:</strong> {result.confidence}%</p>
            <p><strong>🔬 Type:</strong> {result.type}</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">📋 Symptoms</h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {result.symptoms}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">💊 Treatment</h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {result.treatment}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">🧪 Dosage</h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {result.dosage}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">🛡 Prevention</h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {result.prevention}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">🤖 AI Suggestion</h4>
            <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
              {result.ai_suggestion}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

export default DiseaseDetection;