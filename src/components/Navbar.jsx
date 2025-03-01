import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Adjust path to your supabase.js file

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        return;
      }
      setLoading(false);
      navigate("/"); // Redirect to login page after logout
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <header className="bg-gray-950 text-gray-200 p-4 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-medium">DeepFake Buster</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-900 text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-800 border border-gray-800 transition duration-300"
        >
          {loading ? "Logging Out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
