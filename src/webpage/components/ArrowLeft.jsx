import PropTypes from "prop-types";
import styles from "./ArrowLeft.module.css";

const ArrowLeft = ({ className = "", size = 48 }) => {
  return (
    <div className={[styles.arrowLeft, className].join(" ")} data-size={size}>
      <img className={styles.icon} loading="lazy" alt="" src="/icon-23.svg" />
    </div>
  );
};

ArrowLeft.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,
};

export default ArrowLeft;
