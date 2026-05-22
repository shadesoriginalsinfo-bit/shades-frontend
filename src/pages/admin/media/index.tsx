import { Images, Loader2 } from "lucide-react";
import { useAdminMedia } from "@/hooks/useMedia";
import MediaUploadZone from "./components/MediaUploadZone";
import MediaCard from "./components/MediaCard";

const MediaPage = () => {
  const {
    items,
    isLoading,
    upload,
    uploading,
    update,
    updating,
    updatingId,
    remove,
    removing,
    removingId,
  } = useAdminMedia();

  return (
    <div className="space-y-6 p-1 md:p-4 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Images size={18} className="text-[#9A7A46]" />
          <h1 className="text-xl font-bold text-gray-800">Banner Images</h1>
        </div>
        <p className="text-sm text-gray-500">
          Manage homepage hero carousel images.
        </p>
      </div>

      <MediaUploadZone onUpload={upload} uploading={uploading} />

      {/* Current banners */}
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
              <MediaCard
                key={item.id}
                item={item}
                onUpdate={update}
                onRemove={remove}
                updating={updating}
                updatingId={updatingId}
                removing={removing}
                removingId={removingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
