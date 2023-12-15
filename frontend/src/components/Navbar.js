import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleItemClick = (index) => {
    setActiveLink(index);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0">
      <img src={"clinic-logo.png"} width="100" alt="Clinic Logo" />
      <Link to="/" className="navbar-brand p-0">
        <h1 className="m-0 text-primary">
          <i className="fa fa-tooth me-2"></i>El7a2ni
        </h1>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link
            to="/"
            className={`nav-item nav-link ${activeLink === 0 ? "active" : ""}`}
            onMouseEnter={() => handleItemClick(0)}
            onClick={() => handleItemClick(0)}
            style={{ color: activeLink === 0 ? "#06a3da" : "" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`nav-item nav-link ${activeLink === 1 ? "active" : ""}`}
            onMouseEnter={() => handleItemClick(1)}
            onClick={() => handleItemClick(1)}
            style={{ color: activeLink === 1 ? "#06a3da" : "" }}
          >
            About
          </Link>
          <Link
            to="/service"
            className={`nav-item nav-link ${activeLink === 2 ? "active" : ""}`}
            onMouseEnter={() => handleItemClick(2)}
            onClick={() => handleItemClick(2)}
            style={{ color: activeLink === 2 ? "#06a3da" : "" }}
          >
            Service
          </Link>
          <Link
            to="/contact"
            className={`nav-item nav-link ${activeLink === 3 ? "active" : ""}`}
            onMouseEnter={() => handleItemClick(3)}
            onClick={() => handleItemClick(3)}
            style={{ color: activeLink === 3 ? "#06a3da" : "" }}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
