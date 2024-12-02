import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/cars">Cars</NavLink></li>
        <li><NavLink to="/bookings">Bookings</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/signup">Signup</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navigation;