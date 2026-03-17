import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await axios.post("http://127.0.0.1:8000/signup", {
          name,
          email,
          password,
          location,
        });

        alert("Signup successful! Please login.");
        setIsSignup(false);
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        { email, password }
      );

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setToken(token);

    } catch (err) {
      setError("Invalid credentials or user already exists");
    }
  };

  return (
    <div className="w-96 p-8 rounded-xl shadow-2xl
                    bg-white text-gray-800
                    dark:bg-gray-900 dark:text-gray-100
                    transition-all duration-300">

      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignup ? "Farmer Signup 🌾" : "Farmer Login 🌾"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded
                         bg-white text-gray-800
                         dark:bg-gray-800 dark:text-white dark:border-gray-600"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-2 border rounded
                         bg-white text-gray-800
                         dark:bg-gray-800 dark:text-white dark:border-gray-600"
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded
                     bg-white text-gray-800
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded
                     bg-white text-gray-800
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded
                     hover:bg-green-700 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-center mt-3">{error}</p>
      )}

      <p
        className="text-center mt-4 cursor-pointer
                   text-green-600 dark:text-green-400"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Login"
          : "New user? Sign up"}
      </p>
    </div>
  );
};

export default Login;