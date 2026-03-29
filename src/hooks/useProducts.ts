import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { type IProductQuery, type IProductsResponse } from "@/types/product";


export const PRODUCTS_QUERY_KEY = "products";

interface UseProductsReturn {
  products: IProductsResponse["data"];
  meta: IProductsResponse["meta"] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useProducts(params: IProductQuery): UseProductsReturn {
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });

  return {
    products: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
  };
}