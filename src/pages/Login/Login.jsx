import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import toast, { Toaster } from 'react-hot-toast';
import userRequest from "../../utils/userRequest/userRequest";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userRequest.post("/users/login", { email, password });
      toast.success(res?.data?.message || "Login successful");
      sessionStorage.setItem("userData", JSON.stringify(res?.data));
      
      sessionStorage.setItem("userId", res?.data?.data.user._id);
     
      navigate("/home-page");
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="area flex justify-center items-center h-screen">
        <ul className="circles">
          {[...Array(10)].map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
      <div className="flex justify-center items-center h-screen">
        <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-500 text-white">
          <h2 className="text-2xl font-bold pb-5">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label for="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                placeholder="andrew@mail.com"
                required
              />
            </div>
            <div className="mb-4">
              <label for="password" className="block mb-2 text-sm font-medium">
                Your password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                placeholder="*********"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                disabled={loading}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <div className="flex items-center text-sm">
                <p>New here?</p>
                <p className="underline cursor-pointer ml-1">Register</p>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
