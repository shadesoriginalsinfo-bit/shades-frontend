import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMedia,
  getMedia,
  updateMedia,
  uploadMedia,
} from "@/lib/api";
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
  const uploadAbortRef = useRef<AbortController | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: [MEDIA_QUERY_KEY, "banner", "all"],
    queryFn: () => getMedia("banner"),
    staleTime: 0,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ files, signal }: { files: File[]; signal: AbortSignal }) =>
      uploadMedia(files, signal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
      toast.success("Images uploaded successfully");
    },
    onError: handleApiError,
  });

  useEffect(() => {
    return () => { uploadAbortRef.current?.abort(); };
  }, []);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { isActive?: boolean; sortOrder?: number } }) =>
      updateMedia(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
      toast.success("Updated");
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
    upload: (files: File[]) => {
      uploadAbortRef.current?.abort();
      uploadAbortRef.current = new AbortController();
      uploadMutation.mutate({ files, signal: uploadAbortRef.current.signal });
    },
    uploading: uploadMutation.isPending,
    update: (id: string, dto: { isActive?: boolean; sortOrder?: number }) =>
      updateMutation.mutate({ id, dto }),
    updating: updateMutation.isPending,
    updatingId: updateMutation.variables?.id,
    remove: (id: string) => deleteMutation.mutate(id),
    removing: deleteMutation.isPending,
    removingId: deleteMutation.variables,
  };
}
