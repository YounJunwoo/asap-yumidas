import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Star.module.css";

const Star = ({ className = "", size = 48, starDisplay }) => {
  const starStyle = useMemo(() => {
    return {
      display: starDisplay,
    };
  }, [starDisplay]);

  return (
    <div
      className={[styles.star, className].join(" ")}
      data-size={size}
      style={starStyle}
    >
      <img className={styles.icon} alt="" />
    </div>
  );
};

Star.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,

  /** Style props */
  starDisplay: PropTypes.string,
};

export default Star;
