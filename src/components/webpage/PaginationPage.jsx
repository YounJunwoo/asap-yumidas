import PropTypes from "prop-types";
import styles from "./PaginationPage.module.css";

const PaginationPage = ({ className = "", state = "Default", number = "2", onClick }) => {
  return (
    <div
      className={[styles.root, className].join(" ")}
      data-state={state}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.div}>{number}</div>
    </div>
  );
};

PaginationPage.propTypes = {
  className: PropTypes.string,
  number: PropTypes.string,
  state: PropTypes.string,
  onClick: PropTypes.func,
};

export default PaginationPage;

