/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

const Logout = ({ className }) => {
  return (
    <div className={`logout ${className}`}>
      <div className="overlap-group-3">
        <div className="text-wrapper-17">Logout</div>

        <img
          className="lucide-log-out"
          alt="Lucide log out"
          src="https://c.animaapp.com/kZX9QJ4w/img/lucide-log-out-1.svg"
        />
      </div>
    </div>
  );
};
export default Logout;