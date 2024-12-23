import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Manager from '../Manager/Manager';
import Financial_Staff from '../Financial_Staff/Financial_Staff';

export default function Home() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  return (
    <>
      {role === 'MANAGER' && <Manager />}
      {role === 'FINANCE_STAFF' && <Financial_Staff />}
    </>
  );
}
