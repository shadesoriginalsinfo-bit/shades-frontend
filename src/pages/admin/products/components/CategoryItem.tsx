import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ICategory } from "@/types/category";

interface Props {
  category: ICategory;
  depth: number;
  onEdit: (c: ICategory) => void;
  onDelete: (c: ICategory) => void;
}

const CategoryItem = ({ category, depth, onEdit, onDelete }: Props) => (
  <div>
    <div
      className="flex items-center gap-2 py-2.5 border-b border-[#E8DDD0] hover:bg-[#FDFAF6] transition-colors"
      style={{ paddingLeft: `${16 + depth * 24}px`, paddingRight: "16px" }}
    >
      {depth > 0 && (
        <ChevronRight className="size-3 text-[#9A7A46]/40 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{category.name}</p>
        <p className="text-[11px] text-gray-400 font-mono">{category.slug}</p>
      </div>
      {category.description && (
        <p className="text-xs text-gray-400 hidden md:block truncate max-w-52 min-w-28 pr-4">
          {category.description}
        </p>
      )}

      <p className="text-xs text-gray-400 hidden md:block truncate min-w-12">
        {category.sortOrder}
      </p>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button size="icon-xs" variant="ghost" onClick={() => onEdit(category)}>
          <Pencil className="size-3.5" />
        </Button>
        <Button
          size="icon-xs"
          variant="destructive"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
    {category.children?.map((child) => (
      <CategoryItem
        key={child.id}
        category={child}
        depth={depth + 1}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default CategoryItem;
