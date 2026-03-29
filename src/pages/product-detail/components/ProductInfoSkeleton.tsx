const ProductInfoSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {/* Category pill */}
    <div className="h-5 w-24 bg-[#F0E8DC] rounded-full" />

    {/* Title */}
    <div className="space-y-2.5">
      <div className="h-7 bg-[#F0E8DC] rounded-full w-full" />
      <div className="h-7 bg-[#F0E8DC] rounded-full w-4/5" />
    </div>

    {/* Divider ornament */}
    <div className="h-3 bg-[#F0E8DC] rounded-full w-32" />

    {/* Price block */}
    <div className="space-y-2 pt-2">
      <div className="h-9 bg-[#F0E8DC] rounded-full w-36" />
      <div className="h-4 bg-[#F0E8DC] rounded-full w-28" />
    </div>

    {/* Stock badge */}
    <div className="h-7 bg-[#F0E8DC] rounded-sm w-32" />

    {/* Short description */}
    <div className="space-y-2 pt-2">
      <div className="h-3.5 bg-[#F0E8DC] rounded-full w-full" />
      <div className="h-3.5 bg-[#F0E8DC] rounded-full w-5/6" />
      <div className="h-3.5 bg-[#F0E8DC] rounded-full w-4/5" />
    </div>

    {/* CTA buttons */}
    <div className="flex gap-3 pt-4">
      <div className="h-12 flex-1 bg-[#F0E8DC] rounded-sm" />
      <div className="h-12 w-12 bg-[#F0E8DC] rounded-sm" />
    </div>

    {/* Meta rows */}
    <div className="pt-4 space-y-3 border-t border-[#E8DDD0]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-3 w-20 bg-[#F0E8DC] rounded-full" />
          <div className="h-3 w-32 bg-[#F0E8DC] rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default ProductInfoSkeleton;