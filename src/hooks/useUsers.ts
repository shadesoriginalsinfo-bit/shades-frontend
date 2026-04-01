import { useQuery } from "@tanstack/react-query";
import { adminGetUsers } from "@/lib/api";
import type { IAdminUserQuery, IAdminUsersResponse } from "@/types/user";

export const USERS_QUERY_KEY = "admin-users";

interface UseUsersReturn {
  users: IAdminUsersResponse["data"];
  meta: IAdminUsersResponse["meta"] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useUsers(params: IAdminUserQuery): UseUsersReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => adminGetUsers(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

  return {
    users: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
  };
}
