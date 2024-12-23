import React, { useContext, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function Navbar() {
  const role = localStorage.getItem('role');  // New state for role
  const { userToken, setUserToken } = useContext(UserContext);
  function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    setUserToken(null);
    navigate('/login');
  }

  const navigation = [
    { name: 'MAIN', href: '/', current: true },
    { name: 'DASHBOARD', href: '/dashboard', current: false },
  ];

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  return (

    <div className="min-h-full mb-20">
      {/* Navbar */}
      <Disclosure as="nav" className="absolute top-0 left-0 right-0 z-50 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
              <div className="flex h-16 items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center">
                  <div className="shrink-0">
                    <Link to="/">
                      <i className="fa-solid fa-star-of-life text-xl bg-black text-white py-2 px-3 rounded-2xl"></i>
                    </Link>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-200 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <i className="fa-solid fa-xmark text-2xl"></i>
                    ) : (
                      <i className="fa-solid fa-bars text-2xl"></i>
                    )}
                  </Disclosure.Button>
                </div>

                {/* Center Section */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                  <div className="flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'bg-[#0027F3] text-white'
                              : 'text-black hover:bg-[#0027F3] hover:text-white',
                            'rounded-xl px-2 py-2 mx-2 text-sm font-medium'
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                {/* Right Section: Login & Register Links */}
                <div className="hidden md:flex items-center space-x-4">
                  {userToken !== null ? <>
                    {/* logout */}
                    <Link
                      onClick={logout}
                      className="text-black hover:text-white hover:bg-[#0027F3] px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Logout
                    </Link>
                    {/* Notification Icon */}
                    {role === 'MANAGER' ? <> 
                    <Link to="/notification">
                      <i className="fa-regular fa-bell text-xl text-black py-2 px-3 rounded-full border-2 border-black"></i>
                    </Link>
                    </>: ''}
                  </> : <>
                    {/* Button to open Login Modal */}
                    <Link
                      to={'/login'}
                      className="text-black hover:text-white hover:bg-[#0027F3] px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Login
                    </Link>
                    {/* Button to open Register Modal */}
                    <Link
                      to={'/register'}
                      className="text-black hover:text-white hover:bg-[#0027F3] px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Register
                    </Link>
                  </>}


                </div>
              </div>
            </div>
            {/* ////////////////////////////////////////////////////////////////////////////////// */}
            {/* Mobile Menu */}
            <Disclosure.Panel className="md:hidden bg-white">
              <div className="space-y-1 px-4 pt-4 pb-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-[#0027F3] text-white'
                          : 'text-black hover:bg-[#0027F3] hover:text-white',
                        'block rounded-lg px-3 py-2 text-base font-medium'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {/* Mobile Login & Register */}
                {userToken !== null ? <>
                {/* Mobile Notification Icon */}
                <Link
                  to="/notification"
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  <i className="fa-regular fa-bell text-xl"></i> Notifications
                </Link>
                  <Link
                      onClick={logout}
                      className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                    >
                      Logout
                    </Link>
                 </>: <>
                 <Link
                  to={'/login'}
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to={'/register'}
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  Register
                </Link>
                 </>}
                
                
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
