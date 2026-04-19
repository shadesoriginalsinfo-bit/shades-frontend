import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { type ICategory } from "@/types/category";

export interface FilterState {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface ShopFiltersProps {
  categories: ICategory[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  /** For mobile: controlled open state */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ── Collapsible filter group ────────────────────────────────────────── */
interface FilterGroupProps {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const FilterGroup = ({
  label,
  defaultOpen = true,
  children,
}: FilterGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8DDD0] pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between mb-4 group"
        aria-expanded={open}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#9A7A46]">
          {label}
        </span>
        {open ? (
          <ChevronUp
            size={13}
            className="text-[#9A7A46]/60 group-hover:text-[#9A7A46] transition-colors"
          />
        ) : (
          <ChevronDown
            size={13}
            className="text-[#9A7A46]/60 group-hover:text-[#9A7A46] transition-colors"
          />
        )}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

/* ── Inner filter panel (shared between sidebar + mobile drawer) ─────── */
interface FilterPanelProps {
  categories: ICategory[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const FilterPanel = ({
  categories,
  filters,
  onChange,
  onReset,
}: FilterPanelProps) => {
  const hasActive =
    !!filters.categoryId ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.inStock;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#9A7A46]" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-700">
            Filters
          </span>
          {hasActive && (
            <span className="w-4 h-4 rounded-full bg-[#9A7A46] text-white text-[9px] flex items-center justify-center font-bold">
              {
                [
                  filters.categoryId,
                  filters.minPrice,
                  filters.maxPrice,
                  filters.inStock,
                ].filter(Boolean).length
              }
            </span>
          )}
        </div>
        {hasActive && (
          <button
            onClick={onReset}
            className="text-[10px] tracking-[0.18em] uppercase text-[#B8936A] hover:text-[#9A7A46] underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Categories ── */}
      <FilterGroup label="Category">
        <div className="space-y-1">
          {/* All */}
          <button
            onClick={() => onChange({ ...filters, categoryId: "" })}
            className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-sm text-xs tracking-wide transition-all duration-150 ${
              !filters.categoryId
                ? "bg-[#9A7A46] text-white font-medium"
                : "text-gray-600 hover:text-[#9A7A46] hover:bg-[#F5EFE7]"
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onChange({
                  ...filters,
                  categoryId: filters.categoryId === cat.id ? "" : cat.id,
                })
              }
              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-sm text-xs tracking-wide transition-all duration-150 ${
                filters.categoryId === cat.id
                  ? "bg-[#9A7A46] text-white font-medium"
                  : "text-gray-600 hover:text-[#9A7A46] hover:bg-[#F5EFE7]"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* ── Price Range ── */}
      <FilterGroup label="Price Range">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[9px] tracking-widest uppercase text-gray-400 mb-1 block">
              Min (₹)
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value })
              }
              className="w-full border border-[#E8DDD0] rounded-sm px-2.5 py-2 text-xs text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors bg-white"
            />
          </div>
          <div className="mt-4 h-px w-4 bg-[#E8DDD0] shrink-0" />
          <div className="flex-1">
            <label className="text-[9px] tracking-widest uppercase text-gray-400 mb-1 block">
              Max (₹)
            </label>
            <input
              type="number"
              min={0}
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value })
              }
              className="w-full border border-[#E8DDD0] rounded-sm px-2.5 py-2 text-xs text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors bg-white"
            />
          </div>
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            { label: "Under ₹500", min: "", max: "500" },
            { label: "₹500 – ₹1500", min: "500", max: "1500" },
            { label: "₹1500 – ₹3000", min: "1500", max: "3000" },
            { label: "₹3000+", min: "3000", max: "" },
          ].map(({ label, min, max }) => {
            const active = filters.minPrice === min && filters.maxPrice === max;
            return (
              <button
                key={label}
                onClick={() =>
                  onChange({
                    ...filters,
                    minPrice: active ? "" : min,
                    maxPrice: active ? "" : max,
                  })
                }
                className={`text-[10px] tracking-wide px-2.5 py-1 border rounded-sm transition-all duration-150 ${
                  active
                    ? "bg-[#9A7A46] text-white border-[#9A7A46]"
                    : "border-[#E8DDD0] text-gray-500 hover:border-[#9A7A46] hover:text-[#9A7A46]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* ── Availability ── */}
      <FilterGroup label="Availability" defaultOpen={true}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onChange({ ...filters, inStock: !filters.inStock })}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
              filters.inStock ? "bg-[#9A7A46]" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                filters.inStock ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-xs text-gray-600 tracking-wide group-hover:text-[#9A7A46] transition-colors">
            In Stock Only
          </span>
        </label>
      </FilterGroup>
    </div>
  );
};

/* ── Main export ─────────────────────────────────────────────────────── */
const ShopFilters = ({
  categories,
  filters,
  onChange,
  onReset,
  mobileOpen,
  onMobileClose,
}: ShopFiltersProps) => {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:block w-56 xl:w-60 shrink-0">
        <div className="sticky top-24 bg-white border border-[#E8DDD0] p-5 shadow-[0_2px_16px_rgba(198,164,108,0.07)]">
          <FilterPanel
            categories={categories}
            filters={filters}
            onChange={onChange}
            onReset={onReset}
          />
        </div>
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={onMobileClose}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl animate-[slideInLeft_0.28s_ease_both]">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DDD0] bg-gradient-to-r from-[#F5EFE7] to-white">
              <span className="text-sm font-semibold text-gray-800 tracking-wide font-serif">
                Filters
              </span>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5EFE7] text-gray-500 hover:text-[#9A7A46] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="p-5">
              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={(f) => {
                  onChange(f);
                }}
                onReset={() => {
                  onReset();
                }}
              />
            </div>

            {/* Apply CTA */}
            <div className="sticky bottom-0 px-5 py-4 border-t border-[#E8DDD0] bg-white">
              <button
                onClick={onMobileClose}
                className="w-full py-3 bg-[#9A7A46] text-white text-xs tracking-[0.2em] uppercase font-medium rounded-sm hover:bg-[#B8936A] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ShopFilters;
