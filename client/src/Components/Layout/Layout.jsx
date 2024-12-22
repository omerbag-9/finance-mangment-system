import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <>
            <div className="sm:w-[90%] m-auto p-0">
                <Navbar />

                <Outlet />

                {/* <Footer /> */}
            </div>
        </>
    )
}
