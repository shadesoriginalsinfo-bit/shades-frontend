import { useRef, useState, useMemo, useEffect } from "react";
import { ImagePlus, Images, Loader2, Trash2, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { useAdminMedia } from "@/hooks/useMedia";
import { formatFileSize } from "@/utils/formatFileSize";

const MAX_INPUT_MB = 10;
const TARGET_MB = 1.5;
const MAX_OUTPUT_MB = 5;
const MAX_INPUT_BYTES = MAX_INPUT_MB * 1024 * 1024;
const MAX_OUTPUT_BYTES = MAX_OUTPUT_MB * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

const MediaPage = () => {
  const { items, isLoading, upload, uploading, remove, removing, removingId } =
    useAdminMedia();

  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);

  const pendingPreviews = useMemo(
    () => pendingFiles.map((f) => URL.createObjectURL(f)),
    [pendingFiles],
  );

  useEffect(() => {
    return () => pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [pendingPreviews]);

  // Clear pending after upload completes
  const wasUploadingRef = useRef(false);
  useEffect(() => {
    if (wasUploadingRef.current && !uploading) setPendingFiles([]);
    wasUploadingRef.current = uploading;
  }, [uploading]);

  const compressImage = async (f: File): Promise<File> => {
    const blob = await imageCompression(f, {
      maxSizeMB: TARGET_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: f.type || "image/jpeg",
    });
    const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase();
    const name = f.name.replace(/\.[^.]+$/, "") + (ext === "png" ? ".png" : ".jpg");
    return new File([blob], name, { type: blob.type || f.type, lastModified: Date.now() });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = "";
    if (!files.length) return;

    const available = MAX_FILES_PER_UPLOAD - pendingFiles.length;
    if (available <= 0) {
      toast.error(`Maximum ${MAX_FILES_PER_UPLOAD} images per upload`);
      return;
    }
    const capped = files.slice(0, available);
    if (capped.length < files.length) {
      toast.error(`Only ${capped.length} image${capped.length === 1 ? "" : "s"} added — limit is ${MAX_FILES_PER_UPLOAD} per upload`);
    }

    setCompressing(true);
    const results = await Promise.all(
      capped.map(async (f) => {
        if (f.size > MAX_INPUT_BYTES) {
          toast.error(`"${f.name}" exceeds ${MAX_INPUT_MB} MB — skipped`);
          return null;
        }
        if (f.size <= MAX_OUTPUT_BYTES) return f;
        try {
          const compressed = await compressImage(f);
          if (compressed.size > MAX_OUTPUT_BYTES) {
            toast.error(`"${f.name}" still too large after compression — skipped`);
            return null;
          }
          toast.success(`"${f.name}" compressed to ${formatFileSize(compressed.size)}`);
          return compressed;
        } catch {
          toast.error(`Compression failed for "${f.name}" — skipped`);
          return null;
        }
      }),
    );
    setCompressing(false);
    const accepted = results.filter((f): f is File => f !== null);
    if (accepted.length) setPendingFiles((prev) => [...prev, ...accepted]);
  };

  return (
    <div className="space-y-6 p-1 md:p-4 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Images size={18} className="text-[#9A7A46]" />
          <h1 className="text-xl font-bold text-gray-800">Banner Images</h1>
        </div>
        <p className="text-sm text-gray-500">
          Upload images for the homepage hero carousel. Category is fixed as{" "}
          <span className="font-medium text-gray-700">banner</span>.
        </p>
      </div>

      {/* Upload zone */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-3">
          Upload Images
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />

        <button
          type="button"
          disabled={compressing || uploading || pendingFiles.length >= MAX_FILES_PER_UPLOAD}
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-[#E8DDD0] rounded-lg hover:border-[#9A7A46]/40 transition-colors py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-[#9A7A46]/60 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {compressing ? (
            <>
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Compressing…</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-6" />
              <span className="text-sm">Click to select images</span>
              <span className="text-xs text-gray-300">
                Max {MAX_INPUT_MB} MB per file · Up to {MAX_FILES_PER_UPLOAD} images per upload
              </span>
            </>
          )}
        </button>

        {/* Pending previews */}
        {pendingFiles.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
              {pendingFiles.map((file, i) => (
                <div key={i} className="relative group">
                  <div className="w-full aspect-square rounded-lg border border-[#E8DDD0] overflow-hidden bg-[#F8F4EE]">
                    <img
                      src={pendingPreviews[i]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingFiles((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="absolute top-0.5 right-0.5 bg-white/90 rounded-full p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="size-3" />
                  </button>
                  <p className="text-[9px] text-gray-400 truncate mt-0.5">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => upload(pendingFiles)}
              disabled={uploading || compressing}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1810] text-white text-xs font-medium rounded-lg hover:bg-[#9A7A46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ImagePlus className="size-3.5" />
              )}
              Upload {pendingFiles.length}{" "}
              {pendingFiles.length === 1 ? "Image" : "Images"}
            </button>
          </div>
        )}
      </div>

      {/* Current images */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-4">
          Current Banners
          <span className="ml-1.5 text-gray-400 normal-case tracking-normal font-normal">
            ({items.length})
          </span>
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8 border border-dashed border-[#E8DDD0] rounded-lg">
            No banner images uploaded yet
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-[#E8DDD0]">
                <div className="aspect-video bg-[#F8F4EE]">
                  <img
                    src={item.url}
                    alt={item.altText ?? "banner"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay with delete */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => remove(item.id)}
                    disabled={removing && removingId === item.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md disabled:opacity-50"
                  >
                    {removing && removingId === item.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </div>

                <div className="px-2 py-1.5 bg-white">
                  <p className="text-[10px] text-gray-400 truncate">
                    #{item.sortOrder} ·{" "}
                    {item.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-gray-300">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
