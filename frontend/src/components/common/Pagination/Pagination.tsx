// src/components/common/Pagination/Pagination.tsx
import React from 'react';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageRangeDisplayed?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageRangeDisplayed = 5,
}: PaginationProps) {
  // 표시할 페이지 범위 계산
  const getPageRange = () => {
    const halfRange = Math.floor(pageRangeDisplayed / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRangeDisplayed - 1, totalPages);

    // 페이지 범위 조정
    if (endPage - startPage + 1 < pageRangeDisplayed) {
      startPage = Math.max(endPage - pageRangeDisplayed + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageRange = getPageRange();

  return (
    <nav className={styles.pagination}>
      {/* 이전 페이지 버튼 */}
      <button
        type='button'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={styles.navButton}
        aria-label='이전 페이지'
      >
        &lt;
      </button>

      {/* 처음 페이지로 */}
      {pageRange[0] > 1 && (
        <>
          <button
            type='button'
            onClick={() => onPageChange(1)}
            className={styles.pageButton}
            aria-label='첫 페이지'
          >
            1
          </button>
          {pageRange[0] > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {/* 페이지 번호 */}
      {pageRange.map((page) => (
        <button
          key={page}
          type='button'
          onClick={() => onPageChange(page)}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
          aria-label={`${page} 페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지로 */}
      {pageRange[pageRange.length - 1] < totalPages && (
        <>
          {pageRange[pageRange.length - 1] < totalPages - 1 && (
            <span className={styles.ellipsis}>...</span>
          )}
          <button
            type='button'
            onClick={() => onPageChange(totalPages)}
            className={styles.pageButton}
            aria-label='마지막 페이지'
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        type='button'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={styles.navButton}
        aria-label='다음 페이지'
      >
        &gt;
      </button>
    </nav>
  );
}
