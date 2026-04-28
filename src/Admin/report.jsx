import React, { useState, useEffect } from "react";
import "./report.css";
import { BackButton2 } from "../component/blueback";

export default function Report({brandConfig}) {
  const { appName, logoText, logoImage } = brandConfig;

  const [bookings,   setBookings]   = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [month,      setMonth]      = useState("");
  const [year,       setYear]       = useState("");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res  = await fetch(`${import.meta.env.API}/api/booking/booking`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const bookingDate = new Date(b.jdate);

    if (filterType === "month") {
      if (!month || !year) return true;
      if (bookingDate.getMonth() + 1 !== parseInt(month) || bookingDate.getFullYear() !== parseInt(year)) return false;
    }
    if (filterType === "year") {
      if (!year) return true;
      if (bookingDate.getFullYear() !== parseInt(year)) return false;
    }
    if (filterType === "custom" && startDate && endDate) {
      if (bookingDate < new Date(startDate) || bookingDate > new Date(endDate)) return false;
    }
    if (search) {
      const term = search.toLowerCase();
      return b.pnr.toLowerCase().includes(term) ||
             b.name.toLowerCase().includes(term) ||
             b.from.toLowerCase().includes(term) ||
             b.to.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="bluebus-container">
      {/* ── Header ── */}
      <div className="header">
        <div className="header-logo">
          {logoImage
            ? <img src={logoImage} alt={appName} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
            : logoText}
        </div>
        <div className="header-text">
          <h1>Booking Report</h1>
          <p>Filter and view {appName} bookings</p>
        </div>
        <div id="backbutton"><BackButton2 /></div>
      </div>

      {/* ── Filters ── */}
      <div className="filter-row">
        <input type="text" placeholder="Search by PNR, Name, From, To…" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {filterType === "month" && (<>
          <select value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
            ))}
          </select>
          <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        </>)}
        {filterType === "year" && <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />}
        {filterType === "custom" && (<>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate}   onChange={e => setEndDate(e.target.value)} />
        </>)}
      </div>

      {/* ── Table ── */}
      <div className="report-card">
        {loading ? <p>Loading bookings…</p> : (
          <table className="report-table">
            <thead>
              <tr>
                <th>PNR</th><th>Name</th><th>Journey</th><th>Date</th>
                <th>Fare</th><th>Extra</th><th>Payment</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                <>
                  {filteredBookings.map((b, i) => (
                    <tr key={i}>
                      <td>{b.pnr}</td>
                      <td>{b.name}</td>
                      <td>{b.from} → {b.to}</td>
                      <td>{b.jdate}</td>
                      <td>₹{b.amount}</td>
                      <td>₹{b.extra || 0}</td>
                      <td>{b.paymode}</td>
                      <td className={b.status === "Cancel" ? "status-cancelled" : b.status === "Paid" ? "status-confirmed" : "status-pending"}>
                        {b.status}
                      </td>
                    </tr>
                  ))}
                  <tr className="totals-row">
                    <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Totals:</td>
                    <td style={{ fontWeight: "bold" }}>₹{filteredBookings.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0)}</td>
                    <td style={{ fontWeight: "bold" }}>₹{filteredBookings.reduce((s, b) => s + (parseFloat(b.extra) || 0), 0)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </>
              ) : (
                <tr><td colSpan="8" style={{ textAlign: "center" }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}