import { type ICategory } from "@/types/category";

interface CategoryBarProps {
  categories: ICategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CategoryBar = ({
  categories,
  selectedId,
  onSelect,
}: CategoryBarProps) => {
  const btnBase =
    "shrink-0 px-5 py-2 text-[11px] tracking-[0.18em] uppercase font-medium border transition-all duration-200 rounded-sm whitespace-nowrap";
  const activeClass = "bg-[#9A7A46] text-white border-[#9A7A46]";
  const inactiveClass =
    "border-[#E8DDD0] text-gray-600 hover:border-[#9A7A46] hover:text-[#9A7A46] bg-white";

  return (
    <div className="relative">
      {/* Scroll fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide px-2">
        {/* All tab */}
        <button
          onClick={() => onSelect("")}
          className={`${btnBase} ${!selectedId ? activeClass : inactiveClass}`}
        >
          All
        </button>

        {/* Category tabs */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`${btnBase} ${selectedId === cat.id ? activeClass : inactiveClass}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
