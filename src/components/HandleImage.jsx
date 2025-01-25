import React, { useState } from "react";

const ImageInput = ({handleImageUpload, feedback, isValid}) => {
 
    
  return (

      <div>
        
          {/* Image Input Field */}
          <div className="">
            <label
              htmlFor="image-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose an image (JPG, JPEG, or PNG)
            </label>
            <input
              type="file"
              id="image-upload"
              accept=".jpg, .jpeg, .png"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                isValid === true
                  ? "border-green-500 focus:ring-green-200"
                  : isValid === false
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              onChange={handleImageUpload}
            />
            {/* Feedback Message */}
            <p
              className={`mt-2 text-sm ${
                isValid === true
                  ? "text-green-600"
                  : isValid === false
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {feedback}
            </p>
          </div>
      </div>
  );
};

export default ImageInput;