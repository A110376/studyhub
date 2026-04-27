import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    city: "Lahore",
    education_level: "Bachelor",
    ppsc_niche: "General",
  });

  const toggleMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:8000/api/accounts/login/", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        alert("Login successful!");
      } else {
        const res = await axios.post("http://localhost:8000/api/accounts/register/", form);
        alert("Registration successful!");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-10 pt-20">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-800">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {!isLogin && (
          <>
            <input name="full_name" onChange={handleChange} value={form.full_name} placeholder="Full Name"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="phone" onChange={handleChange} value={form.phone} placeholder="Phone"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="gender" onChange={handleChange} value={form.gender} placeholder="Gender"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="city" onChange={handleChange} value={form.city} placeholder="City"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="education_level" onChange={handleChange} value={form.education_level} placeholder="Education Level"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="ppsc_niche" onChange={handleChange} value={form.ppsc_niche} placeholder="PPSC Niche"
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </>
        )}

        <input name="email" onChange={handleChange} value={form.email} placeholder="Email"
          className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="password" name="password" onChange={handleChange} value={form.password} placeholder="Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 rounded-lg transition duration-300"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="text-yellow-500 ml-2 font-medium hover:underline" onClick={toggleMode}>
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
