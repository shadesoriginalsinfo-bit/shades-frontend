import { useRef, useState, useMemo, useEffect } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { formatFileSize } from "@/utils/formatFileSize";

const MAX_INPUT_MB = 10;
const TARGET_MB = 1.5;
const MAX_OUTPUT_MB = 5;
const MAX_INPUT_BYTES = MAX_INPUT_MB * 1024 * 1024;
const MAX_OUTPUT_BYTES = MAX_OUTPUT_MB * 1024 * 1024;
const MAX_FILES = 10;

interface Props {
  onUpload: (files: File[]) => void;
  uploading: boolean;
}

const compressImage = async (f: File): Promise<File> => {
  const blob = await imageCompression(f, {
    maxSizeMB: TARGET_MB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: f.type || "image/jpeg",
  });
  const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase();
  const name =
    f.name.replace(/\.[^.]+$/, "") + (ext === "png" ? ".png" : ".jpg");
  return new File([blob], name, {
    type: blob.type || f.type,
    lastModified: Date.now(),
  });
};

const MediaUploadZone = ({ onUpload, uploading }: Props) => {
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

  const wasUploadingRef = useRef(false);
  useEffect(() => {
    if (wasUploadingRef.current && !uploading) setPendingFiles([]);
    wasUploadingRef.current = uploading;
  }, [uploading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = "";
    if (!files.length) return;

    const available = MAX_FILES - pendingFiles.length;
    if (available <= 0) {
      toast.error(`Maximum ${MAX_FILES} images per upload`);
      return;
    }
    const capped = files.slice(0, available);
    if (capped.length < files.length) {
      toast.error(
        `Only ${capped.length} image${capped.length === 1 ? "" : "s"} added — limit is ${MAX_FILES} per upload`,
      );
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
          toast.success(
            `"${f.name}" compressed to ${formatFileSize(compressed.size)}`,
          );
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

  const isFull = pendingFiles.length >= MAX_FILES;

  return (
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
        disabled={compressing || uploading || isFull}
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
            <span className="text-sm">
              {isFull ? `Limit reached (${MAX_FILES})` : "Click to select images"}
            </span>
            <span className="text-xs text-gray-300">
              Max {MAX_INPUT_MB} MB per file · Up to {MAX_FILES} images per upload
            </span>
          </>
        )}
      </button>

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
            onClick={() => onUpload(pendingFiles)}
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
  );
};

export default MediaUploadZone;
