import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import NotFound from './Components/NotFound/NotFound'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Notification from './Components/Notification/Notification'

function App() {

  let routers = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { index: true, element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "notification", element: <Notification /> },
        { path: "*", element: <NotFound /> },
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={routers}></RouterProvider>
    </>
  )
}

export default App
