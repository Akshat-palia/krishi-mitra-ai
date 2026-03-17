import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { useLanguage } from "./context/LanguageContext";
import Login from "./pages/Login";
import DiseaseDetection from "./pages/DiseaseDetection";
import Fertilizer from "./pages/Fertilizer";
import MarketPrice from "./pages/MarketPrice";
import Weather from "./pages/Weather";
import Chatbot from "./pages/Chatbot";
import KissanBot from "./components/KissanBot";

/* ================= Animated Routes ================= */

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/fertilizer" element={<Fertilizer />} />
        <Route path="/market" element={<MarketPrice />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </div>
  );
}

/* ================= Sidebar Nav Item ================= */

function NavItem({ to, icon, label, open, closeMobile }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={closeMobile}
      className={`
        relative flex items-center gap-4
        px-4 py-3 rounded-xl
        text-sm font-medium
        transition-all duration-300
        ${
          isActive
            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10"
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="tracking-wide">{label}</span>}

      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full"></span>
      )}
    </Link>
  );
}

/* ================= Main App ================= */

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  return (
    <Router>
      <div className={darkMode ? "dark" : ""}>
        {/* Background */}
        <div
          className="relative flex min-h-screen"
          style={{
            backgroundImage: darkMode
              ? "url('/dark-tree.png')"
              : "url('/light-tree.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 flex w-full">

            {/* ================= SIDEBAR ================= */}
            <div
              className={`
                fixed md:relative z-40
                ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                ${sidebarOpen ? "md:w-64" : "md:w-20"}
                w-64
                h-screen
                flex flex-col
                backdrop-blur-2xl
                bg-white/70 dark:bg-white/10
                border-r border-white/20
                shadow-2xl
                transition-all duration-300
              `}
            >
              {/* Logo */}
              <div className="flex items-center justify-between px-6 py-6">
                {sidebarOpen && (
                  <div className="flex flex-col leading-tight">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Krishi
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      मित्र 🌾
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden md:block p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
                >
                  {sidebarOpen ? "⏴" : "⏵"}
                </button>

                {/* Close on mobile */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="md:hidden text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 flex flex-col px-4 mt-6 space-y-2">
                <NavItem to="/disease" icon="🌿" label={t("disease")} open={sidebarOpen} closeMobile={() => setMobileOpen(false)} />
                <NavItem to="/fertilizer" icon="💊" label={t("fertilizer")} open={sidebarOpen} closeMobile={() => setMobileOpen(false)} />
                <NavItem to="/market" icon="💰" label={t("market")} open={sidebarOpen} closeMobile={() => setMobileOpen(false)} />
                <NavItem to="/weather" icon="🌦" label={t("weather")} open={sidebarOpen} closeMobile={() => setMobileOpen(false)} />
              </div>

              {/* Logout */}
              <div className="px-4 pb-8">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setToken(null);
                  }}
                  className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                >
                  {sidebarOpen ? "🚪 Logout" : "🚪"}
                </button>
              </div>
            </div>

            {/* Overlay for Mobile */}
            {mobileOpen && (
              <div
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
              />
            )}

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col w-full">

              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-10 py-4 backdrop-blur-md bg-white/60 dark:bg-white/5 border-b border-white/20 shadow-lg">

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden text-2xl"
                >
                  ☰
                </button>

                <h2 className="text-lg md:text-3xl font-bold tracking-wide text-gray-800 dark:text-gray-200">
                  जय जवान <span className="text-emerald-600">जय किसान</span>
                </h2>

                <div className="flex items-center gap-4 md:gap-6">

                  {/* Language */}
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 text-transparent cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                    </select>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-sm md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        अ
                      </span>
                    </div>
                  </div>

                  {/* Theme */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 flex items-center justify-center"
                  >
                    {darkMode ? "🌙" : "☀️"}
                  </button>
                </div>
              </div>

              {/* Page Content */}
              <div className="flex-1 p-4 md:p-10 bg-white/70 dark:bg-gray-800/70 transition-all duration-300">
                <AnimatedRoutes />

                {!token && (
                  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <Login setToken={setToken} />
                  </div>
                )}
              </div>
              <KissanBot />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;