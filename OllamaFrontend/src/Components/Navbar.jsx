import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#f4f4f4", marginBottom: "20px" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
        <li>
          <Link to="/Student">Student</Link>
        </li>
        <li>
          <Link to="/Teacher">Teacher</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
