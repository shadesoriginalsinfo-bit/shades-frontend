import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/pages/home/components/Header";
import Footer from "@/pages/home/components/Footer";
import ShopBanner from "./components/Banner";
import ShopFilters, { type FilterState } from "./components/Filters";
import ShopToolbar, {
  type SortOption,
  type ViewMode,
} from "./components/ShopToolbar";
import ProductGrid from "./components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { applySortToApi, DEFAULT_FILTERS, PAGE_LIMIT } from "./constants";
import { Pagination } from "@/components/Pagination";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "";
  const urlPage = Number(searchParams.get("page") ?? "1");

  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(urlPage);
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    categoryId: "", // will be resolved once categories load
  });

  const debouncedSearch = useDebounce(search, 600);

  const { categories, isLoading: categoriesLoading } = useCategories();

  /* Resolve category slug → id on first load */
  useEffect(() => {
    if (!urlCategory || categoriesLoading) return;
    const match = categories.find((c) => c.slug === urlCategory);
    if (match) {
      setFilters((prev) => ({ ...prev, categoryId: match.id }));
    }
  }, [urlCategory, categories, categoriesLoading]);

  /* ── Sync URL ← state ── */
  const syncUrl = useCallback(
    (newSearch: string, newPage: number, newCategoryId: string) => {
      const params: Record<string, string> = {};
      if (newSearch) params.search = newSearch;
      if (newPage > 1) params.page = String(newPage);
      if (newCategoryId) {
        const cat = categories.find((c) => c.id === newCategoryId);
        if (cat) params.category = cat.slug;
      }
      setSearchParams(params, { replace: true });
    },
    [categories, setSearchParams],
  );

  /* Update URL whenever relevant state changes */
  useEffect(() => {
    syncUrl(debouncedSearch, page, filters.categoryId);
  }, [debouncedSearch, page, filters.categoryId, syncUrl]);

  /* Reset to page 1 when search or filters change */
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setPage(1);
  };

  const sortParams = applySortToApi(sort);

  const { products, meta, isLoading, isFetching, isError } = useProducts({
    search: debouncedSearch || undefined,
    categoryId: filters.categoryId || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    inStock: filters.inStock ? true : undefined,
    isPublished: true,
    page,
    limit: PAGE_LIMIT,
    ...sortParams,
  });

  /* ── Active category name for banner ── */
  const activeCategoryName = filters.categoryId
    ? categories.find((c) => c.id === filters.categoryId)?.name
    : undefined;

  return (
    <div className="min-h-screen bg-[#FDFAF7] font-sans antialiased">
      <Header />

      {/* Hero banner — search/category context */}
      <ShopBanner
        searchQuery={debouncedSearch}
        categoryName={activeCategoryName}
        totalCount={meta?.total}
      />

      {/* Main layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex gap-7 lg:gap-9 items-start">
          <ShopFilters
            categories={categories}
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
            mobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* ── Right column: toolbar + grid + pagination ── */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <ShopToolbar
              search={search}
              onSearchChange={handleSearchChange}
              sort={sort}
              onSortChange={(s) => {
                setSort(s);
                setPage(1);
              }}
              view={view}
              onViewChange={setView}
              filters={filters}
              onFilterChange={handleFiltersChange}
              categories={categories}
              totalCount={meta?.total}
              isFetching={isFetching}
              onMobileFilterOpen={() => setMobileFilterOpen(true)}
            />

            {/* Product grid / list */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isError={isError}
              view={view}
              limit={PAGE_LIMIT}
            />

            {/* Pagination */}
            {meta && (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                pageSize={PAGE_LIMIT}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
