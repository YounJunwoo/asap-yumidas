import PropTypes from "prop-types";
import styles from "./ArrowRight.module.css";

const ArrowRight = ({ className = "", size = 48 }) => {
  return (
    <div className={[styles.arrowRight, className].join(" ")} data-size={size}>
      <img className={styles.icon} loading="lazy" alt="" src="/icon-24.svg" />
    </div>
  );
};

ArrowRight.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,
};

export default ArrowRight;
