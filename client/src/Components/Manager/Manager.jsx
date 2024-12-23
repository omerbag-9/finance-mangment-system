import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner component

export default function Manager() {
    const [errMsg, setErrMsg] = useState('');
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    async function getUsers() {
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
            let { data } = await axios.get('http://localhost:3000/user', {
                headers: {
                    token: token, // Add token in the Authorization header
                },
            });
            setUsers(data.data);
            setFilteredUsers(data.data); // Set filteredUsers initially to all users
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'Error fetching users');
        } finally {
            setLoading(false); // Stop loading once the data is fetched
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(query) || user.name.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">User Management</h1>

                {/* Search Bar */}
                <div className="relative mb-6 flex items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by name or email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                    <i className="fas fa-search text-gray-400 absolute right-4"></i>
                </div>

                {/* Error Message */}
                {errMsg && (
                    <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-6">
                        {errMsg}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <ThreeDots
                            height="50"
                            width="50"
                            radius="9"
                            color="gray"
                            ariaLabel="three-dots-loading"
                            visible={true}
                        />
                    </div>
                )}

                {/* User List */}
                {!loading && (
                    <div className="space-y-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-blue-600">{user.name}</h2>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                    <Link
                                        to={`/${user._id}`}
                                        className="text-blue-500 text-sm font-medium hover:underline"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No users found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
