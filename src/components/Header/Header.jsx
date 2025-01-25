import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector, useDispatch} from 'react-redux'
import authService from '../../appwrite/auth';
import { logout as authLogout } from '../../features/authSlice';

const Navbar = () => {

    // Get the authstatus
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    

   
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to='/' className="text-2xl font-bold text-gray-800">
              Q&A
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10 ml-auto">

            {authStatus ? (
                <Link
                 to="/addQuestion"
                 className="text-gray-800 text-sm font-semibold hover:text-blue-500"
               >
                 Add a Question
               </Link>
            ): null }

            {authStatus == false && (
            <Link
              to="/login"
              className="text-gray-800 text-sm font-semibold hover:text-blue-500"
            >
              Login
            </Link>
            )}

            {authStatus == false && (
            <Link
              to="/signup"
              className="text-gray-800 text-sm font-semibold hover:text-blue-500"
            >
              Signup
            </Link>
            )}


            {authStatus == true && (
                 <button
                 onClick={(e) => {
                  authService.logout().then(() => {
                      dispatch(authLogout());
                  }).catch(() => {
                      console.log('Error in the logout function', error);
                  })}}
                 className="text-gray-800 text-sm font-semibold hover:text-blue-500"
               >
                 Logout
               </button>
            )}
          </div>
          </div>
        </div>

      {/* Mobile Menu (Hamburger) */}
      <div className="md:hidden flex justify-end px-4 py-2">
        <button className="text-gray-700 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;