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

const routeDefinitions = createRoutesFromElements(
	<>
		<Route path="/">
			<Route path="" element={<Welcome />} />
			<Route path="login" element={<Login />} />
			<Route path="signup" element={<Signup />} />
		</Route>
		<Route path="/dashboard" element={<Dashboard />}>
			<Route path="patients" />
			<Route path="appointments" />
			<Route path="consultations" />
			<Route path="profile" element={<Profile />} />
			<Route path="medical-records" />
			<Route path="doctors" />
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
