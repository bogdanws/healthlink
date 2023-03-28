import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material";
import { store } from "./store";
import { Provider } from "react-redux";

import Welcome from "./pages/Welcome";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/dashboard/Profile";
import Patients from "./pages/dashboard/Patients";
import Appointments from "./pages/dashboard/Appointments";
import Consultations from "./pages/dashboard/Consultations";
import Doctors from "./pages/dashboard/Doctors";

const routeDefinitions = createRoutesFromElements(
	<>
		<Route path="/">
			<Route path="" element={<Welcome />} />
			<Route path="login" element={<Login />} />
			<Route path="signup" element={<Signup />} />
		</Route>
		<Route path="/dashboard" element={<Dashboard />}>
			<Route path="patients" element={<Patients />} />
			<Route path="appointments" element={<Appointments />} />
			<Route path="consultations" element={<Consultations />} />
			<Route path="profile" element={<Profile />} />
			<Route path="medical-records" element={<Consultations />} />
			<Route path="doctors" element={<Doctors />} />
			<Route path="" element={<Profile />} />
			<Route path="*" element={<h1>404</h1>} />
		</Route>
	</>
);

const theme = createTheme({
	palette: {
		primary: {
			main: "#27255C",
			light: "#2528A1",
			dark: "#050324"
		},
		secondary: {
			main: "#f77f00"
		}
	}
});

function App() {
	return (
		<React.StrictMode>
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<RouterProvider router={createBrowserRouter(routeDefinitions)} />
					</LocalizationProvider>
				</ThemeProvider>
			</Provider>
		</React.StrictMode>
	);
}

export default App;
