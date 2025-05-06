import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <header
        style={{
          padding: "1rem",
          background: "#007acc",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>My App</h1>
        <nav>
          {/* Links to internal pages */}
          <Link to='/' style={{ marginRight: "1rem", color: "#fff" }}>
            Home
          </Link>
          <Link to='/about' style={{ marginRight: "1rem", color: "#fff" }}>
            About
          </Link>
          {/* Link to the Login page */}
          <Link to='/login' style={{ color: "#fff" }}>
            Login
          </Link>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        {/* This Outlet renders child routes (Home or About) */}
        <Outlet />
      </main>
      <footer
        style={{
          padding: "1rem",
          background: "#eee",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        © 2025 My App
      </footer>
    </div>
  );
};

export default MainLayout;