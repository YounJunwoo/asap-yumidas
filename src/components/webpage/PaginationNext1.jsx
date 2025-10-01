import ArrowRight from "./ArrowRight";
import PropTypes from "prop-types";
import styles from "./PaginationNext1.module.css";

const PaginationNext1 = ({ className = "", state = "Default", size = 16, onClick }) => {
  const isDisabled = state === "Disabled";

  return (
    <div
      className={[styles.paginationNext, className].join(" ")}
      data-state={state}
      onClick={!isDisabled ? onClick : undefined}
      style={{ cursor: isDisabled ? "default" : "pointer", opacity: isDisabled ? 0.5 : 1 }}
    >
      <div className={styles.next}>다음</div>
      <ArrowRight size={size} />
    </div>
  );
};

PaginationNext1.propTypes = {
  className: PropTypes.string,
  size: PropTypes.any,
  state: PropTypes.string,
  onClick: PropTypes.func,
};

export default PaginationNext1;

