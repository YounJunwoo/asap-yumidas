import PropTypes from "prop-types";
import styles from "./ArrowUpCircle.module.css";

const ArrowUpCircle = ({ className = "", size = 48 }) => {
  return (
    <div
      className={[styles.arrowUpCircle, className].join(" ")}
      data-size={size}
    >
      <img className={styles.icon} alt="" src="/icon-4.svg" />
    </div>
  );
};

ArrowUpCircle.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  size: PropTypes.number,
};

export default ArrowUpCircle;
