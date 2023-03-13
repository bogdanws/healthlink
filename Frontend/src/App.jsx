import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Welcome from "./pages/Welcome"

const router = createBrowserRouter([
  { path: "/", element: <Welcome /> },
]);


function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
