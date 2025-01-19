import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Header, Footer } from './components'
import { useDispatch } from 'react-redux'
import { login, logout } from './features/authSlice'
import { allQuestions } from './features/postSlice'
import  authService from './appwrite/auth'
import  databaseService  from './appwrite/config'



function App() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingQues, setLoadingQues] = useState(false);
  const dispatch = useDispatch();

  // Run the use effect to update the state as it get refreshed in every refresh
  useEffect(() => {
    // Update the data whether the user is logged in or not
    authService.getCurrentUser().then(res => {
      if (res) {
       
        dispatch(login(res));
      }
      else dispatch(logout());
      
    }).finally(() => setLoadingUser(false))

  }, [])

//  // Run the useEffect to update the questions parameter
  useEffect(() => {
    databaseService.getAllQuestions().then(questions => {
      if (questions){
        dispatch(allQuestions(questions.documents));
      } else dispatch(allQuestions([]));
    }).finally(() => setLoadingQues(false));
  }, [])



  return !loadingQues && !loadingUser ?  (
    <div className='h-screen'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  ) : null
}
export default App
