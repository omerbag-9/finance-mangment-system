import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BonusDetails() {
  const { id } = useParams(); // Get the ID from URL params
  const [bonusDetails, setBonusDetails] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  // Fetch bonus details by ID
  async function getBonusDetails() {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
      const { data } = await axios.get(`http://localhost:3000/bonus/${id}`, {
        headers: {
          token, // Add token in the headers
        },
      });
      setBonusDetails(data.data);
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error fetching bonus details');
    }
  }

  useEffect(() => {
    getBonusDetails();
  }, [id]);

  return (
    <div className="p-4 w-[75%] m-auto">
      <h3 className="text-2xl font-bold text-center pb-3">Bonus Details</h3>

      {errMsg ? (
        <p className="text-red-600 text-center">{errMsg}</p>
      ) : (
        bonusDetails ? (
          <div className="p-4 border rounded shadow-md">
            <p className="text-xl font-bold border-b py-3">Name : {bonusDetails.recipient.name}</p>
            <p className="text-xl font-bold border-b py-3">Email : {bonusDetails.recipient.email}</p>
            <p className="text-xl font-bold border-b py-3">Amount: {bonusDetails.amount}</p>
            <p className="text-xl font-bold border-b py-3">Status: {bonusDetails.status}</p>
            <p className="text-xl font-bold border-b py-3">Reason: {bonusDetails.reason}</p>
            <p className="text-xl font-bold border-b py-3">CreatedBy : {bonusDetails.createdBy.email}</p>
            {/* <p className="text-lg border-b pb-2">Date: {new Date(bonusDetails.date).toLocaleDateString()}</p> */}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading details...</p>
        )
      )}
    </div>
  );
}
