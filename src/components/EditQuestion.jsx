import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from 'react-redux'
import { useParams, useNavigate } from 'react-router'
import databaseService from "../appwrite/config";
import {deleteQuestion, editQuestion} from '../features/postSlice';
import  storageService  from '../appwrite/storage';
import ImageInput from "./HandleImage";

const EditQuestion = () => {
 
  // Get the question data from the backend
  const allQuestions = useSelector(state => state.post.questions)
  const {id} = useParams();

  const [initialData, setInitialData] = useState(allQuestions.find(q => q.$id === id));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Variables
  const [subject, setSubject] = useState(initialData?.subject);
  const [question, setQuestion] = useState(initialData?.question);
  const [options, setOptions] = useState(initialData?.options);
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer);
  const [isFile, setIsFile] = useState(initialData?.imageId ? true : false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [isOption, setIsOption] = useState(null);

  useEffect(() => {
    if (initialData?.options?.length > 2) {
      setIsOption(true);
    } else {
      setIsOption(false);
    }
  }, [])
 
  useEffect(() => {
    setInitialData(allQuestions.find(q => q.$id === id))
    setSubject(initialData?.subject);
    setQuestion(initialData?.question);
    setOptions(initialData?.options);
    setCorrectAnswer(initialData?.correctAnswer);

  }, [allQuestions])


  
  // Update correct answer options when options change
  useEffect(() => {
    if (initialData?.options?.length > 2){
      setCorrectAnswer( preVal => (
          options.includes(preVal) ? preVal : ""
      ))
    }
  }, [options]);

  // Handle Image
 // Variables for handling image
 
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(null); // null: not checked, true: valid, false: invalid

  const handleImageUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile){
      // Validate the valid file types
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFeedback('File uploaded successfully');
        setIsValid(true);
        setIsFile(true);
      } else {
        setFile(null);
        setIsValid(false);
        setFeedback('Please upload image file (jpg, jpeg, or png)');
      }
    }
    
  };

 


  // Add a new option
  const addOption = () => {
    setOptions([...options, ""]);
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
    options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = `Option ${index + 1} is required.`;
      }
    });

    // Validate Correct Answer
    if (!correctAnswer) {
      newErrors.correctAnswer = "Please select the correct answer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  // submit the question or reflect the changes to the database
  const editQues = async () => {
    try{
        // Either upload the new image
       
        // Upload the image to Appwrite storage
        const fileImage = file ? await storageService.uploadFile(file) : null;
        // Delete the image from appwrite storage
        const deleteImage = fileImage ? await storageService.deleteFile(initialData?.imageId) : null;
          
        const imageId = fileImage ? fileImage.$id : initialData?.imageId;
        
        // Or just keep everyting as same as before
        
        const res = await databaseService.editQuestion(id, {question, subject, options, correctAnswer, imageId})
        if (res) {
            // Reflect changes in the state and navigate 
            dispatch(editQuestion({id, question, subject, options, correctAnswer, imageId}));
            navigate('/');
            location.reload();
           
        }
    } catch (error) {
        console.log('Error in reflecting changes', error.message);
    }
  }
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Question updated successfully!");
      
      // Submit updated data to backend or perform further actions
      editQues();
    }
  };

  const removeImage = async () => {
    const delImg = await storageService.deleteFile(initialData?.imageId);
    setInitialData(prev => ({
      ...prev, 
      imageId: null,
    }))
      alert('Image deleted')
    
    console.log(initialData)
  }

  const deleteQues = async (slug) => {
    // Delete document 
    if(!slug){
        throw new Error('Invalid slug');
    }
    try {
        const res = await databaseService.deleteQuestion(slug);
        if (res) {
            dispatch(deleteQuestion(slug))
            navigate('/')
            location.reload()
        }
    }catch (error) {
        console.log('Error deleting the questoin', error);
    }
  }
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Question</h1>
          <p className="text-gray-600">Update your question and options</p>
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
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Option
            </button>
          </div>

          {/* Correct Answer Field */}
          <div className="mb-6">
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            {isOption ? (<select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.correctAnswer ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select the correct answer</option>
              {options.map((value, index) => (
                <option key={index} value={value}>
                  Option {index + 1}
                </option>
              ))}
            </select>): (
              <input
              type="text"
              id={`correctAnswer`}
              placeholder={`Enter the Correct Answer`}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300
               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            )}
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
            )}
          </div>
          <div className="">
          <ImageInput
            feedback={feedback}
            isValid={isValid}
            handleImageUpload={handleImageUpload}
          />
          {isFile && <button 
            type="button"
            onClick={removeImage} 
            className="px-4 py-2 my-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
           >
             Remove Image
          </button>
          } 
           
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update Question
          </button>
        </form>
            {/* Delete Button */}
            <button 
                onClick={() => deleteQues(id)}
                type="button"
                className="w-full my-3 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Delete Question
            </button>
      </div>
    </div>
  );
};

export default EditQuestion;