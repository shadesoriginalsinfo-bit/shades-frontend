import type { FilterState } from "./components/Filters";
import type { SortOption } from "./components/ShopToolbar";


export const PAGE_LIMIT = 12;

export const DEFAULT_FILTERS: FilterState = {
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
};

export function applySortToApi(sort: SortOption): Partial<{
  sortBy: string;
  sortOrder: "asc" | "desc";
}> {
  switch (sort) {
    case "price_asc":
      return { sortBy: "discountPrice", sortOrder: "asc" };
    case "price_desc":
      return { sortBy: "discountPrice", sortOrder: "desc" };
    case "newest":
      return { sortBy: "createdAt", sortOrder: "desc" };
    // case "discount":
    //   return { sortBy: "discountPrice", sortOrder: "desc" };
    default:
      return {};
  }
}