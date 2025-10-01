import PropTypes from "prop-types";
import styles from "./PaginationGap.module.css";

const PaginationGap = ({ className = "" }) => {
  return (
    <div className={[styles.paginationGap, className].join(" ")}>
      <b className={styles.b}>...</b>
    </div>
  );
};

PaginationGap.propTypes = {
  className: PropTypes.string,
};

export default PaginationGap;

