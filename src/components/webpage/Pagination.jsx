import { useState } from "react";
import PaginationPrevious from "./PaginationPrevious";
import PaginationList from "./PaginationList";
import PaginationNext1 from "./PaginationNext1";
import PropTypes from "prop-types";
import styles from "./Pagination.module.css";

/** Market에서 내려준 currentPage/totalPages/onChange로 동작하는 제어형 페이지네이션 */
const Pagination = ({
  className = "",
  size = 16,
  size1 = 16,
  currentPage,
  totalPages = 1,
  onChange,
}) => {
  // 외부에서 안 내려준 경우만 내부 상태 사용(안전장치)
  const [internalPage, setInternalPage] = useState(1);
  const page = typeof currentPage === "number" ? currentPage : internalPage;
  const setPage = typeof onChange === "function" ? onChange : setInternalPage;
  const safeTotal = Math.max(1, Number(totalPages) || 1);

  const go = (p) => {
    if (p < 1 || p > safeTotal) return;
    setPage(p);
  };

  return (
    <div className={[styles.pagination, className].join(" ")}>
      <PaginationPrevious
        state={page === 1 ? "Disabled" : "Default"}
        size={size}
        onClick={() => go(page - 1)}
      />
      <PaginationList
        currentPage={page}
        totalPages={safeTotal}
        onPageClick={go}
      />
      <PaginationNext1
        state={page === safeTotal ? "Disabled" : "Default"}
        size={size1}
        onClick={() => go(page + 1)}
      />
    </div>
  );
};

Pagination.propTypes = {
  className: PropTypes.string,
  size: PropTypes.any,
  size1: PropTypes.any,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onChange: PropTypes.func,
};

export default Pagination;
