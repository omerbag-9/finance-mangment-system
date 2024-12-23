import './App.css'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import NotFound from './Components/NotFound/NotFound'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Notification from './Components/Notification/Notification'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import { useContext, useEffect } from 'react'
import { UserContext } from './context/UserContext'


let routers = createBrowserRouter([
  {
    path: "", element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "notification", element:<ProtectedRoute><Notification /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ]
  }
])

function App() {
  let { setUserToken } = useContext(UserContext)
  useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
      setUserToken(localStorage.getItem('userToken'))
    }
  }, [setUserToken])
  

  return (
    
    <>
      <RouterProvider router={routers}></RouterProvider>
    </>
  )
}

export default App
