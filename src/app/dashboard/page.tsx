'use client'
import React, { useEffect } from 'react';
import styles from "../ui/dashboard/dashboard.module.css";

import Cookies from 'js-cookie';

const Dashboard = () => {

  useEffect(() => {
    // Read cookie
    const myCookieValue = Cookies.get('myCookie');

    // Use the cookie value as needed
    console.log('Cookie value:', myCookieValue);
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <h1>welcome to akgu Admin Dashboard</h1>
        </div>
    </div>
  );
};

export default Dashboard;
