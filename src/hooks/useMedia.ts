import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMedia, getMedia, uploadMedia } from "@/lib/api";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

export const MEDIA_QUERY_KEY = "media";

export function useMediaBanners() {
  return useQuery({
    queryKey: [MEDIA_QUERY_KEY, "banner", "active"],
    queryFn: () => getMedia("banner", true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminMedia() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: [MEDIA_QUERY_KEY, "banner", "all"],
    queryFn: () => getMedia("banner"),
    staleTime: 0,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
      toast.success("Images uploaded successfully");
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
      toast.success("Image deleted");
    },
    onError: handleApiError,
  });

  return {
    items,
    isLoading,
    upload: (files: File[]) => uploadMutation.mutate(files),
    uploading: uploadMutation.isPending,
    remove: (id: string) => deleteMutation.mutate(id),
    removing: deleteMutation.isPending,
    removingId: deleteMutation.variables,
  };
}
