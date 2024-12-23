import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner component

export default function Financial_Staff() {
  const [errMsg, setErrMsg] = useState(''); // State for error messages
  const [users, setUsers] = useState([]); // State for users
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [loading, setLoading] = useState(false); // Loading state
  const [statusFilter, setStatusFilter] = useState(''); // Status filter state (pending, approved, rejected)
  const navigate = useNavigate(); // Navigation hook

  // Fetch users from the API
  async function getUsers() {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
      const { data } = await axios.get('http://localhost:3000/bonus', {
        headers: {
          token, // Add token in the headers
        },
      });
      setUsers(data.data); // Assuming data.data is the list of bonuses
      setFilteredUsers(data.data); // Set filteredUsers initially to all users
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error fetching bonuses');
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) =>
      user.recipient.email.toLowerCase().includes(query) || user.amount.toString().includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Handle filter by status
  const handleStatusFilter = (e) => {
    const filter = e.target.value;
    setStatusFilter(filter);

    // Filter the users by the selected status
    const filtered = users.filter((user) => {
      if (filter === '') return true; // If no status is selected, show all users
      return user.status.toLowerCase() === filter.toLowerCase();
    });
    setFilteredUsers(filtered);
  };

  // Navigate to details page
  const handleEmailClick = (id) => {
    navigate(`/bonus-details/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">All Bonuses</h1>

        {/* Search Bar */}
        <div className="relative mb-6 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by email or amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <i className="fas fa-search text-gray-400 absolute right-4"></i>
        </div>

        {/* Status Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="statusFilter" className="text-sm font-semibold text-gray-600">Filter by Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
              filteredUsers.map((bonus) => (
                <div
                  key={bonus._id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600">{bonus.recipient.email}</h2>
                    <p className="text-sm text-gray-600">Amount: {bonus.amount}</p>
                    <p className="text-sm text-gray-600">Status: <span className={`font-semibold ${bonus.status === 'approved' ? 'text-green-600' : bonus.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{bonus.status}</span></p>
                  </div>
                  <button
                    onClick={() => handleEmailClick(bonus._id)}
                    className="text-blue-500 text-sm font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No bonuses found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
