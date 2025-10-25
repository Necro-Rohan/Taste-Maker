import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

const AuthCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();  

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/register",
        {
          username: signUpUsername,
          email: signUpEmail,
          password: signUpPassword,
        },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Registration successful! Please log in.");
      setShowMessage(true);
      setIsFlipped(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed, Please try again.");
      setMessageType("error");
      setShowMessage(true);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        identifier: loginIdentifier,
        password: loginPassword
      }, {withCredentials: true});
      setMessage(res.data.message || "Login successful!");
      setShowMessage(true);
      login(res.data.user);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed, Please check your credentials.");
      setMessageType("error");
      setShowMessage(true);
    }

  }

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white/20 backdrop-blur-lg">
      {showMessage && (
        <div
          className={`absolute top-5 px-4 py-3 rounded border ${
            messageType === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      {!isFlipped && (
        <form onSubmit={handleLogin} className="relative w-90 h-[450px]">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wider">
              LOG IN
            </h2>
            <div className="w-full mb-5 flex flex-col">
              <label htmlFor="identifier" className="text-xs font-semibold m-1">
                EMAIL OR USERNAME
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Username / Email"
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-full mb-5 flex flex-col">
              <label htmlFor="password" className="text-xs font-semibold m-1">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginPassword(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
              Login
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsFlipped(true)}
                className="text-blue-500 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      )}
      {isFlipped && (
        <form onSubmit={handleSignUp} className="relative w-100 h-[500px]">
          <div className="absolute w-full h-full inset-0 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wider">
              SIGN UP
            </h2>
            <div className="w-full mb-3 flex flex-col">
              <label htmlFor="username" className="text-xs font-semibold m-1">
                USERNAME
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                onChange={(e) => setSignUpUsername(e.target.value)}
                className="w-full mb-3 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="w-full mb-3 flex flex-col">
              <label htmlFor="email" className="text-xs font-semibold m-1">
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full mb-3 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="w-full mb-3 flex flex-col">
              <label htmlFor="password" className="m-1 text-xs font-semibold">
                PASSWORD
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="w-full mb-5 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button className="w-full py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600">
              Sign Up
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsFlipped(false)}
                className="text-purple-500 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default AuthCard;
