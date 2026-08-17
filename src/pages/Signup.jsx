import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../services/firebase";

const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ បង្កើតគណនីបានដោយជោគជ័យ!");
    } catch (err) {
      setError("មានបញ្ហាในการចុះឈ្មោះ៖ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-gray-100">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
            AppBetong - Sign Up
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            បង្កើតគណនីថ្មីដើម្បីប្រើប្រាស់ប្រព័ន្ធ
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-600 text-white text-xs rounded text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              អ៊ីម៉ែល (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none focus:border-orange-500"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-bold shadow-lg transition text-sm"
          >
            {loading ? "កំពុងបង្កើត..." : "ចុះឈ្មោះ (Sign Up)"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          មានគណនីរួចហើយ?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-orange-400 font-bold hover:underline"
          >
            ចូលគណនី (Login)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
