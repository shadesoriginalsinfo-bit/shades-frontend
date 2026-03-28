import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/formatFileSize";
import { Trash2, Image as ImageIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  file?: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const MAX_INPUT_MB = 10;
const TARGET_MB = 1.5;
const MAX_INPUT_BYTES = MAX_INPUT_MB * 1024 * 1024;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  required,
  accept = "image/*",
  file,
  onSelect,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState(false);

  const previewUrl = React.useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const compressImage = async (f: File) => {
    const options = {
      maxSizeMB: TARGET_MB,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: f.type || "image/jpeg",
    };

    const compressedBlob = await imageCompression(f, options);

    const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
    const finalName = f.name.replace(/\.[^.]+$/, "") + (ext === "png" ? ".png" : ".jpg");

    return new File([compressedBlob], finalName, {
      type: compressedBlob.type || f.type || "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    e.currentTarget.value = "";

    const name = f.name.toLowerCase();
    const parts = name.split(".");
    const ext = parts.pop();

    if (parts.length > 1) {
      toast.error("Invalid file name (multiple extensions not allowed)");
      return;
    }

    const allowedExt = ["jpg", "jpeg", "png", "webp", "gif", "bmp"];
    if (!ext || !allowedExt.includes(ext)) {
      toast.error("Only image files are allowed");
      return;
    }

    if (!f.type.startsWith("image/")) {
      toast.error("Invalid image file type");
      return;
    }

    if (f.size > MAX_INPUT_BYTES) {
      toast.error(`File too large. Max allowed is ${MAX_INPUT_MB} MB`);
      return;
    }

    if (f.size <= TARGET_MB * 1024 * 1024) {
      onSelect(f);
      return;
    }

    setProcessing(true);
    try {
      const compressed = await compressImage(f);

      if (compressed.size < f.size) {
        toast.success(`Compressed to ${formatFileSize(compressed.size)}`);
        onSelect(compressed);
      } else {
        toast(
          `Could not compress much. Using original (${formatFileSize(f.size)}).`,
          { icon: "⚠️" }
        );
        onSelect(f);
      }
    } catch (err) {
      console.error("Image compression error", err);
      toast.error("Compression failed — using original file");
      onSelect(f);
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <label className="text-xs text-gray-600 block mb-1">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleFileChange}
      />

      {!file && (
        <div className="flex border rounded-md overflow-hidden">
          <label
            className="flex-1 flex items-center gap-2 px-3 text-gray-500 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon size={16} />
            Select image
          </label>

          <Button
            type="button"
            className="rounded-none w-28"
            onClick={handleUploadClick}
            disabled={processing}
          >
            {processing ? "Compressing..." : "Upload"}
          </Button>
        </div>
      )}

      {file && (
        <div className="border rounded-md p-3 flex gap-3 items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-12 h-12 rounded object-cover border"
              />
            ) : (
              <ImageIcon className="text-slate-500" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    View image
                  </a>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={processing}
              className="gap-2"
            >
              <Upload size={16} />
              Replace
            </Button>

            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-600 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};