import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import "./bluebusdasboard.css";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaBus, FaChartBar, FaTicketAlt, FaUsers } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Bluebusdasboard({brandConfig}) {
  const {appName,colors}  =  brandConfig;

  // Safe access with fallbacks in case colors is undefined
  const primary   = colors?.primary   ?? "#2f80ed";
  const accent    = colors?.accent    ?? "#87CEEB";
  const [stats,      setStats]      = useState({});
  const [activities, setActivities] = useState([]);
  const [chartData,  setChartData]  = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetch(`${import.meta.env.API}/api/dashboard/stats`)
      .then(r => r.json()).then(setStats);

    fetch(`${import.meta.env.API}/api/dashboard/weekly-commission`)
      .then(r => r.json())
      .then(data => setChartData({
        labels: data.map(d => d.day),
        datasets: [{
          label: "Commission (₹)",
          data: data.map(d => d.total * 0.1),
          borderColor: accent,
          pointBackgroundColor: "white",
          pointBorderColor: primary,
          backgroundColor: primary + "33",
          tension: 0.4,
          fill: true,
        }],
      }));

    fetch(`${import.meta.env.API}/api/dashboard/activities`)
      .then(r => r.json()).then(setActivities);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#111" } },
      title:  { display: true, text: "Weekly Commission Overview", color: "#111" },
    },
    scales: {
      x: { ticks: { color: accent, font: { size: 14, weight: "bold" } } },
      y: { ticks: { color: accent, font: { size: 14, weight: "bold" } } },
    },
  };

  return (
    <>
      <div className="sidebar"><Sidebar brandConfig={brandConfig} /></div>

      <div className="dashboard-navbar">
        <h1 className="dashboard-title">{appName} — Dashboard</h1>
      </div>

      <div className="dash">
        <div className="dashboard">
          <div className="stats">
            <div className="stat-card"><div className="stat-icon"><FaBus /></div>        <p>{stats.totalBuses}</p>     <p>Total Buses</p></div>
            <div className="stat-card"><div className="stat-icon"><FaTicketAlt /></div>  <p>{stats.bookingsToday}</p>  <p>Bookings Today</p></div>
            <div className="stat-card"><div className="stat-icon"><FaUsers /></div>      <p>{stats.totalPassengers}</p><p>Total Passengers</p></div>
            <div className="stat-card"><div className="stat-icon"><FaChartBar /></div>   <p>₹{stats.commission}</p>   <p>Commission</p></div>
            <div className="stat-card" style={{ width: "465px", marginBottom: "80px", gap: "20px" }}>
              <div className="stat-icon"><FaMoneyBillTrendUp /></div>
              <h4>₹{stats.extra || 0}</h4>
              <p>Extra</p>
            </div>
          </div>
        </div>

        <div className="activities">
          <h2 className="activities-title">Recent Activity</h2>
          <ul>{activities.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>

        <div className="graph">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </>
  );
}