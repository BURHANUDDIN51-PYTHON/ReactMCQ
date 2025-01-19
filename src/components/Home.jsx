import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router";


import { useSelector } from "react-redux";
import { use } from "react";

const Home = () => {

    // states and variables
    const allQuestions = useSelector(state => state.post.questions);
    const subjects = getDistinctValues(allQuestions, 'subject')
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [subjectQuestions, setSubjectQuestions] = useState([allQuestions]);
    const [showSubject, setShowSubject] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const [isOptionCorrect, setIsOptionCorrect] = useState(false);
    const [isOptionIncorrect, setIsOptionIncorrect] = useState(false);
   
    

    // Varibles for random number  
    const [perviousIndex, setPreviousIndex] = useState(null);
  // super user ID
    const [isSuper, setIsSuper] = useState(false);
    useEffect(() => {
        if(userData && userData.labels.includes('admin')) setIsSuper(true);
        else setIsSuper(false);
           
    }, [userData, authStatus])

   
    
  
    // Function to get all the distinct values 
    function getDistinctValues(list, key) {
        // Step 1: Extract the key values
        const values = list.map(item => item[key]);
        
        // Step 2: Use Set to ensure uniqueness
        const uniqueValues = new Set(values);
        
        // Step 3: Convert Set back to an array
        return Array.from(uniqueValues);
    }

    
   
    // handle subject change
    const handleSubjectChange = (event) => {
        setCurrentQuestionIndex(0);
        // Now get all the questions
        const filteredQuestions = allQuestions.filter(question => question.subject === selectedSubject);
        setSubjectQuestions(filteredQuestions);
        setShowSubject(false);
       
    };

    // Navigate to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < subjectQuestions.length - 1) {
          
            setCurrentQuestionIndex(currentQuestionIndex + 1);

        }
    };

    // Navigate to the previous question
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
           
        }
    };

    // Handle Option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (option === subjectQuestions[currentQuestionIndex].correctAnswer) {
            setIsOptionCorrect(true);
            setIsOptionIncorrect(false)
        } else {
            setIsOptionIncorrect(true);
            setIsOptionCorrect(false)
        }
    };

    useEffect(() => {
        setSelectedOption(null);
        setIsOptionCorrect(false);
        setIsOptionIncorrect(false)
    }, [currentQuestionIndex])



    
     return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">MCQ's</h1>
              <p className="text-gray-600">Select a subject to start the MCQ's</p>
            </div>
    
            {/* Subject Dropdown */}
            <div className={`mb-6 ${showSubject ? 'block': 'hidden'}`}id='subject-dropdown'>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(event) => setSelectedSubject(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Choose a subject</option>
                {subjects && subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 my-2"
                     onClick={handleSubjectChange}
                >   
                    Click Me
                </button>
            </div>
              
            {/* Display Questions */}
            
            {!showSubject && selectedSubject && subjectQuestions.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Question {currentQuestionIndex + 1} of {subjectQuestions.length}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {subjectQuestions[currentQuestionIndex].question}
                  </p>
                  <div className="space-y-2">
                    {subjectQuestions[currentQuestionIndex]['options']?.map(
                      (option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`option${index}`}
                            name="question"
                            value={option}
                            checked={selectedOption === option}
                            className={`mr-2
                                ${isOptionCorrect && "appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-green-500 checked:ring-2 checked:ring-green-200 peer"}
                                ${isOptionIncorrect && "appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-red-500 checked:bg-red-500 checked:ring-2 checked:ring-red-200 peer"}
                            `}
                            onChange={() => handleOptionSelect(option)}
                          />
                          <label htmlFor={`option${index}`} className="text-gray-700">
                            {option}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
    
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === subjectQuestions.length - 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                {authStatus && isSuper && (
                <button
                  onClick={() => navigate(`/editquestion/${subjectQuestions[currentQuestionIndex].$id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 my-3"
                >
                    Edit Question
                </button>
                )}
              </div>
            )}
            
          </div>
         
        </div>
    );
};


export default Home;