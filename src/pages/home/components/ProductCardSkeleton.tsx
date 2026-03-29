const ProductCardSkeleton = () => (
  <div className="bg-white border border-[#E8DDD0] rounded-sm overflow-hidden animate-pulse">
    {/* Image placeholder */}
    <div className="aspect-[3/4] bg-gradient-to-b from-[#F0E8DC] to-[#EDE0D0]" />

    {/* Info placeholder */}
    <div className="p-4 space-y-3">
      <div className="h-2.5 bg-[#F0E8DC] rounded-full w-1/3" />
      <div className="space-y-2">
        <div className="h-3.5 bg-[#F0E8DC] rounded-full w-4/5" />
        <div className="h-3.5 bg-[#F0E8DC] rounded-full w-3/5" />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <div className="h-5 bg-[#F0E8DC] rounded-full w-20" />
        <div className="h-3.5 bg-[#F0E8DC] rounded-full w-14" />
      </div>
      <div className="h-9 bg-[#F0E8DC] rounded-sm mt-2" />
    </div>
  </div>
);

export default ProductCardSkeleton;