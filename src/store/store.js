import {configureStore} from '@reduxjs/toolkit'
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice'
import postReducer from '../features/postSlice'


const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
})
const store = configureStore({
    reducer: rootReducer
})


export default store;