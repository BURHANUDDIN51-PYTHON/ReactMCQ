import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import { login as authLogin } from "../features/authSlice";
import { useDispatch, useSelector} from "react-redux";
import authService from "../appwrite/auth";


const LoginPage = () => {

  const authStatus = useSelector(state => state.auth.status);
  // Maintain states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  
  // Set up the variables
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus) navigate('/');
  }, [authStatus])
  
  // Now handle submit
  const handleSubmit = async () => {
   
    try {
      const session = await authService.login({email, password});
      if (session) {
       
        const userData = await authService.getCurrentUser();
        if (userData) {

          dispatch(authLogin(userData));
         
        }
        navigate('/')
      }
    } catch (error) {
      setError(error.message)
      console.log(error.message);
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{error}</p>
             </div>
          )}
          <button
            onClick={handleSubmit}
            type="button"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign In
          </button>
    
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;