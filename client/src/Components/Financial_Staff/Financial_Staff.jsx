import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Financial_Staff() {
  const [errMsg, setErrMsg] = useState(''); // State for error messages
  const [users, setUsers] = useState([]); // State for users
  const navigate = useNavigate(); // Navigation hook

  // Fetch users from the API
  async function getUsers() {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
      const { data } = await axios.get('http://localhost:3000/bonus', {
        headers: {
          token, // Add token in the headers
        },
      });
      console.log(data.data);
      setUsers(data.data); // Assuming data.data is the list of bonuses
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error fetching users'); // Set error message
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Navigate to details page
  const handleEmailClick = (id) => {
    navigate(`/bonus-details/${id}`);
  };

  return (
    <div>
      <div className="border-2 border-[#0027F3] p-4 w-[75%] m-auto">
        <h3 className="text-2xl font-bold text-center">All Bonuses</h3>

        {errMsg ? (
          <p className="text-red-600 text-center">{errMsg}</p>
        ) : (
          users.length > 0 ? (
            users.map((ele) => (
              <div className="flex justify-around p-4 border-b" key={ele._id}>
                <p 
                  className="text-xl font-bold text-[#0027F3] cursor-pointer" 
                  onClick={() => handleEmailClick(ele._id)}
                >
                  {ele.recipient.email}
                </p>
                <p className="text-xl font-bold">Amount: {ele.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Loading bonuses...</p>
          )
        )}
      </div>
    </div>
  );
}
