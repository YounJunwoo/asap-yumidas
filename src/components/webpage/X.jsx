import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./X.module.css";

const X = ({ className = "", size = 48, xDisplay }) => {
  const xStyle = useMemo(() => {
    return {
      display: xDisplay,
    };
  }, [xDisplay]);

  return (
    <div
      className={[styles.x, className].join(" ")}
      data-size={size}
      style={xStyle}
    >
      <img className={styles.icon} alt="" />
    </div>
  );
};

X.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,

  /** Style props */
  xDisplay: PropTypes.string,
};

export default X;
