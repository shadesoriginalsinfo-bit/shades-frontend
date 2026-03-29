import { ChevronLeft, ChevronRight } from "lucide-react";

interface IProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ShopPaginationProps {
  meta: IProductMeta;
  onPageChange: (page: number) => void;
}

const ShopPagination = ({ meta, onPageChange }: ShopPaginationProps) => {
  const { page, totalPages } = meta;

  if (totalPages <= 1) return null;

  /* Build page numbers to show: always show first, last, current ±1 */
  const buildPages = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const show = new Set<number>();

    show.add(1);
    show.add(totalPages);
    show.add(page);
    if (page > 1) show.add(page - 1);
    if (page < totalPages) show.add(page + 1);

    const sorted = [...show].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      pages.push(sorted[i]);
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
        pages.push("ellipsis");
      }
    }

    return pages;
  };

  const pages = buildPages();

  const btnBase =
    "min-w-[36px] h-9 flex items-center justify-center text-xs tracking-wide border rounded-sm transition-all duration-150";
  const activeClass = "bg-[#C6A46C] text-white border-[#C6A46C] font-semibold";
  const inactiveClass =
    "border-[#E8DDD0] text-gray-600 hover:border-[#C6A46C] hover:text-[#C6A46C] bg-white";
  const disabledClass = "border-[#E8DDD0] text-gray-300 cursor-not-allowed bg-white";

  return (
    <div className="flex items-center justify-center gap-2 pt-10 pb-4" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btnBase} px-2.5 gap-1 ${page === 1 ? disabledClass : inactiveClass}`}
      >
        <ChevronLeft size={13} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="text-gray-400 text-sm px-1">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`${btnBase} px-3 ${p === page ? activeClass : inactiveClass}`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btnBase} px-2.5 gap-1 ${page === totalPages ? disabledClass : inactiveClass}`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

export default ShopPagination;