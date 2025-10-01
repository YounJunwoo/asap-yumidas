import PropTypes from "prop-types";
import styles from "./Heart.module.css";

const Heart = ({ className = "", size = 48 }) => {
  return (
    <div className={[styles.heart, className].join(" ")} data-size={size}>
      <img className={styles.icon} loading="lazy" alt="" src="/icon-5.svg" />
    </div>
  );
};

Heart.propTypes = {
  className: PropTypes.string,

  size: PropTypes.number,
};

export default Heart;

