import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";
import { type ICategory } from "@/types/category";


export const CATEGORIES_QUERY_KEY = "categories-flat";

interface UseCategoriesReturn {
  categories: ICategory[];
  isLoading: boolean;
  isError: boolean;
}

export function useCategories(): UseCategoriesReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => getCategories({ flat: true }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
  };
}