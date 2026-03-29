const ProductListCardSkeleton = () => (
  <div className="flex gap-4 md:gap-6 bg-white border border-[#E8DDD0] rounded-sm overflow-hidden p-3 md:p-4 animate-pulse">
    {/* Image */}
    <div className="w-28 md:w-36 aspect-[3/4] rounded-sm bg-gradient-to-b from-[#F0E8DC] to-[#EDE0D0] shrink-0" />

    {/* Info */}
    <div className="flex flex-col flex-1 py-1 space-y-3">
      <div className="h-2.5 bg-[#F0E8DC] rounded-full w-20" />
      <div className="space-y-2">
        <div className="h-4 bg-[#F0E8DC] rounded-full w-4/5" />
        <div className="h-4 bg-[#F0E8DC] rounded-full w-3/5" />
      </div>
      <div className="h-3 bg-[#F0E8DC] rounded-full w-full hidden sm:block" />
      <div className="h-3 bg-[#F0E8DC] rounded-full w-4/5 hidden sm:block" />
      <div className="flex items-center gap-2 pt-1">
        <div className="h-5 bg-[#F0E8DC] rounded-full w-24" />
        <div className="h-4 bg-[#F0E8DC] rounded-full w-16" />
      </div>
      <div className="flex items-center gap-2 mt-auto pt-2">
        <div className="h-8 bg-[#F0E8DC] rounded-sm w-28" />
        <div className="h-8 w-8 bg-[#F0E8DC] rounded-sm" />
        <div className="h-8 w-8 bg-[#F0E8DC] rounded-sm" />
      </div>
    </div>
  </div>
);

export default ProductListCardSkeleton;