import { Search, LayoutGrid, LayoutList, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { type FilterState } from "./Filters";
import { type ICategory } from "@/types/category";

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "discount";

export type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "discount",   label: "Best Discount" },
];

interface ShopToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  categories: ICategory[];
  totalCount: number | undefined;
  isFetching: boolean;
  onMobileFilterOpen: () => void;
}

const ShopToolbar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  filters,
  onFilterChange,
  categories,
  totalCount,
  isFetching,
  onMobileFilterOpen,
}: ShopToolbarProps) => {
  /* Build active filter chips */
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.categoryId) {
    const cat = categories.find((c) => c.id === filters.categoryId);
    if (cat) {
      chips.push({
        label: cat.name,
        onRemove: () => onFilterChange({ ...filters, categoryId: "" }),
      });
    }
  }
  if (filters.minPrice) {
    chips.push({
      label: `Min ₹${filters.minPrice}`,
      onRemove: () => onFilterChange({ ...filters, minPrice: "" }),
    });
  }
  if (filters.maxPrice) {
    chips.push({
      label: `Max ₹${filters.maxPrice}`,
      onRemove: () => onFilterChange({ ...filters, maxPrice: "" }),
    });
  }
  if (filters.inStock) {
    chips.push({
      label: "In Stock",
      onRemove: () => onFilterChange({ ...filters, inStock: false }),
    });
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: search + sort + view + mobile filter button */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A46C] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 border border-[#E8DDD0] text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#C6A46C] transition-colors bg-white tracking-wide rounded-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C6A46C]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-[#E8DDD0] text-xs text-gray-600 tracking-wide focus:outline-none focus:border-[#C6A46C] transition-colors bg-white cursor-pointer rounded-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#C6A46C] pointer-events-none"
          />
        </div>

        {/* View toggle — desktop only */}
        <div className="hidden sm:flex items-center border border-[#E8DDD0] rounded-sm overflow-hidden shrink-0">
          <button
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            className={`p-2.5 transition-colors ${
              view === "grid"
                ? "bg-[#C6A46C] text-white"
                : "text-gray-400 hover:text-[#C6A46C] bg-white"
            }`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            aria-label="List view"
            className={`p-2.5 border-l border-[#E8DDD0] transition-colors ${
              view === "list"
                ? "bg-[#C6A46C] text-white"
                : "text-gray-400 hover:text-[#C6A46C] bg-white"
            }`}
          >
            <LayoutList size={15} />
          </button>
        </div>

        {/* Mobile: filter trigger */}
        <button
          onClick={onMobileFilterOpen}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E8DDD0] text-xs text-gray-600 tracking-wide bg-white hover:border-[#C6A46C] hover:text-[#C6A46C] transition-colors rounded-sm shrink-0"
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {chips.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#C6A46C] text-white text-[9px] flex items-center justify-center font-bold">
              {chips.length}
            </span>
          )}
        </button>

        {/* Result count + fetching indicator */}
        {totalCount !== undefined && (
          <p className="text-xs text-gray-400 tracking-wide ml-auto shrink-0">
            {isFetching ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="animate-spin size-3 text-[#C6A46C]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Loading…
              </span>
            ) : (
              `${totalCount} ${totalCount === 1 ? "product" : "products"}`
            )}
          </p>
        )}
      </div>

      {/* Row 2: active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
            Active:
          </span>
          {chips.map(({ label, onRemove }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-[#F5EFE7] border border-[#C6A46C]/30 text-[10px] tracking-wide text-[#B8936A] font-medium rounded-sm"
            >
              {label}
              <button
                onClick={onRemove}
                className="w-3.5 h-3.5 rounded-full bg-[#C6A46C]/20 hover:bg-[#C6A46C] hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={8} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopToolbar;