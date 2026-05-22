import { useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { IMedia } from "@/lib/api";

interface Props {
  item: IMedia;
  onUpdate: (id: string, dto: { isActive?: boolean; sortOrder?: number }) => void;
  onRemove: (id: string) => void;
  updating: boolean;
  updatingId: string | undefined;
  removing: boolean;
  removingId: string | undefined;
}

const MediaCard = ({
  item,
  onUpdate,
  onRemove,
  updating,
  updatingId,
  removing,
  removingId,
}: Props) => {
  const [isActive, setIsActive] = useState(item.isActive);
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));

  const isDirty =
    isActive !== item.isActive || Number(sortOrder) !== item.sortOrder;

  const isSaving = updating && updatingId === item.id;
  const isDeleting = removing && removingId === item.id;

  const handleSave = () => {
    const order = parseInt(sortOrder, 10);
    onUpdate(item.id, {
      isActive,
      sortOrder: isNaN(order) ? item.sortOrder : order,
    });
  };

  return (
    <div className="rounded-xl border border-[#E8DDD0] overflow-hidden bg-white flex flex-col">
      {/* Thumbnail */}
      <div className="relative group aspect-video bg-[#F8F4EE]">
        <img
          src={item.url}
          alt={item.altText ?? "banner"}
          className="w-full h-full object-cover"
        />
        {/* Delete overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button
            onClick={() => onRemove(item.id)}
            disabled={isDeleting || isSaving}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Active toggle + sort order */}
        <div className="flex items-center justify-between gap-2">
          {/* Toggle */}
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              isActive ? "bg-[#9A7A46]" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                isActive ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-[10px] text-gray-500 flex-1">
            {isActive ? "Active" : "Inactive"}
          </span>

          {/* Sort order */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">#</span>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-12 text-xs text-center border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:border-[#9A7A46] transition-colors"
            />
          </div>
        </div>

        {/* Save button — only when dirty */}
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#2A1810] hover:bg-[#9A7A46] text-white text-[10px] font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Save className="size-3" />
            )}
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
