/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Size20 } from "../../icons/Size20";
import "./style.css";

const AccordionItem = ({
  title = "Title",
  content = "Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.",
  state,
  className,
  accordionTitleClassName,
  divClassName,
  icon = <Size20 className="size-20" />,
}) => {
  return (
    <div className={`accordion-item ${className}`}>
      <div className={`accordion-title ${accordionTitleClassName}`}>
        <div className={`title ${divClassName}`}>{title}</div>

        {icon}
      </div>
    </div>
  );
};

export default AccordionItem;
