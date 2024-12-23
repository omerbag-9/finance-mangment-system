import React, { useState } from 'react'
import BonusDashboard from '../Financial_Staff_Dashboard/Financial_Staff_Dashboard'
import ManagerDashboard from '../ManagerDashboard/ManagerDashboard';

export default function Dashboard() {
      const [role, setRole] = useState(localStorage.getItem('role'));
    
  return (
    <>
          {role === 'MANAGER' && <ManagerDashboard />}
          {role === 'FINANCE_STAFF' && <BonusDashboard />}
        </>
  )
}
