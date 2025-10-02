/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

const DivWrapper = ({
  className,
  divClassName,
  text = "현재 기온을 알려줘",
}) => {
  return (
    <div className={`div-wrapper ${className}`}>
      <div className={`text-wrapper-19 ${divClassName}`}>{text}</div>
    </div>
  );
};
export default DivWrapper;