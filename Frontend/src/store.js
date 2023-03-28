import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialProfileState = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	accountType: "",
	birthDate: "",
	timetable: {
		monday: {
			start: null,
			end: null
		},
		tuesday: {
			start: null,
			end: null
		},
		wednesday: {
			start: null,
			end: null
		},
		thursday: {
			start: null,
			end: null
		},
		friday: {
			start: null,
			end: null
		}
	},
	clinicAddress: "",
	uploadedLicense: true
};

const profileSlice = createSlice({
	name: "profile",
	initialState: initialProfileState,
	reducers: {
		setProfile(state, action) {
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.email = action.payload.email;
			state.phone = action.payload.phone;
			state.birthDate = action.payload.birthDate;
			state.timetable =
				action.payload.timetable || initialProfileState.timetable;
			state.clinicAddress =
				action.payload.address || initialProfileState.clinicAddress;
		},
		setAccountType(state, action) {
			state.accountType = action.payload;
		},
		setUploadedLicense(state, action) {
			state.uploadedLicense = action.payload;
		}
	}
});

export const store = configureStore({
	reducer: {
		profile: profileSlice.reducer
	}
});

export const profileActions = profileSlice.actions;
