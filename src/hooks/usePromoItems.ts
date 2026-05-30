import { useQuery } from "@tanstack/react-query";
import { adminGetAllPromoItems, getPromoItems } from "@/lib/api";

export const PROMO_ITEMS_QUERY_KEY = "promo-items";
export const PROMO_ITEMS_ADMIN_QUERY_KEY = "promo-items-admin";

export function usePromoItems() {
  const { data, isLoading, isError } = useQuery({
    queryKey: [PROMO_ITEMS_QUERY_KEY],
    queryFn: getPromoItems,
    staleTime: 1000 * 60 * 5,
  });

  return { items: data ?? [], isLoading, isError };
}

export function useAdminPromoItems() {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [PROMO_ITEMS_ADMIN_QUERY_KEY],
    queryFn: adminGetAllPromoItems,
    staleTime: 1000 * 60 * 2,
  });

  return { items: data ?? [], isLoading, isFetching, isError };
}
