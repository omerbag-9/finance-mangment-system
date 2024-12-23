import axios from 'axios';
import { Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Manager() {
    const [errMsg, setErrMsg] = useState('');
    const [users, setUsers] = useState([]);

    // Fetch users from the API
    async function getUsers() {
        try {
            const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
            let { data } = await axios.get('http://localhost:3000/user', {
                headers: {
                    'token': token // Add token in the Authorization header
                }
            });
            setUsers(data.data);
            console.log(data.data);
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'Error fetching users');
        }
    }

    // Form submission handler for each user
    const handleBonusSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.post(
                `http://localhost:3000/bonus/${values.userId}`,
                { amount: values.bonus },
                {
                    headers: {
                        'token': token
                    }
                }
            );
            console.log(response.data);
            resetForm(); // Reset the form after submission
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'Error while adding bonus');
        }
        setSubmitting(false);
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <div className="mx-auto my-5 rounded p-3 border-2 border-[#0027F3] text-white">
                <h1 className="text-center text-[#0027F3] py-3 h1">Manage Bonuses</h1>

                {/* Display error message if exists */}
                {errMsg && <div className="alert alert-danger p-0 m-0">{errMsg}</div>}

                <hr className="my-4" />

                {/* Loop through each user and display a form for adding bonuses */}
                {users.map((user) => (
                    <div key={user._id} className="py-3 d-flex justify-content-between text-left w-100">
                        <Link className="col-6">
                            <span className="mx-2 fs-5 text-[#0027F3] text-break">{user.name}</span>
                            <span className="mx-2 fs-5 text-[#0027F3] text-break">{user.email}</span>
                        </Link>

                        <div className="col-6 align-content-center">
                            {/* Form for Add Bonus for this specific user */}
                            <Formik
                                initialValues={{
                                    bonus: '',
                                    userId: user._id // Set the userId to the current user
                                }}
                                onSubmit={handleBonusSubmit}
                            >
                                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                                    <form onSubmit={handleSubmit}>
                                        {/* Hidden userId */}
                                        <input
                                            type="hidden"
                                            name="userId"
                                            value={user._id}
                                            onChange={handleChange}
                                        />
                                        
                                        {/* Bonus input */}
                                        <input
                                            placeholder="Bonus Amount"
                                            type="number"
                                            className="form-control w-75 d-inline mx-2"
                                            name="bonus"
                                            value={values.bonus}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={isSubmitting}
                                        >
                                            Add Bonus
                                        </button>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                ))}

                <hr className="bg-primary text-primary" />
            </div>
        </>
    );
}
