import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import storageService from '../appwrite/storage';
import {ImageComponent} from './index'

const Questions = () => {
    /* Variables for questions
        subjectQuestions
        authStatus
        isquestionEditable
        currentQuestionIndex
        selectedOption
        isOptionCorrect
        isOptionIncorrect
        navigate 
        allQuestions
    */
    const {subject} = useParams();
    const allQuestions = useSelector(state => state.post.questions);
    const [subjectQuestions, setSubjectQuestions] = useState(null);
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector(state => state.auth.userData);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [isOptionCorrect, setIsOptionCorrect] = useState(false);
    const [isOptionIncorrect, setIsOptionIncorrect] = useState(false);
    const [isInput, setIsInput] = useState(null);
    const navigate = useNavigate();

    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    // super user ID
    const [isSameUser, setIsSameUser] = useState(false);
    useEffect(() => {
        if(subjectQuestions && userData?.$id === subjectQuestions[currentQuestionIndex]?.userId){
          setIsSameUser(true);
          
        } else setIsSameUser(false);

     
           
    }, [subjectQuestions, currentQuestionIndex])


    // Use effect for adding all the subject Questions
    useEffect(() => {
        const questions = allQuestions.filter(question => question.subject === subject);

        setSubjectQuestions(allQuestions.filter(question => question.subject === subject));
    }, [allQuestions])
    

    // useEffect for whether the questions contain the options or you have to type the answer
    useEffect(() => {
        if (subjectQuestions && !subjectQuestions[currentQuestionIndex]?.options.length > 0) {
            setIsInput(true);
        } else setIsInput(false);
    }, [subjectQuestions, isInput, currentQuestionIndex])


    function shuffleArray(array) {
      const shuffledArray = [...array]; // Create a copy to avoid mutating the original array
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
      }
      return shuffledArray;
    }
    
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
    
    
    
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.trim() === subjectQuestions[currentQuestionIndex].correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
             {/* Display Questions */}
            
             {subjectQuestions?.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Question {currentQuestionIndex + 1} of {subjectQuestions.length}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {subjectQuestions[currentQuestionIndex].question}                      
                  </p>
                  <ImageComponent 
                      subjectQuestions={subjectQuestions}
                      currentIndex={currentQuestionIndex}
                    />
                  <div className="space-y-2">
                    { !isInput && subjectQuestions[currentQuestionIndex]['options']?.length > 0 && subjectQuestions[currentQuestionIndex]['options']?.map(
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
                    {isInput && (
                      
                       <form onSubmit={handleSubmit}>
                         {/* Input Field */}
                         <div className="mb-6">
                           <input
                             type="text"
                             value={userAnswer}
                             onChange={(e) => setUserAnswer(e.target.value)}
                             className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                               isCorrect === true
                                 ? "border-green-500 focus:ring-green-200"
                                 : isCorrect === false
                                 ? "border-red-500 focus:ring-red-200"
                                 : "border-gray-300 focus:ring-blue-200"
                             }`}
                             placeholder="Enter your answer"
                           />
                           {/* Feedback Message */}
                           {isCorrect !== null && (
                             <p
                               className={`mt-2 text-sm ${
                                 isCorrect ? "text-green-600" : "text-red-600"
                               }`}
                             >
                               {isCorrect ? "Correct! 🎉" : "Incorrect. Try again! ❌"}
                             </p>
                           )}
                         </div>
                 
                         {/* Submit Button */}
                         <button
                           type="submit"
                           className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                         >
                           Submit
                         </button>
                       </form>
                     
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
                {authStatus && isSameUser && (
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
    )
}   

export default Questions;