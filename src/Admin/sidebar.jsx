import React from 'react';
import { Link } from 'react-router-dom';
import { SlCalender } from "react-icons/sl";
import { GoGraph } from "react-icons/go";
import { FaBookOpen } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";

import './sidebar.css';

export default function Sidebar({brandConfig}) {
  const { appName, logoText, logoImage } = brandConfig;

  return (
    <div className='bar'>
      {/* ── Logo ── */}
      <div className='sidebar-brand'>
        {logoImage ? (
          <img src={logoImage} alt={appName} className='sidebar-logo-img' />
        ) : (
          <span className='sidebar-logo-text'>{logoText}</span>
        )}
        <h2>{appName}</h2>
      </div>

      <div className='links'>
        <ul>
          <li><Link to="/"              className='link'><span><GoGraph /></span>           Dashboard</Link></li>
          <li><Link to="/Book-Ticket"   className='link'><span><SlCalender /></span>        Book Ticket</Link></li>
          <li><Link to="/Manage-Ticket" className='link'><span><FaMoneyBillTransfer /></span>Manage Booking</Link></li>
          <li><Link to="/Report"        className='link'><span><IoBarChartOutline /></span> Report</Link></li>
          <li><Link to="/Register"      className='link'><span><FaBookOpen /></span>        Register</Link></li>
        </ul>
      </div>
    </div>
  );
}