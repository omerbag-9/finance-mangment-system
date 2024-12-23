import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';
import { UserContext } from '../../context/UserContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext);

  const validationSchema = yup.object({
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: loginSubmit,
  });

  async function loginSubmit(values) {
    setIsLoading(true);
    let { data } = await axios
      .post('http://localhost:3000/auth/login', values)
      .catch((err) => {
        setErrMsg(err.response.data.message);
        setIsLoading(false);
        
      });
      console.log(data);
      
    if (data.success === true) {
      setIsLoading(false)
      localStorage.setItem('userToken', data.accessToken)
      localStorage.setItem('role', data?.data?.role)
      setUserToken(data.token)
      navigate('/')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {errMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errMsg}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
