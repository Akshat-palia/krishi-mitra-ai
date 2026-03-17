import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";

function MarketPrice() {
  const { language, t } = useLanguage();

  const [commodity, setCommodity] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMarket = async () => {
    if (!commodity) return;

    setLoading(true);
    setMarketData(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/market?commodity=${commodity}&lang=${language}`
      );
      setMarketData(response.data);
    } catch (error) {
      setMarketData({ error: t("error") });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white tracking-tight">
        💰 {t("market")}
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
          placeholder={t("enter_commodity")}
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
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
          onClick={fetchMarket}
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
          {t("get_market")}
        </button>

      </div>

      {/* Loader */}
      {loading && <Loader type="market" />}

      {/* Result */}
      {!loading && marketData && !marketData.error && (
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

          {/* Commodity + Avg */}
          <div className="grid md:grid-cols-2 gap-6 text-gray-900 dark:text-gray-100">
            <p>
              <strong>{t("commodity")}:</strong> {marketData.commodity}
            </p>
            <p>
              <strong>{t("national_avg")}:</strong> ₹
              {marketData.national_average_price}
            </p>
          </div>

          {/* Highest / Lowest */}
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
              <h4 className="font-semibold text-lg mb-3 text-emerald-700 dark:text-emerald-400">
                📈 {t("highest_price")}
              </h4>
              <p className="text-gray-800 dark:text-gray-200">
                {marketData.highest_price.state} (
                {marketData.highest_price.market})
              </p>
              <p className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                ₹{marketData.highest_price.price}
              </p>
            </div>

            <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
              <h4 className="font-semibold text-lg mb-3 text-red-600 dark:text-red-400">
                📉 {t("lowest_price")}
              </h4>
              <p className="text-gray-800 dark:text-gray-200">
                {marketData.lowest_price.state} (
                {marketData.lowest_price.market})
              </p>
              <p className="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">
                ₹{marketData.lowest_price.price}
              </p>
            </div>

          </div>

          {/* AI Insight */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              🤖 {t("ai_market")}
            </h4>
            <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200">
              {marketData.ai_market_insight}
            </p>
          </div>

        </div>
      )}

      {/* Error */}
      {!loading && marketData && marketData.error && (
        <div className="mt-8 text-red-500 font-medium">
          {marketData.error}
        </div>
      )}

    </div>
  );
}

export default MarketPrice;