import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  GripVertical,
  X,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/utils/handleApiError";
import {
  adminCreatePromoItem,
  adminDeletePromoItem,
  adminUpdatePromoItem,
  adminReorderPromoItems,
  type IPromoItem,
} from "@/lib/api";
import {
  PROMO_ITEMS_ADMIN_QUERY_KEY,
  PROMO_ITEMS_QUERY_KEY,
  useAdminPromoItems,
} from "@/hooks/usePromoItems";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

// ── Create / Edit Modal ───────────────────────────────────────────────────────

interface ItemModalProps {
  item?: IPromoItem | null;
  onClose: () => void;
  onSave: (text: string, isActive: boolean) => void;
  isPending: boolean;
}

function ItemModal({ item, onClose, onSave, isPending }: ItemModalProps) {
  const [text, setText] = useState(item?.text ?? "");
  const [isActive, setIsActive] = useState(item?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSave(text.trim(), isActive);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 border border-[#E8DDD0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <h2 className="text-sm tracking-[0.15em] uppercase font-medium text-gray-700">
            {item ? "Edit Promo Item" : "New Promo Item"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
              Text
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={255}
              placeholder="e.g. 🚚 Free Shipping on Orders Above ₹999"
              className="w-full border border-[#E8DDD0] px-3 py-2 text-sm focus:outline-none focus:border-[#9A7A46]"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.12em] uppercase text-gray-500">Active</span>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className="text-[#9A7A46] cursor-pointer"
            >
              {isActive ? <ToggleRight className="size-6" /> : <ToggleLeft className="size-6 text-gray-400" />}
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !text.trim()}
              className="bg-[#2A1F14] text-white hover:bg-[#3d2d1a]"
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PromoItemsPage() {
  const queryClient = useQueryClient();
  const { items, isLoading } = useAdminPromoItems();

  const [modalItem, setModalItem] = useState<IPromoItem | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<IPromoItem | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<IPromoItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Keep localItems in sync when server data arrives (unless user is mid-reorder)
  const displayItems = isDirty ? localItems : items;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [PROMO_ITEMS_ADMIN_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [PROMO_ITEMS_QUERY_KEY] });
  };

  const createMutation = useMutation({
    mutationFn: (dto: { text: string; isActive: boolean }) =>
      adminCreatePromoItem({ ...dto, sortOrder: items.length }),
    onSuccess: () => {
      toast.success("Promo item created");
      setModalItem(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { text?: string; isActive?: boolean } }) =>
      adminUpdatePromoItem(id, dto),
    onSuccess: () => {
      toast.success("Promo item updated");
      setModalItem(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePromoItem(id),
    onSuccess: () => {
      toast.success("Promo item deleted");
      setDeleteTarget(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const reorderMutation = useMutation({
    mutationFn: (ordered: IPromoItem[]) =>
      adminReorderPromoItems(ordered.map((it, idx) => ({ id: it.id, sortOrder: idx }))),
    onSuccess: () => {
      toast.success("Order saved");
      setIsDirty(false);
      invalidate();
    },
    onError: handleApiError,
  });

  // ── Drag-and-drop (HTML5) ─────────────────────────────────────────────────

  const onDragStart = (id: string) => {
    setDraggingId(id);
    if (!isDirty) setLocalItems([...items]);
  };

  const onDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === overId) return;
    setLocalItems((prev) => {
      const from = prev.findIndex((it) => it.id === draggingId);
      const to = prev.findIndex((it) => it.id === overId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setIsDirty(true);
  };

  const onDragEnd = () => setDraggingId(null);

  const handleSaveOrder = () => reorderMutation.mutate(localItems);
  const handleDiscardOrder = () => {
    setLocalItems([...items]);
    setIsDirty(false);
  };

  // ── Modal save ────────────────────────────────────────────────────────────

  const handleModalSave = (text: string, isActive: boolean) => {
    if (modalItem === "new") {
      createMutation.mutate({ text, isActive });
    } else if (modalItem) {
      updateMutation.mutate({ id: modalItem.id, dto: { text, isActive } });
    }
  };

  const isPendingModal =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="size-5 text-[#9A7A46]" />
          <h1 className="text-base tracking-[0.15em] uppercase font-semibold text-gray-800">
            Promo Strip
          </h1>
        </div>
        <Button
          size="sm"
          className="bg-[#2A1F14] text-white hover:bg-[#3d2d1a] gap-1.5"
          onClick={() => setModalItem("new")}
        >
          <Plus className="size-3.5" />
          Add Item
        </Button>
      </div>

      {/* Reorder save bar */}
      {isDirty && (
        <div className="flex items-center justify-between bg-[#F8F4EE] border border-[#E8DDD0] px-4 py-2.5 mb-4 text-sm">
          <span className="text-[#9A7A46] text-xs tracking-wide">Unsaved order changes</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDiscardOrder}>
              Discard
            </Button>
            <Button
              size="sm"
              className="bg-[#2A1F14] text-white hover:bg-[#3d2d1a]"
              disabled={reorderMutation.isPending}
              onClick={handleSaveOrder}
            >
              {reorderMutation.isPending ? "Saving…" : "Save Order"}
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="text-sm text-gray-400 py-10 text-center">Loading…</div>
      ) : displayItems.length === 0 ? (
        <div className="text-sm text-gray-400 py-10 text-center border border-dashed border-[#E8DDD0]">
          No promo items yet. Click "Add Item" to create one.
        </div>
      ) : (
        <ul className="space-y-2">
          {displayItems.map((item) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-3 border border-[#E8DDD0] bg-white px-4 py-3 transition-opacity ${
                draggingId === item.id ? "opacity-40" : ""
              }`}
            >
              <GripVertical className="size-4 text-gray-300 shrink-0 cursor-grab active:cursor-grabbing" />

              <span className="flex-1 text-sm text-gray-700 truncate">{item.text}</span>

              <span
                className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border ${
                  item.isActive
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : "text-gray-400 bg-gray-50 border-gray-200"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>

              <button
                onClick={() => setModalItem(item)}
                className="text-gray-400 hover:text-[#9A7A46] transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-gray-400 mt-3">
        Drag rows to reorder. Only active items appear in the marquee strip.
      </p>

      {/* Create / Edit modal */}
      {modalItem !== null && (
        <ItemModal
          item={modalItem === "new" ? null : modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleModalSave}
          isPending={isPendingModal}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Promo Item"
        description={deleteTarget ? `"${deleteTarget.text}" will be permanently removed.` : undefined}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
