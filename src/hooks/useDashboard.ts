import { useQuery } from "@tanstack/react-query";
import { adminGetDashboard } from "@/lib/api";
import type { IDashboardData } from "@/types/dashboard";

export const DASHBOARD_QUERY_KEY = "admin-dashboard";

interface UseDashboardReturn {
  dashboard: IDashboardData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useDashboard(): UseDashboardReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: adminGetDashboard,
    staleTime: 1000 * 60 * 2,
  });

  return { dashboard: data, isLoading, isError };
}
