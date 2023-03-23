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

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const routeDefinitions = createRoutesFromElements(
	<Route path="/">
		<Route path="" element={<Welcome />} />
		<Route path="login" element={<Login />} />
		<Route path="signup" element={<Signup />} />
	</Route>
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
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<RouterProvider router={createBrowserRouter(routeDefinitions)} />
				</LocalizationProvider>
			</ThemeProvider>
		</React.StrictMode>
	);
}

export default App;
