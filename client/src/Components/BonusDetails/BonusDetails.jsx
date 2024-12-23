import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner component
import { toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

export default function BonusDetails() {
  const { id } = useParams(); // Get the ID from URL params
  const [bonusDetails, setBonusDetails] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for bonus details
  const [isApproving, setIsApproving] = useState(false); // State for approve loading
  const [isRejecting, setIsRejecting] = useState(false); // State for reject loading

  // Fetch bonus details by ID
  async function getBonusDetails() {
    setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  }

  // Approve the bonus
  const approveBonus = async () => {
    setIsApproving(true); // Start loading for approve button
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/bonus/approve/${id}`, {}, {
        headers: { token }
      });
      toast.success('Bonus approved successfully!'); // Show success toast
      getBonusDetails(); // Refresh the bonus details after approval
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error approving bonus'); // Show error toast
    } finally {
      setIsApproving(false); // Stop loading after request is finished
    }
  };

  // Reject the bonus
  const rejectBonus = async () => {
    setIsRejecting(true); // Start loading for reject button
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/bonus/reject/${id}`, {}, {
        headers: { token }
      });
      toast.success('Bonus rejected successfully!'); // Show success toast
      getBonusDetails(); // Refresh the bonus details after rejection
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting bonus'); // Show error toast
    } finally {
      setIsRejecting(false); // Stop loading after request is finished
    }
  };

  useEffect(() => {
    getBonusDetails();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      {/* Header Section with Loading */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-t-lg shadow-md mb-6">
        <h1 className="text-4xl font-semibold text-center drop-shadow-lg">
          {loading ? (
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
            `Bonus Details`
          )}
        </h1>
      </header>

      {/* Show Loading Screen if bonus details are being fetched */}
      {loading ? (
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
          {/* Display Bonus Details */}
          {bonusDetails ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bonus Information</h2>
              <div className="space-y-4">
                {/* Each detail section aligned to the same starting point */}
                <div className="flex">
                  <p className="font-bold w-1/3">Name:</p>
                  <p className="w-2/3">{bonusDetails.recipient.name}</p>
                </div>
                <div className="flex">
                  <p className="font-bold w-1/3">Email:</p>
                  <p className="w-2/3">{bonusDetails.recipient.email}</p>
                </div>
                <div className="flex">
                  <p className="font-bold w-1/3">Amount:</p>
                  <p className="w-2/3">{bonusDetails.amount}</p>
                </div>
                <div className="flex">
                  <p className="font-bold w-1/3">Status:</p>
                  <p className="w-2/3">{bonusDetails.status}</p>
                </div>
                <div className="flex">
                  <p className="font-bold w-1/3">Reason:</p>
                  <p className="w-2/3 flex-grow">{bonusDetails.reason}</p> {/* Allow reason to grow */}
                </div>
                <div className="flex">
                  <p className="font-bold w-1/3">Created By:</p>
                  <p className="w-2/3">{bonusDetails.createdBy.email}</p>
                </div>
              </div>

              {/* Approve and Reject Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={rejectBonus}
                  className="bg-red-500 text-white py-2 px-4 mx-2 w-1/2 rounded-lg hover:bg-red-600 transition-colors"
                  disabled={isRejecting || bonusDetails.status === 'Rejected'}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={approveBonus}
                  className="bg-green-500 text-white py-2 px-4 mx-2 w-1/2 rounded-lg hover:bg-green-600 transition-colors"
                  disabled={isApproving || bonusDetails.status === 'Approved'}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No details found.</p>
          )}
        </div>
      )}
    </div>
  );
}
