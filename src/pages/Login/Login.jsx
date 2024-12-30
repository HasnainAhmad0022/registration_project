import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
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
          <form>
            <div className="mb-4">
              <label for="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                placeholder="andrew@mail.com"
                required
                value=""
              />
            </div>
            <div className="mb-4">
              <label for="password" className="block mb-2 text-sm font-medium">
                Your password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
                placeholder="*********"
                required
                value=""
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                onClick={() => navigate("/home-page")}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
              >
                Submit
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
    </div>
  );
};

export default Login;
