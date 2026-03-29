import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LabelField from "@/components/LabelField";
import type { IProduct } from "@/types/product";
import Spinner from "./Spinner";

export type ImageForm = { url: string; altText: string; position: string };

interface Props {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
  imageForm: ImageForm;
  onImageFormChange: (updater: (prev: ImageForm) => ImageForm) => void;
  onAddImage: () => void;
  onRemoveImage: (imageId: string) => void;
  addImagePending: boolean;
  removeImagePending: boolean;
}

const ImagesModal = ({
  open,
  onClose,
  product,
  imageForm,
  onImageFormChange,
  onAddImage,
  onRemoveImage,
  addImagePending,
  removeImagePending,
}: Props) => (
  <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
          Manage Images
        </DialogTitle>
      </DialogHeader>
      <p className="text-xs text-gray-400 -mt-2">{product?.title}</p>

      {/* Current images */}
      <div className="space-y-2 max-h-44 overflow-y-auto">
        {!product?.images.length ? (
          <p className="text-xs text-gray-400 py-2">No images yet.</p>
        ) : (
          product.images.map((img) => (
            <div
              key={img.id}
              className="flex items-center gap-3 border border-[#E8DDD0] rounded-sm p-2"
            >
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="size-10 object-cover rounded-sm flex-shrink-0 border border-[#E8DDD0]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{img.url}</p>
                {img.altText && (
                  <p className="text-[10px] text-gray-400">{img.altText}</p>
                )}
              </div>
              <Button
                size="icon-xs"
                variant="destructive"
                disabled={removeImagePending}
                onClick={() => onRemoveImage(img.id)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add image form */}
      <div className="border-t border-[#E8DDD0] pt-4 space-y-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
          Add Image
        </p>

        <LabelField label="Image URL *">
          <Input
            value={imageForm.url}
            onChange={(e) => onImageFormChange((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
            restrictSpecialChars={false}
          />
        </LabelField>

        <div className="grid grid-cols-2 gap-3">
          <LabelField label="Alt Text">
            <Input
              value={imageForm.altText}
              onChange={(e) => onImageFormChange((p) => ({ ...p, altText: e.target.value }))}
              placeholder="Description"
              restrictSpecialChars={false}
            />
          </LabelField>

          <LabelField label="Position">
            <Input
              type="number"
              value={imageForm.position}
              onChange={(e) => onImageFormChange((p) => ({ ...p, position: e.target.value }))}
              placeholder="0"
              restrictSpecialChars={false}
            />
          </LabelField>
        </div>

        <Button
          size="sm"
          disabled={!imageForm.url || addImagePending}
          onClick={onAddImage}
        >
          {addImagePending ? <Spinner /> : <Plus className="size-3.5" />}
          Add Image
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ImagesModal;
