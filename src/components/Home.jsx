import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router";


import { useSelector } from "react-redux";


const Home = () => {

    // states and variables
    const allQuestions = useSelector(state => state.post.questions);
    const [subjects, setSubjects] = useState(null);
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState("");


    useEffect(() => getDistinctValues(allQuestions, 'subject'), [allQuestions]);
  
    // Function to get all the distinct values 
    function getDistinctValues(list, key) {
        // Step 1: Extract the key values
        const values = list.map(item => item[key]);
        
        // Step 2: Use Set to ensure uniqueness
        const uniqueValues = new Set(values);
        
        // Step 3: Convert Set back to an array
        setSubjects(Array.from(uniqueValues));

    }



  


    
     return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">MCQ's</h1>
              <p className="text-gray-600">Select a subject to start the MCQ's</p>
            </div>
    
            {/* Subject Dropdown */}
            <div className={`mb-6`}id='subject-dropdown'>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>

              <select
                id="subject"
                value={selectedSubject}
                onChange={(event) => setSelectedSubject(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option  value=""  disabled>Choose a subject</option>
                {subjects && subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
                <button
                    onClick={() => navigate(`/questions/${selectedSubject}`)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 my-2"
                >   
                    Click Me
                </button>
            </div>
              
           
          </div>
         
        </div>
    );
};


export default Home;