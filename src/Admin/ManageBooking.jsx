import React, { useState } from "react";
import "./bookticket.css";
import { BackButton2 } from "../component/blueback";


export default function ManageBooking({brandConfig}) {
  const { appName, logoText, logoImage } = brandConfig;

  const [search,          setSearch]          = useState("");
  const [bookings,        setBookings]        = useState([]);
  const [cancelReason,    setCancelReason]    = useState("");
  const [showCancelInput, setShowCancelInput] = useState(null);

  const handleSearch = async () => {
    if (!search.trim()) return alert("Enter PNR or Mobile");
    try {
      const res = await fetch(`${import.meta.env.API}/api/booking/pnr/${encodeURIComponent(search)}`);
      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Booking not found!");
      }
      setBookings(await res.json());
    } catch (error) {
      console.error(error);
      alert("Failed to fetch booking. Try again later.");
    }
  };

  const handleCancel = async (pnr) => {
    if (!cancelReason.trim()) return alert("Please enter a reason for cancellation");
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res  = await fetch(`${import.meta.env.API}/api/booking/cancel/${pnr}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setBookings(prev => prev.map(b => b.pnr === pnr ? { ...b, status: "Cancelled", cancelReason } : b));
        setShowCancelInput(null);
        setCancelReason("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Server error while cancelling.");
    }
  };

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
          <h1>Manage Booking</h1>
          <p>Check, update or cancel your {appName} ticket</p>
        </div>
        <div id="backbutton" style={{ left: "65%" }}><BackButton2 color="white" /></div>
      </div>

      {/* ── Search ── */}
      <div className="card">
        <h3>Find Your Booking</h3>
        <div className="form-row">
          <input
            type="text" value={search} maxLength={10}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter PNR or Mobile number"
          />
          <button id="manage-search" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* ── Results ── */}
      {bookings.map((booking, index) => (
        <div className="card" key={index} style={{ marginTop: "20px" }}>
          <h3>Booking Details</h3>
          <p><strong>PNR:</strong>      {booking.pnr}</p>
          <p><strong>Name:</strong>     {booking.name} ({booking.age}, {booking.gender})</p>
          <p><strong>Mobile:</strong>   {booking.mobile}</p>
          <p><strong>Journey:</strong>  {booking.from_city} → {booking.to_city} <b>on</b> {booking.journey_date}</p>
          <p><strong>Boarding:</strong> {booking.boarding_ponit}</p>
          <p><strong>Dropping:</strong> {booking.droping_ponit}</p>
          <p><strong>Fare:</strong>     ₹{booking.amount}</p>
          <p><strong>Payment:</strong>  {booking.paymode}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: booking.status === "Paid" ? "green" : booking.status === "Cancelled" ? "red" : "orange" }}>
              {booking.status}
            </span>
          </p>

          {booking.status === "Paid" && (
            showCancelInput === booking.pnr ? (
              <>
                <input
                  type="text" placeholder="Enter cancellation reason"
                  value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <button id="cancel-button" onClick={() => handleCancel(booking.pnr)}>Confirm Cancel</button>
                <button id="cancel-button" style={{ backgroundColor: "gray" }} onClick={() => setShowCancelInput(null)}>Close</button>
              </>
            ) : (
              <button id="cancel-button" onClick={() => setShowCancelInput(booking.pnr)}>Cancel</button>
            )
          )}
        </div>
      ))}
    </div>
  );
}