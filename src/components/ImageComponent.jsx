import React, {useState, useEffect} from 'react'
import storageService from '../appwrite/storage'

 const ImageComponent = ({subjectQuestions, currentIndex}) => {

    const [imageUrl, setImageUrl] = useState(null);
    // useEffect to get the image of he questions
    useEffect(() => {
        const questionId = subjectQuestions ? subjectQuestions[currentIndex]?.imageId : null;
        const imgUrl = questionId ? storageService.getFile(questionId): null;
        //console.log(imgUrl);
        if(imgUrl) {
          setImageUrl(imgUrl);
          console.log(imageUrl);
        }
       
      }, [currentIndex, subjectQuestions])

  return imageUrl ? (
    <div className='flex justify-center items-center'>
         <img
            src={imageUrl} // Dynamically set the image URL
            alt=""
            className="max-w-full max-h-full object-contain" 
            style={{ width: '300px', height: '300px' }}
        />
    </div>
  ) : null 
}

export default ImageComponent
