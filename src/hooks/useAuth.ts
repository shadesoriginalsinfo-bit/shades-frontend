import { getMyProfile } from "@/lib/api";
import type { IUserProfile } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useAuthUser() {
  return useQuery<IUserProfile>({
    queryKey: ["auth-user"],
    queryFn: getMyProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
