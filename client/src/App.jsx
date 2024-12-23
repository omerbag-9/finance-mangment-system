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
<<<<<<< HEAD
import UserDetails from './Components/UserDetails/UserDetails'
=======
import BonusDetails from './Components/BonusDetails/BonusDetails' // Import BonusDetails component
>>>>>>> 07b8c881823694306ae94953699528cbbe5c9555


let routers = createBrowserRouter([
  {
    path: "", element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "notification", element:<ProtectedRoute><Notification /></ProtectedRoute> },
<<<<<<< HEAD
      { path: "/:id", element:<ProtectedRoute><UserDetails /></ProtectedRoute> },
=======
      { path: "bonus-details/:id", element: <ProtectedRoute><BonusDetails /></ProtectedRoute> }, // Add route for BonusDetails
>>>>>>> 07b8c881823694306ae94953699528cbbe5c9555
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
