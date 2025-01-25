import React, {useState, useEffect} from 'react'
import databaseService from '../appwrite/config'
import { useNavigate } from 'react-router'
import { nanoid } from 'nanoid'; 
import { useDispatch, useSelector} from 'react-redux'
import { addQuestion } from '../features/postSlice';
import  ImageInput  from './HandleImage'
import storageService from '../appwrite/storage';

const AddQuestion = () => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]); // Start with 2 options
  const [isOption, setIsOption] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const userData = useSelector(state => state.auth.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = userData.$id;


  // Variables for handling image
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(null); // null: not checked, true: valid, false: invalid

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile){
      // Validate the valid file types 
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFeedback('File uploaded successfully');
        setIsValid(true); 
      } else {
        setFile(null);
        setIsValid(false);
        setFeedback('Please upload image file (jpg, jpeg, or png)');
      }
    }
  }; 


  // Add a new option
  const addOption = () => {
    if (!isOption) {
      setIsOption(true);
      setOptions([...options, "", ""]);
    } else {
    setOptions([...options, ""]);
    }
  };

  // Remove an option
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      alert("You must have at least 2 options.");
    }
  };

  // Handle option input change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Validate Subject
    if (!subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    // Validate Question
    if (!question.trim()) {
      newErrors.question = "Question is required.";
    }

    // Validate Options
    if (isOption) {
      options.forEach((option, index) => {
        if (!option.trim()) {
          newErrors[`option${index}`] = `Option ${index + 1} is required.`;
        }
      });
    }

    // Validate Correct Answer
    if (!correctAnswer) {
      newErrors.correctAnswer = "Please enter the correct answer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Add the question to backend
  const createQuestion = async () => {

    const data = {
        question,
        subject,
        options,
        correctAnswer, 
        userId
      }
    try {
    
        const imgFile = file ? await storageService.uploadFile(file) : null;
        console.log(imgFile)
        const response = await databaseService.addQuestion({
          ...data, 
          imageId: imgFile ? imgFile.$id : null
        });
        if (response){
            dispatch(addQuestion(data))

        }
        navigate('/');
        location.reload();
        
        
    } catch (error) {
        console.log('Error in submitting question', error);
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Question submitted successfully!");
      
      // Submit form data to backend or perform further actions
      createQuestion();
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create a Question</h1>
          <p className="text-gray-600">Enter your question and options</p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Subject Field */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="Enter the subject/topic"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.subject ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          {/* Question Field */}
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              id="question"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.question ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
          </div>

          {/* Options Fields */}
          {isOption && options.map((option, index) => (
            <div key={index} className="mb-6">
              <label
                htmlFor={`option${index}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Option {index + 1}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id={`option${index}`}
                  placeholder={`Enter option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors[`option${index}`] ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors[`option${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`option${index}`]}</p>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={addOption}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Option
            </button>
          </div>

          {/* Correct Answer Field */}
          <div className="mb-6">
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            
            {isOption ? ( 
            <select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.correctAnswer ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select the correct answer</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  Option {index + 1}
                </option>
              ))}
            </select>) : (
              <>
              <input
              type="text"
              id={`correctAnswer`}
              placeholder={`Enter the Correct Answer`}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300
               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
           
            </>
            )}
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
            )}
          </div>

          {/* Add The imgae input */}
          <ImageInput 
            handleImageUpload={handleImageUpload}
            feedback={feedback}
            isValid={isValid}
          />
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;