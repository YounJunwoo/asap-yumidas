import PaginationPage from "./PaginationPage";
import PaginationGap from "./PaginationGap";
import PropTypes from "prop-types";
import styles from "./PaginationList.module.css";

const PaginationList = ({ currentPage, totalPages, onPageClick }) => {
  const createPageItems = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.paginationList}>
      {createPageItems().map((item, idx) => {
        if (item === "...") return <PaginationGap key={"gap-" + idx} />;
        return (
          <PaginationPage
            key={item}
            number={item.toString()}
            state={currentPage === item ? "Current" : "Default"}
            onClick={() => onPageClick(item)}
          />
        );
      })}
    </div>
  );
};

PaginationList.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
};

export default PaginationList;
