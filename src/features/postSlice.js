import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    questions: [],   
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // Functions and the operations i want to perform
        
        // Get all Questions
        allQuestions: (state, action) => {
            state.questions = action.payload;
        },

        // Delete Question
        deleteQuestion: (state, action) => {
            state.questions = state.questions.filter((question) => question.$id !== action.payload.id);
        },

        // Edit Question
        editQuestion: (state, action) => {
            state.questions.map((question) => {
                if (question.$id === action.payload.id) {
                    question.question = action.payload.question;
                    question.options = action.payload.options;
                    question.answer = action.payload.answer;
                    question.subject = action.payload.subject;
                }
            })
        },

         // Add a new Question
         addQuestion: (state, action) => {
            state.questions.push(action.payload);
        }

    }
})

// Export the reducers to use them in the component through useDispatch and useSelector 
export const {allQuestions, deleteQuestion, editQuestion, addQuestion} = postSlice.actions;

// Export the reducers for store
const postReducer = postSlice.reducer;
export default postReducer;