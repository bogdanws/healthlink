import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
	signup: {}
};

const signupSlice = createSlice({
	name: "signup",
	initialState,
	reducers: {
		set: (state, action) => {
			state.signup[action.payload.name] = action.payload.value;
		}
	}
});

export const store = configureStore({
	reducer: {
		signup: signupSlice.reducer
	}
});

export const signupActions = signupSlice.actions;
