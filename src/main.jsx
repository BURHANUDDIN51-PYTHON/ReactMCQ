import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import store from './store/store.js'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router'
import {Home, LoginPage, Signup, EditQuestion, AddQuestion} from './components/index.js'
import Protected from './components/Protection.jsx'


// Create the router for every page
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' element={
        <Protected authentication={true}>
          <Home/>
        </Protected>
      }/>

      <Route path='/login' element={<LoginPage/>}/> 

      <Route path='/signup' element={<Signup/>}/>

      {/* <Route path='/questions/' element={
        <Protected authentication={true}>
          <Question />
        </Protected>}/> */}

        
      {/* add qustions */}
      <Route path='/addQuestion' element={
        <Protected authentication={true}>
          <AddQuestion />
        </Protected>} />
      
       {/* edit questoins */}
      <Route path='/editQuestion/:id' element={
        <Protected authentication={true}>
        <EditQuestion />
      </Protected>} />
      
    
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
