import ArrowLeft from "./ArrowLeft";
import PropTypes from "prop-types";
import styles from "./PaginationPrevious.module.css";

const PaginationPrevious = ({ className = "", state = "Default", size = 16, onClick }) => {
  const isDisabled = state === "Disabled";

  return (
    <div
      className={[styles.paginationPrevious, className].join(" ")}
      data-state={state}
      onClick={!isDisabled ? onClick : undefined}
      style={{ cursor: isDisabled ? "default" : "pointer", opacity: isDisabled ? 0.5 : 1 }}
    >
      <ArrowLeft size={size} />
      <div className={styles.previous}>이전</div>
    </div>
  );
};

PaginationPrevious.propTypes = {
  className: PropTypes.string,
  size: PropTypes.any,
  state: PropTypes.string,
  onClick: PropTypes.func,
};

export default PaginationPrevious;

