import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserDetails() {
    const [isLoading, setIsLoading] = useState(false); // for form submission loading
    const [userLoading, setUserLoading] = useState(true); // for fetching user details loading
    const [errMsg, setErrMsg] = useState('');
    const [user, setUser] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const validationSchema = yup.object({
        title: yup.string().required('Title is required'),
        amount: yup.number().required('Amount is required').positive('Amount must be positive'),
        reason: yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters')
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            amount: '',
            reason: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = {
                    ...values,
                    recipient: id
                };
                const { data } = await axios.post(`http://localhost:3000/bonus/${id}`, payload, {
                    headers: {
                        'token': `${localStorage.getItem('userToken')}`
                    }
                });
                if (data.success) {
                    toast.success('Bonus added successfully!');
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (err) {
                setErrMsg(err.response?.data?.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }
    });

    async function getUserDetails() {
        setUserLoading(true); // Start loading
        try {
            const token = localStorage.getItem('userToken');
            let { data } = await axios.get(`http://localhost:3000/user/profile/${id}`, {
                headers: { token }
            });
            if (data.success) {
                setUser(data.data);
            }
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'An error occurred');
        } finally {
            setUserLoading(false); // Stop loading
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-10 px-6">
            <ToastContainer />

            {/* Header Section with Loading */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-t-lg shadow-md mb-6">
                <h1 className="text-4xl font-semibold text-center drop-shadow-lg">
                    {userLoading ? (
                        <div className="flex justify-center items-center">
                            <ThreeDots
                                visible={true}
                                height="40"
                                width="40"
                                radius="9"
                                color="#fff"
                                ariaLabel="three-dots-loading"
                            />
                        </div>
                    ) : (
                        `Add Bonus for ${user.name || 'User'}`
                    )}
                </h1>
            </header>

            {errMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {errMsg}
                </div>
            )}

            {/* Show Loading Screen if user data is being fetched */}
            {userLoading ? (
                <div className="flex justify-center items-center py-12">
                    <ThreeDots
                        visible={true}
                        height="50"
                        width="50"
                        radius="9"
                        color="gray"
                        ariaLabel="three-dots-loading"
                    />
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">{user.name || 'User Name'}</h2>
                    <p className="text-gray-600">{user.email || 'User Email'}</p>
                </div>
            )}

            {/* Form for Bonus Submission */}
            {!userLoading && (
                <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                            Bonus Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...formik.getFieldProps('title')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.title}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                            Bonus Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            {...formik.getFieldProps('amount')}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.amount && formik.errors.amount && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.amount}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                            Reason
                        </label>
                        <textarea
                            id="reason"
                            {...formik.getFieldProps('reason')}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.reason && formik.errors.reason && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.reason}</div>
                        )}
                    </div>

                    <div>
                        {isLoading ? (
                            <button
                                type="button"
                                disabled
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg opacity-50 cursor-not-allowed flex justify-center"
                            >
                                <ThreeDots
                                    visible={true}
                                    height="20"
                                    width="40"
                                    color="#fff"
                                    radius="5"
                                    ariaLabel="three-dots-loading"
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
            )}
        </div>
    );
}
