import React from "react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  showFirstLast?: boolean;
  maxPageButtons?: number; // how many page buttons to show (including first/last/ellipsis logic)
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 25, 50, 100],
  showFirstLast = false,
  maxPageButtons = 7,
}) => {
  // if (totalPages <= 1) return null;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;


  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    if (onLimitChange) onLimitChange(newLimit);
  };


  const buildPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    const pushRange = (from: number, to: number) => {
      for (let i = from; i <= to; i++) pages.push(i);
    };

    if (totalPages <= maxPageButtons) {
      pushRange(1, totalPages);
      return pages;
    }

    const leftWindow = Math.floor((maxPageButtons - 3) / 2);
    const rightWindow = Math.ceil((maxPageButtons - 3) / 2);

    // near start (e.g., current <= leftWindow + 2) -> show first N, ellipsis, last
    if (currentPage <= leftWindow + 2) {
      pushRange(1, Math.max(1, maxPageButtons - 2));
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    // near end
    if (currentPage >= totalPages - (rightWindow + 1)) {
      pages.push(1);
      pages.push("...");
      pushRange(totalPages - (maxPageButtons - 3), totalPages);
      return pages;
    }

    // middle
    pages.push(1);
    pages.push("...");
    pushRange(currentPage - leftWindow, currentPage + rightWindow);
    pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
      {/* Left: Showing X to Y and page size selector */}
      <div className="hidden md:flex items-center space-x-3 text-sm text-gray-600">
        <div>
          Showing <span className="font-medium text-gray-800">{startItem}</span> to{" "}
          <span className="font-medium text-gray-800">{endItem}</span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-xs text-gray-500">
            per page
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handleLimitChange}
            className="px-2 py-1 border rounded-md text-sm bg-white cursor-pointer"
            aria-label="Items per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center space-x-2">
        {showFirstLast && (
          <Button
            size="sm"
            onClick={() => handlePageClick(1)}
            variant={isFirst ? "outline" : "default"}
            disabled={isFirst}
          >
            First
          </Button>
        )}

        <Button
          onClick={() => handlePageClick(currentPage - 1)}
          variant={isFirst ? "outline" : "default"}
          size="sm"
          disabled={isFirst}
        >
          Prev
        </Button>

        {/* Page number buttons */}
        <div className="flex items-center space-x-1">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-3 py-1 text-sm text-gray-400 select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handlePageClick(Number(p))}
                aria-current={p === currentPage ? "page" : undefined}
                className={`px-3 py-1 rounded-md text-sm font-medium border cursor-pointer ${
                  p === currentPage
                    ? "bg-[#1B77BB] text-white border-[#155f96]"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <Button
          onClick={() => handlePageClick(currentPage + 1)}
          variant={isLast ? "outline" : "default"}
          disabled={isLast}
          size="sm"
        >
          Next
        </Button>

        {showFirstLast && (
          <Button
            onClick={() => handlePageClick(totalPages)}
            variant={isLast ? "outline" : "default"}
            disabled={isLast}
            size="sm"
          >
            Last
          </Button>
        )}
      </div>

       <div className="flex md:hidden items-center space-x-3 text-sm text-gray-600">
        <div>
          Showing <span className="font-medium text-gray-800">{startItem}</span> to{" "}
          <span className="font-medium text-gray-800">{endItem}</span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-xs text-gray-500">
            per page
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handleLimitChange}
            className="px-2 py-1 border rounded-md text-sm bg-white cursor-pointer"
            aria-label="Items per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
