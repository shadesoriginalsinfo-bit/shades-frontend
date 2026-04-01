import { useQuery } from "@tanstack/react-query";
import { adminGetOrders } from "@/lib/api";
import type { IAdminOrderQuery, IOrdersResponse } from "@/types/order";

export const ORDERS_QUERY_KEY = "admin-orders";

interface UseOrdersReturn {
  orders: IOrdersResponse["data"];
  meta: IOrdersResponse["meta"] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useOrders(params: IAdminOrderQuery): UseOrdersReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [ORDERS_QUERY_KEY, params],
    queryFn: () => adminGetOrders(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

  return {
    orders: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
  };
}
