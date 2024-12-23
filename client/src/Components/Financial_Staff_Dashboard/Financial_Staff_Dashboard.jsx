import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


export default function BonusDashboard() {
  const [bonusStats, setBonusStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    amountApproved: 0,
    amountRejected: 0,
    averageBonusAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Fetch bonus stats
  async function getBonusStats() {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get('http://localhost:3000/bonus', {
        headers: { token },
      });

      // Assuming that response.data.data contains an array of bonus objects
      const bonuses = data.data;

      // Calculate counts and amounts for each status (pending, approved, rejected)
      let approvedCount = 0;
      let rejectedCount = 0;
      let pendingCount = 0;
      let approvedAmount = 0;
      let rejectedAmount = 0;
      let totalAmount = 0;

      bonuses.forEach((bonus) => {
        totalAmount += bonus.amount; // Calculate total amount for all bonuses
        if (bonus.status === 'APPROVED') {
          approvedCount++;
          approvedAmount += bonus.amount;
        } else if (bonus.status === 'REJECTED') {
          rejectedCount++;
          rejectedAmount += bonus.amount;
        } else {
          pendingCount++;
        }
      });

      // Calculate average bonus amount
      const averageBonusAmount = bonuses.length ? totalAmount / bonuses.length : 0;

      setBonusStats({
        total: bonuses.length,
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        amountApproved: approvedAmount,
        amountRejected: rejectedAmount,
        averageBonusAmount: averageBonusAmount,
      });
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error fetching bonus stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBonusStats();
  }, []);

  // Chart Data for Bar Chart (Bonus Count)
  const barChartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        label: 'Bonuses Count',
        data: [bonusStats.approved, bonusStats.rejected, bonusStats.pending],
        backgroundColor: ['#34D399', '#F87171', '#FBBF24'], // Green, Red, Yellow
        borderColor: ['#34D399', '#F87171', '#FBBF24'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Pie Chart (Amount Distribution)
  const pieChartData = {
    labels: ['Approved Amount', 'Rejected Amount'],
    datasets: [
      {
        data: [bonusStats.amountApproved, bonusStats.amountRejected],
        backgroundColor: ['#34D399', '#F87171'], // Green, Red
        borderColor: ['#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Bar Chart (Bonus Amount Ranges)
  const amountRanges = ['0-1000', '1001-3000', '3001-5000', '5001+'];
  const barChartByAmount = {
    labels: amountRanges,
    datasets: [
      {
        label: 'Bonuses by Amount Range',
        data: [
          bonusStats.amountApproved < 1000 ? 1 : 0, 
          bonusStats.amountApproved >= 1000 && bonusStats.amountApproved < 3000 ? 1 : 0,
          bonusStats.amountApproved >= 3000 && bonusStats.amountApproved < 5000 ? 1 : 0,
          bonusStats.amountApproved >= 5000 ? 1 : 0
        ],
        backgroundColor: '#60A5FA', // Light Blue
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Bonus Dashboard</h1>

      {/* Error Message */}
      {errMsg && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-6">
          {errMsg}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Stats */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bonus Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Bonuses:</span>
                <span>{bonusStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Approved Amount:</span>
                <span>${bonusStats.amountApproved}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Rejected Amount:</span>
                <span>${bonusStats.amountRejected}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Average Bonus Amount:</span>
                <span>${bonusStats.averageBonusAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bar Chart - Bonuses Count */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bonus Status Count</h2>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          {/* Pie Chart - Amount Distribution */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bonus Amount Distribution</h2>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          {/* Bar Chart - Bonus Amount Ranges */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bonuses by Amount Range</h2>
            <Bar data={barChartByAmount} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
}
