import React, { useState, useEffect } from "react";
import "./register.css";
import { BackButton2 } from "../component/blueback";

const Register = ({brandConfig}) => {
  const { appName } = brandConfig;

  const [bookings,        setBookings]        = useState([]);
  const [filteredBookings,setFilteredBookings]= useState([]);
  const [selectedDate,    setSelectedDate]    = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      try {
        const res  = await fetch(`${import.meta.env.API}/api/booking/bookings?date=${today}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]); setFilteredBookings([]);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id) => {
    try {
      const res  = await fetch(`${import.meta.env.API}/api/booking/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid" }),
      });
      const data = await res.json();
      if (!data.success) { alert(data.message); return; }
      setFilteredBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Paid" } : b));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handlePrintTicket = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.API}/api/booking/ticket/${id}`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "ticket.pdf"; a.click();
    } catch (err) {
      console.error(err);
      alert("Error while fetching ticket");
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    try {
      const res = await fetch(`${import.meta.env.API}/api/booking/bookings?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      setFilteredBookings(await res.json());
    } catch (error) {
      console.error(error);
      setFilteredBookings([]);
    }
  };

  // Group bookings by bus
  const groups = filteredBookings.reduce((acc, booking) => {
    const key = `${booking.busNo}||${booking.busName}`;
    if (!acc[key]) acc[key] = { busNo: booking.busNo, busName: booking.busName, bookings: [] };
    acc[key].bookings.push(booking);
    return acc;
  }, {});

  return (
    <div className="register-container">
      <h2>{appName} — Booking Register</h2>

      <div className="filter-section">
        <label>Select Date:</label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <div id="backbutton" style={{ color: "skyblue" }}><BackButton2 /></div>
      </div>

      <table className="register-table">
        {filteredBookings.length > 0 ? Object.values(groups).map((group, index) => (
          <React.Fragment key={index}>
            <thead>
              <tr>
                <th colSpan="1" style={{ textAlign: "left", height: "30px", width: "200px", backgroundColor: "var(--bb-primary)" }}>
                  {group.busName} {group.busNo}
                </th>
              </tr>
              <tr>
                <th>Date</th><th>Seat No</th><th>Passenger</th>
                <th>From</th><th>Phone No</th><th>Payment</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {group.bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.journey_date}</td>
                  <td>{booking.seatNo}</td>
                  <td>{booking.passenger}</td>
                  <td>{booking.fromCity}</td>
                  <td>{booking.mobile}</td>
                  <td style={{ color: ["Cancel", "Unpaid"].includes(booking.status) ? "red" : "green", fontSize: 18, fontWeight: "bold" }}>
                    {booking.status}
                  </td>
                  <td>
                    {booking.status === "Unpaid" ? (
                      <button
                        style={{ width: 100, height: 30, backgroundColor: "green", color: "#fff", borderRadius: 5, border: "none", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}
                        onClick={() => handleStatusUpdate(booking.id)}
                      >Paid</button>
                    ) : booking.status === "Paid" ? (
                      <button
                        style={{ width: 100, height: 30, backgroundColor: "var(--bb-primary)", color: "#fff", borderRadius: 5, border: "none", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}
                        onClick={() => handlePrintTicket(booking.id)}
                      >Print</button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </React.Fragment>
        )) : (
          <tbody>
            <tr><td colSpan="7" className="no-data">No bookings found for this date</td></tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Register;