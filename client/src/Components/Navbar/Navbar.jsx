import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [role, setRole] = useState("");  // New state for role

  const openModal = (modalType) => {
    setIsModalOpen(true);
    setIsLoginModal(modalType === 'login');
  };

  const closeModal = () => setIsModalOpen(false);

  const navigation = [
    { name: 'Dashboard', href: '/', current: true },
    { name: 'Transaction', href: '/transaction', current: false },
    { name: 'Card', href: '/card', current: false },
    { name: 'Income', href: '/income', current: false },
    { name: 'Spend', href: '/spend', current: false },
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
                  {/* Button to open Login Modal */}
                  <button
                    onClick={() => openModal('login')}
                    className="text-black hover:text-white hover:bg-[#0027F3] px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Login
                  </button>
                  {/* Button to open Register Modal */}
                  <button
                    onClick={() => openModal('register')}
                    className="text-black hover:text-white hover:bg-[#0027F3] px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Register
                  </button>
                  {/* Notification Icon */}
                  <Link to="/notification">
                    <i className="fa-regular fa-bell text-xl text-black py-2 px-3 rounded-full border-2 border-black"></i>
                  </Link>
                </div>
              </div>
            </div>

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
                <button
                  onClick={() => openModal('login')}
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => openModal('register')}
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  Register
                </button>
                {/* Mobile Notification Icon */}
                <Link
                  to="/notification"
                  className="block w-full text-black hover:bg-[#0027F3] hover:text-white px-4 py-2 text-base font-medium"
                >
                  <i className="fa-regular fa-bell text-xl"></i> Notifications
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {isLoginModal ? 'Login to Your Account' : 'Sign Up for an Account'}
              </h2>
              <button onClick={closeModal} className="text-gray-500">
                X
              </button>
            </div>

            <form className="space-y-6 mt-4" method="POST">
              {isLoginModal ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-start text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        name="email"
                        type="email"
                        required
                        className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-start text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        name="password"
                        type="password"
                        required
                        className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="email" className="block text-start text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        name="email"
                        type="email"
                        required
                        className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-start text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        name="password"
                        type="password"
                        required
                        className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-start text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        name="confirm_password"
                        type="password"
                        required
                        className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-start text-sm font-medium text-gray-700">
                      Select Role
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="radio"
                        id="manager"
                        name="role"
                        value="MANAGER"
                        checked={role === "MANAGER"}
                        onChange={() => setRole("MANAGER")}
                        className="mr-2"
                      />
                      <label htmlFor="manager" className="text-sm font-medium">Manager</label>
                    </div>
                    <div className="mt-1 flex items-center">
                      <input
                        type="radio"
                        id="finance_staff"
                        name="role"
                        value="FINANCE_STAFF"
                        checked={role === "FINANCE_STAFF"}
                        onChange={() => setRole("FINANCE_STAFF")}
                        className="mr-2"
                      />
                      <label htmlFor="finance_staff" className="text-sm font-medium">Finance Staff</label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-sm font-medium text-white bg-[#3c56dc] rounded-md shadow-sm hover:bg-[#0027F3]"
                >
                  {isLoginModal ? 'Login' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
