import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IProduct, IProductImage } from "@/types/product";
import Spinner from "./Spinner";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { formatFileSize } from "@/utils/formatFileSize";

const MAX_INPUT_MB = 10;
const TARGET_MB = 2;
const MAX_OUTPUT_MB = 5;
const MAX_INPUT_BYTES = MAX_INPUT_MB * 1024 * 1024;
const MAX_OUTPUT_BYTES = MAX_OUTPUT_MB * 1024 * 1024;

interface Props {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (imageId: string) => void;
  onReorderImages: (images: { id: string; position: number }[]) => void;
  addImagesPending: boolean;
  removeImagePending: boolean;
  reorderPending: boolean;
}

const ImagesModal = ({
  open,
  onClose,
  product,
  onAddImages,
  onRemoveImage,
  onReorderImages,
  addImagesPending,
  removeImagePending,
  reorderPending,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [localImages, setLocalImages] = useState<IProductImage[]>([]);
  const [compressing, setCompressing] = useState(false);
  const wasAddingRef = useRef(false);

  const compressImage = async (f: File): Promise<File> => {
    const compressedBlob = await imageCompression(f, {
      maxSizeMB: TARGET_MB,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: f.type || "image/jpeg",
    });
    const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase();
    const finalName = f.name.replace(/\.[^.]+$/, "") + (ext === "png" ? ".png" : ".jpg");
    return new File([compressedBlob], finalName, {
      type: compressedBlob.type || f.type || "image/jpeg",
      lastModified: Date.now(),
    });
  };

  // Sync local order whenever product data updates
  useEffect(() => {
    if (product?.images) {
      setLocalImages([...product.images].sort((a, b) => a.position - b.position));
    }
  }, [product]);

  // Clear pending files after upload completes
  useEffect(() => {
    if (wasAddingRef.current && !addImagesPending) {
      setPendingFiles([]);
    }
    wasAddingRef.current = addImagesPending;
  }, [addImagesPending]);

  // Reset pending files when modal closes
  useEffect(() => {
    if (!open) setPendingFiles([]);
  }, [open]);

  const sortedOriginal = useMemo(
    () => (product?.images ? [...product.images].sort((a, b) => a.position - b.position) : []),
    [product],
  );

  const hasReordered = localImages.some((img, i) => img.id !== sortedOriginal[i]?.id);

  const pendingPreviews = useMemo(
    () => pendingFiles.map((f) => URL.createObjectURL(f)),
    [pendingFiles],
  );

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingPreviews]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    setLocalImages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    setLocalImages((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSaveOrder = () => {
    onReorderImages(localImages.map((img, i) => ({ id: img.id, position: i })));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = "";
    if (!files.length) return;

    setCompressing(true);
    const accepted: File[] = [];

    for (const f of files) {
      if (f.size > MAX_INPUT_BYTES) {
        toast.error(`"${f.name}" exceeds ${MAX_INPUT_MB} MB limit — skipped`);
        continue;
      }

      if (f.size <= MAX_OUTPUT_BYTES) {
        accepted.push(f);
        continue;
      }

      try {
        const compressed = await compressImage(f);
        if (compressed.size > MAX_OUTPUT_BYTES) {
          toast.error(
            `"${f.name}" is still ${formatFileSize(compressed.size)} after compression (limit ${MAX_OUTPUT_MB} MB) — skipped`,
          );
        } else {
          toast.success(`"${f.name}" compressed to ${formatFileSize(compressed.size)}`);
          accepted.push(compressed);
        }
      } catch {
        toast.error(`Compression failed for "${f.name}" — skipped`);
      }
    }

    setCompressing(false);
    if (accepted.length) setPendingFiles((prev) => [...prev, ...accepted]);
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col gap-0">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
            Manage Images
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-400 mb-4 truncate">{product?.title}</p>

        <div className="flex-1 overflow-y-auto space-y-5 pr-0.5">
          {/* ── Current images ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                Current Images
                <span className="ml-1.5 text-gray-400 normal-case tracking-normal">
                  ({localImages.length})
                </span>
              </p>
              {hasReordered && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={reorderPending}
                  onClick={handleSaveOrder}
                  className="h-6 px-2.5 text-[10px] tracking-wide border-[#C6A46C]/40 text-[#C6A46C] hover:bg-[#C6A46C]/5"
                >
                  {reorderPending && <Spinner />}
                  Save Order
                </Button>
              )}
            </div>

            {localImages.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center border border-dashed border-[#E8DDD0] rounded">
                No images yet
              </p>
            ) : (
              <div className="space-y-1.5">
                {localImages.map((img, index) => (
                  <div
                    key={img.id}
                    className="flex items-center gap-2.5 border border-[#E8DDD0] rounded-sm p-2 bg-white hover:bg-[#FDFAF6] transition-colors"
                  >
                    <span className="text-[10px] text-gray-500 w-4 text-center tabular-nums select-none shrink-0">
                      {index + 1}
                    </span>
                    <img
                      src={img.url}
                      alt={img.altText ?? ""}
                      className="size-12 object-cover rounded-sm shrink-0 border border-[#E8DDD0]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 truncate">{img.altText || "—"}</p>
                      {/* <p className="text-[10px] text-gray-300 truncate">{img.url.split("/").pop()}</p> */}
                    </div>

                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0 || reorderPending}
                        className="p-0.5 rounded hover:bg-[#F0EAE0] disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="size-3.5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === localImages.length - 1 || reorderPending}
                        className="p-0.5 rounded hover:bg-[#F0EAE0] disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="size-3.5 text-gray-500" />
                      </button>
                    </div>

                    <Button
                      size="icon-xs"
                      variant="destructive"
                      disabled={removeImagePending}
                      onClick={() => onRemoveImage(img.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Add images ── */}
          <div className="border-t border-[#E8DDD0] pt-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium mb-3">
              Add Images
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
              disabled={compressing}
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#E8DDD0] rounded hover:border-[#C6A46C]/40 transition-colors py-5 flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#C6A46C]/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-[#E8DDD0] disabled:hover:text-gray-400"
            >
              {compressing ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span className="text-xs">Compressing…</span>
                </>
              ) : (
                <>
                  <ImagePlus className="size-5" />
                  <span className="text-xs">Click to select images</span>
                  <span className="text-[10px] text-gray-300">
                    Max {MAX_INPUT_MB} MB per file · Multiple selection supported
                  </span>
                </>
              )}
            </button>

            {pendingFiles.length > 0 && (
              <>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {pendingFiles.map((file, i) => (
                    <div key={i} className="relative group">
                      <div className="w-full aspect-square rounded border border-[#E8DDD0] overflow-hidden bg-[#F8F4EE]">
                        <img
                          src={pendingPreviews[i]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePending(i)}
                        className="absolute top-0.5 right-0.5 bg-white/90 rounded-full p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="size-3" />
                      </button>
                      <p className="text-[9px] text-gray-400 truncate mt-0.5 leading-tight">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  disabled={addImagesPending || compressing}
                  onClick={() => onAddImages(pendingFiles)}
                  className="mt-3"
                >
                  {addImagesPending ? <Spinner /> : <Upload className="size-3.5" />}
                  Upload {pendingFiles.length} {pendingFiles.length === 1 ? "Image" : "Images"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagesModal;
