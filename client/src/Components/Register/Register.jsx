import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required('Name is required').min(3, "Name min length is 3").max(10, "Name max length is 10"),
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
    rePassword: yup.string().oneOf([yup.ref('password')], 'Password does not match').required('RePassword is required'),
    role: yup.string().required('Role selection is required').oneOf(['MANAGER', 'FINANCE_STAFF'], 'Invalid role selected'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      role: '',
    },
    validationSchema,
    onSubmit: registerSubmit
  });

  async function registerSubmit(values) {
    setIsLoading(true);
    let { data } = await axios.post('http://localhost:3000/auth/signup', values).catch((err) => {
      setErrMsg(err.response.data.message);
      setIsLoading(false);
    });

    if (data.success === true) {
      setIsLoading(false);
      navigate('/login');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      {errMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errMsg}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label htmlFor="rePassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="rePassword"
            name="rePassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rePassword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.rePassword && formik.errors.rePassword && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.rePassword}</div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="manager"
                name="role"
                value="MANAGER"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mr-2"
              />
              <label htmlFor="manager" className="text-gray-700">Manager</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="finance"
                name="role"
                value="FINANCE_STAFF"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mr-2"
              />
              <label htmlFor="finance" className="text-gray-700">Finance Staff</label>
            </div>
          </div>
          {formik.touched.role && formik.errors.role && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.role}</div>
          )}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <button
              disabled={!(formik.isValid && formik.dirty)}
              type="button"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
            >
              <ThreeDots
                visible={true}
                height="20"
                width="40"
                color="#fff"
                radius="5"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}