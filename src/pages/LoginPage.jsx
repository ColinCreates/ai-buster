import React, { useState } from "react";
import { supabase } from "../lib/supabase"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect to dashboard or handle success
      console.log("User logged in:", data);
      setLoading(false);
      navigate("/dashboard");
      // Example redirect: window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black text-gray-200 p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-medium">DeepFake Buster</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16 bg-grid-violet-900/[0.1] bg-black">
        <div className="max-w-md w-full bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-medium text-violet-300 mb-6 text-center">
            Login
          </h2>
          {error && (
            <div className="bg-red-950 text-red-300 p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none transition duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-300 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none transition duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 font-medium text-gray-200 rounded-lg border border-blue-900 transition duration-300 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-950 hover:bg-blue-900"
              }`}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
          <p className="text-gray-400 text-center mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-violet-400 hover:text-violet-300 transition duration-300"
            >
              Sign Up
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-4 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <p>© 2025 DeepFake Buster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
