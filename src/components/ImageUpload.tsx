import React, { useRef, useState } from "react";
import { formatFileSize } from "@/utils/formatFileSize";
import { Trash2, Upload } from "lucide-react";
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

const MAX_INPUT_MB = 15;
const TARGET_MB = 2;
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

      <div
        onClick={handleUploadClick}
        className="relative w-full h-44 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden group"
      >
        {file && previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload size={20} className="text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            {processing ? (
              <span className="text-xs text-center px-1">Compressing...</span>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-xs">Upload</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};