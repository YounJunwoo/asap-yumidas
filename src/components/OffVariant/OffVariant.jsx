/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

const OffVariant = ({ className }) => {
  return (
    <div className={`off-variant ${className}`}>
      <div className="manual-text-wrapper">
        <div className="manual-text">수동</div>
      </div>

      <div className="auto-text">자동</div>
    </div>
  );
};

export default OffVariant;