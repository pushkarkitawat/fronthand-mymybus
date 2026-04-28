import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaBusAlt } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


export default function LoginPage({brandConfig}) {
  const { appName, logoImage, tagline } = brandConfig;

  useEffect(() => {
    function createBubbles() {
      const bubblesContainer = document.body;
      for (let i = 0; i < 8; i++) {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        const size = Math.random() * 50 + 20;
        bubble.style.width  = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.top    = `${Math.random() * 100}%`;
        bubble.style.left   = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        bubblesContainer.appendChild(bubble);
      }
    }
    createBubbles();
  });

  const [form, setForm]       = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.password) { alert("Please fill all fields"); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Login Successful!");
        localStorage.setItem("bluebus_token", data.token);
        navigate("/dashboard");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (service) => alert(`${service} login would be implemented here`);

  return (
    <div className="login-container">
      <div className="login-card">

        {/* ── Header ── */}
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              {logoImage
                ? <img src={logoImage} alt={appName} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                : <FaBusAlt />}
            </div>
            <h1 className="login-title">{appName}</h1>
          </div>
          <p className="login-subtitle">{tagline}</p>
        </div>

        {/* ── Form ── */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Name</label>
            <div className="input-with-icon">
              <i className="input-icon"><IoPerson /></i>
              <input
                type="text" id="email" name="name"
                className="login-input" onChange={handleChange}
                placeholder="Enter your name" required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="input-icon"><FaLock /></i>
              <input
                type="password" id="password" name="password"
                className="login-input" onChange={handleChange}
                placeholder="Enter your password" required
              />
            </div>
          </div>

          <button type="submit" className="login-button" id="loginBtn" disabled={loading}>
            <span id="btnText">{loading ? "Logging in…" : "Login"}</span>
          </button>

          <div className="divider">
            <span className="divider-text">Or continue with</span>
          </div>

          <div className="social-login">
            <div className="social-btn facebook" onClick={() => handleSocialLogin("WhatsApp")}><IoLogoWhatsapp /></div>
            <div className="social-btn google"   onClick={() => handleSocialLogin("Facebook")}><FaFacebook /></div>
            <div className="social-btn twitter"  onClick={() => handleSocialLogin("Instagram")}><FaInstagram /></div>
          </div>
        </form>

      </div>
    </div>
  );
}