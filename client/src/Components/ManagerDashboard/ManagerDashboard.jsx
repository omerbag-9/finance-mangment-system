import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ManagerDashboard() {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    managerCount: 0,
    financeStaffCount: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  // Fetch all users
  async function getUserStats() {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get('http://localhost:3000/user', {
        headers: { token },
      });

      const users = data.data;

      // Calculate counts for total, active, inactive, and by role
      let activeCount = 0;
      let inactiveCount = 0;
      let managerCount = 0;
      let financeStaffCount = 0;

      users.forEach((user) => {
        if (user.isActive) {
          activeCount++;
        } else {
          inactiveCount++;
        }

        if (user.role === 'MANAGER') {
          managerCount++;
        } else if (user.role === 'FINANCE_STAFF') {
          financeStaffCount++;
        }
      });

      setUserStats({
        total: users.length,
        active: activeCount,
        inactive: inactiveCount,
        managerCount,
        financeStaffCount,
      });
      setUsers(users);
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error fetching user stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserStats();
  }, []);

  // Chart Data for Bar Chart (Role Distribution)
  const barChartData = {
    labels: ['Manager', 'Finance Staff'],
    datasets: [
      {
        label: 'User Count by Role',
        data: [userStats.managerCount, userStats.financeStaffCount],
        backgroundColor: ['#34D399', '#F87171'], // Green, Red
        borderColor: ['#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Pie Chart (Active vs. Inactive)
  const pieChartData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        data: [userStats.active, userStats.inactive],
        backgroundColor: ['#34D399', '#F87171'], // Green, Red
        borderColor: ['#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Manager User Dashboard</h1>

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
          {/* User Stats Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Users:</span>
                <span>{userStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Active Users:</span>
                <span>{userStats.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Inactive Users:</span>
                <span>{userStats.inactive}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Managers:</span>
                <span>{userStats.managerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Finance Staff:</span>
                <span>{userStats.financeStaffCount}</span>
              </div>
            </div>
          </div>

          {/* Bar Chart - Role Distribution */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Count by Role</h2>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>

          {/* Pie Chart - Active vs Inactive Users */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active vs Inactive Users</h2>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

         {/* User Table */}
<div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 w-full overflow-x-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">User List</h2>
  <table className="min-w-full table-auto border-collapse">
    <thead>
      <tr className="bg-gray-100 text-gray-800">
        <th className="py-3 px-6 border-b text-left">Name</th>
        <th className="py-3 px-6 border-b text-left">Email</th>
        <th className="py-3 px-6 border-b text-left">Role</th>
        <th className="py-3 px-6 border-b text-left">Status</th>
        <th className="py-3 px-6 border-b text-left">Created At</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr
          key={user._id}
          className="text-gray-700 hover:bg-gray-50 transition duration-300 ease-in-out"
        >
          <td className="py-3 px-6 border-b">{user.name}</td>
          <td className="py-3 px-6 border-b">{user.email}</td>
          <td className="py-3 px-6 border-b">{user.role || 'N/A'}</td>
          <td className="py-3 px-6 border-b">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.isActive
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="py-3 px-6 border-b">
            {new Date(user.createdAt).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>
      )}
    </div>
  );
}
