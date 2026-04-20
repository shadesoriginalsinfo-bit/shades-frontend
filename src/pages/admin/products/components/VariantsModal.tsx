import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ImagePlus, Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
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
import { PRODUCTS_QUERY_KEY } from "@/hooks/useProducts";
import { handleApiError } from "@/utils/handleApiError";
import {
  addVariant,
  removeVariant,
  addVariantSize,
  updateVariantSizeStock,
  removeVariantSize,
  addVariantImages,
  removeVariantImage,
  reorderVariantImages,
} from "@/lib/api";
import Spinner from "./Spinner";
import ImagesModal from "./ImagesModal";

interface Props {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const VariantsModal = ({ open, onClose, product }: Props) => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

  // ── Add Variant form ──────────────────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newSizes, setNewSizes] = useState([{ size: "", stock: "0" }]);

  // ── Add Size (per variant) ────────────────────────────────────────────────
  const [addSizeFor, setAddSizeFor] = useState<string | null>(null);
  const [sizeLabel, setSizeLabel] = useState("");
  const [sizeStock, setSizeStock] = useState("0");

  // ── Inline stock edit ─────────────────────────────────────────────────────
  const [editingStock, setEditingStock] = useState<{
    variantId: string;
    sizeId: string;
    value: string;
  } | null>(null);

  // ── Images sub-modal ──────────────────────────────────────────────────────
  const [imagesVariantId, setImagesVariantId] = useState<string | null>(null);
  const imagesVariant =
    product?.variants.find((v) => v.id === imagesVariantId) ?? null;

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addVariantMut = useMutation({
    mutationFn: (dto: Parameters<typeof addVariant>[1]) =>
      addVariant(product!.id, dto),
    onSuccess: () => {
      toast.success("Variant added");
      invalidate();
      resetAddForm();
    },
    onError: handleApiError,
  });

  const removeVariantMut = useMutation({
    mutationFn: (variantId: string) => removeVariant(product!.id, variantId),
    onSuccess: () => {
      toast.success("Variant removed");
      invalidate();
    },
    onError: handleApiError,
  });

  const addSizeMut = useMutation({
    mutationFn: ({
      variantId,
      dto,
    }: {
      variantId: string;
      dto: { size: string; stock: number };
    }) => addVariantSize(product!.id, variantId, dto),
    onSuccess: () => {
      toast.success("Size added");
      invalidate();
      setAddSizeFor(null);
      setSizeLabel("");
      setSizeStock("0");
    },
    onError: handleApiError,
  });

  const updateStockMut = useMutation({
    mutationFn: ({
      variantId,
      sizeId,
      stock,
    }: {
      variantId: string;
      sizeId: string;
      stock: number;
    }) => updateVariantSizeStock(product!.id, variantId, sizeId, stock),
    onSuccess: () => {
      toast.success("Stock updated");
      invalidate();
      setEditingStock(null);
    },
    onError: handleApiError,
  });

  const removeSizeMut = useMutation({
    mutationFn: ({
      variantId,
      sizeId,
    }: {
      variantId: string;
      sizeId: string;
    }) => removeVariantSize(product!.id, variantId, sizeId),
    onSuccess: () => {
      toast.success("Size removed");
      invalidate();
    },
    onError: handleApiError,
  });

  const addImagesMut = useMutation({
    mutationFn: ({
      variantId,
      files,
    }: {
      variantId: string;
      files: File[];
    }) => addVariantImages(product!.id, variantId, files),
    onSuccess: () => {
      toast.success("Images added");
      invalidate();
    },
    onError: handleApiError,
  });

  const removeImageMut = useMutation({
    mutationFn: ({
      variantId,
      imageId,
    }: {
      variantId: string;
      imageId: string;
    }) => removeVariantImage(product!.id, variantId, imageId),
    onSuccess: () => {
      toast.success("Image removed");
      invalidate();
    },
    onError: handleApiError,
  });

  const reorderImagesMut = useMutation({
    mutationFn: ({
      variantId,
      images,
    }: {
      variantId: string;
      images: { id: string; position: number }[];
    }) => reorderVariantImages(product!.id, variantId, images),
    onSuccess: () => {
      toast.success("Order saved");
      invalidate();
    },
    onError: handleApiError,
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetAddForm = () => {
    setShowAddForm(false);
    setNewColor("");
    setNewColorCode("");
    setNewSizes([{ size: "", stock: "0" }]);
  };

  const handleAddVariant = () => {
    if (!newColor.trim()) return toast.error("Color name is required");
    const validSizes = newSizes.filter((s) => s.size.trim());
    if (!validSizes.length) return toast.error("At least one size is required");
    addVariantMut.mutate({
      color: newColor.trim(),
      colorCode: newColorCode.trim() || undefined,
      sizes: validSizes.map((s) => ({
        size: s.size.trim(),
        stock: Math.max(0, Number(s.stock) || 0),
      })),
    });
  };

  const handleAddSize = (variantId: string) => {
    if (!sizeLabel.trim()) return toast.error("Size label is required");
    addSizeMut.mutate({
      variantId,
      dto: { size: sizeLabel.trim(), stock: Math.max(0, Number(sizeStock) || 0) },
    });
  };

  const handleSaveStock = () => {
    if (!editingStock) return;
    updateStockMut.mutate({
      variantId: editingStock.variantId,
      sizeId: editingStock.sizeId,
      stock: Math.max(0, Number(editingStock.value) || 0),
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="pb-1">
            <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
              Manage Variants
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-gray-400 mb-4 truncate">{product?.title}</p>

          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {/* Empty state */}
            {!product?.variants.length && !showAddForm && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Layers className="size-8 mb-2 opacity-30" />
                <p className="text-sm">No variants yet</p>
              </div>
            )}

            {/* Variant cards */}
            {product?.variants.map((variant) => (
              <div
                key={variant.id}
                className="border border-[#E8DDD0] rounded-sm p-3 bg-white"
              >
                {/* Variant header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {variant.colorCode && (
                      <span
                        className="size-4 rounded-full border border-[#E8DDD0] shrink-0"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                    )}
                    <span className="font-medium text-sm text-gray-800 truncate">
                      {variant.color}
                    </span>
                    {variant.colorCode && (
                      <span className="text-[10px] text-gray-400 font-mono shrink-0">
                        {variant.colorCode}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-300 shrink-0">
                      · {variant.images.length} img
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setImagesVariantId(variant.id)}
                      title="Manage images"
                    >
                      <ImagePlus className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="destructive"
                      onClick={() => removeVariantMut.mutate(variant.id)}
                      disabled={removeVariantMut.isPending}
                      title="Remove variant"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-1.5 mb-2">
                  {variant.sizes.length === 0 && (
                    <p className="text-xs text-gray-400">No sizes added</p>
                  )}
                  {variant.sizes.map((size) => (
                    <div key={size.id} className="flex items-center gap-2 text-xs">
                      <span className="w-14 font-medium text-gray-700 shrink-0">
                        {size.size}
                      </span>

                      {editingStock?.sizeId === size.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editingStock.value}
                            onChange={(e) =>
                              setEditingStock((prev) =>
                                prev ? { ...prev, value: e.target.value } : null,
                              )
                            }
                            className="w-16 h-6 text-xs px-1"
                            restrictSpecialChars={false}
                          />
                          <button
                            onClick={handleSaveStock}
                            disabled={updateStockMut.isPending}
                            className="p-0.5 text-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                          >
                            {updateStockMut.isPending ? (
                              <Spinner />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingStock(null)}
                            className="p-0.5 text-gray-400 hover:text-gray-600"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingStock({
                              variantId: variant.id,
                              sizeId: size.id,
                              value: String(size.stock),
                            })
                          }
                          className={`flex items-center gap-1 group ${
                            size.stock === 0 ? "text-red-500" : "text-gray-700"
                          }`}
                          title="Click to edit stock"
                        >
                          <span>{size.stock}</span>
                          <Pencil className="size-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          removeSizeMut.mutate({
                            variantId: variant.id,
                            sizeId: size.id,
                          })
                        }
                        disabled={removeSizeMut.isPending}
                        className="ml-auto text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add size inline form */}
                {addSizeFor === variant.id ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8DDD0]">
                    <Input
                      value={sizeLabel}
                      onChange={(e) => setSizeLabel(e.target.value)}
                      placeholder="e.g. M"
                      className="h-7 text-xs w-20"
                      restrictSpecialChars={false}
                    />
                    <Input
                      type="number"
                      value={sizeStock}
                      onChange={(e) => setSizeStock(e.target.value)}
                      placeholder="Stock"
                      className="h-7 text-xs w-16"
                      restrictSpecialChars={false}
                    />
                    <Button
                      size="sm"
                      className="h-7 text-xs px-2.5"
                      disabled={addSizeMut.isPending}
                      onClick={() => handleAddSize(variant.id)}
                    >
                      {addSizeMut.isPending ? <Spinner /> : "Add"}
                    </Button>
                    <button
                      onClick={() => {
                        setAddSizeFor(null);
                        setSizeLabel("");
                        setSizeStock("0");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddSizeFor(variant.id);
                      setSizeLabel("");
                      setSizeStock("0");
                    }}
                    className="flex items-center gap-1 text-xs text-[#9A7A46] hover:text-[#B8936A] transition-colors mt-1"
                  >
                    <Plus className="size-3" />
                    Add Size
                  </button>
                )}
              </div>
            ))}

            {/* Add Variant form */}
            {showAddForm ? (
              <div className="border border-[#9A7A46]/30 rounded-sm p-3 bg-[#FDFAF6]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium mb-3">
                  New Variant
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <LabelField label="Color Name *">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="e.g. Black"
                      restrictSpecialChars={false}
                    />
                  </LabelField>
                  <LabelField label="Color Code">
                    <Input
                      value={newColorCode}
                      onChange={(e) => setNewColorCode(e.target.value)}
                      placeholder="#000000"
                      restrictSpecialChars={false}
                    />
                  </LabelField>
                </div>

                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-2">
                  Sizes *
                </p>
                <div className="space-y-2 mb-2">
                  {newSizes.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={s.size}
                        onChange={(e) =>
                          setNewSizes((prev) =>
                            prev.map((item, idx) =>
                              idx === i ? { ...item, size: e.target.value } : item,
                            ),
                          )
                        }
                        placeholder="S / M / L / XL"
                        className="flex-1"
                        restrictSpecialChars={false}
                      />
                      <Input
                        type="number"
                        value={s.stock}
                        onChange={(e) =>
                          setNewSizes((prev) =>
                            prev.map((item, idx) =>
                              idx === i ? { ...item, stock: e.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Stock"
                        className="w-20"
                        restrictSpecialChars={false}
                      />
                      {newSizes.length > 1 && (
                        <button
                          onClick={() =>
                            setNewSizes((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          className="text-gray-400 hover:text-red-500 shrink-0"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setNewSizes((prev) => [...prev, { size: "", stock: "0" }])
                  }
                  className="flex items-center gap-1 text-xs text-[#9A7A46] hover:text-[#B8936A] mb-3"
                >
                  <Plus className="size-3" />
                  Add Size Row
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={addVariantMut.isPending}
                    onClick={handleAddVariant}
                  >
                    {addVariantMut.isPending && <Spinner />}
                    Add Variant
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetAddForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="w-full border-dashed border-[#9A7A46]/40 text-[#9A7A46] hover:bg-[#9A7A46]/5"
              >
                <Plus className="size-3.5 mr-1" />
                Add Variant
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested images modal */}
      <ImagesModal
        open={!!imagesVariantId}
        onClose={() => setImagesVariantId(null)}
        variant={imagesVariant}
        onAddImages={(files) =>
          imagesVariantId &&
          addImagesMut.mutate({ variantId: imagesVariantId, files })
        }
        onRemoveImage={(imageId) =>
          imagesVariantId &&
          removeImageMut.mutate({ variantId: imagesVariantId, imageId })
        }
        onReorderImages={(images) =>
          imagesVariantId &&
          reorderImagesMut.mutate({ variantId: imagesVariantId, images })
        }
        addImagesPending={addImagesMut.isPending}
        removeImagePending={removeImageMut.isPending}
        reorderPending={reorderImagesMut.isPending}
      />
    </>
  );
};

export default VariantsModal;
