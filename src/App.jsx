
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const Comp0 = lazy(() => import("./Admin/bluebuslogin"));
const Comp1 = lazy(() => import("./Admin/bluebusdasboard"));
const Comp2 = lazy(() => import("./Admin/bluebusbooktickect"));
const Comp3 = lazy(() => import("./Admin/ManageBooking"));
const Comp4 = lazy(() => import("./Admin/register"));


const brandConfig = {
  appName: "mymybus",
  logoText: "M",
  logoImage: null,

  tagline: "Welcome to mymybus",
  subTagline: "Manage your business easily",

  colors: {
    primary: "#2f80ed",
    secondary: "#3aa0ff",
    accent: "#87CEEB",
    headerGradStart: "#2f80ed",
    headerGradEnd: "#3aa0ff",
    pageBg: "#f4f6fb",
    sidebarBg: "#f3f3f3",
    sidebarText: "#0d5bc2",
    textDark: "#0b2546",
    cardBg: "#ffffff",
  },

  font: "'Segoe UI', Tahoma, sans-serif",
};

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Comp0 brandConfig={brandConfig} />} />
<Route path="/dashboard" element={<Comp1 brandConfig={brandConfig} />} />
<Route path="/book-ticket" element={<Comp2 brandConfig={brandConfig} />} />
<Route path="/manage-ticket" element={<Comp3 brandConfig={brandConfig} />} />
<Route path="/register" element={<Comp4 brandConfig={brandConfig} />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
