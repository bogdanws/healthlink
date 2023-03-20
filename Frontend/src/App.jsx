import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";

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

function App() {
	return (
		<React.StrictMode>
			<RouterProvider router={createBrowserRouter(routeDefinitions)} />
		</React.StrictMode>
	);
}

export default App;
