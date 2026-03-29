import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toggle } from "@/components/Toggle";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  showUnpublished: boolean;
  setShowUnpublished: (v: boolean) => void;
  categories: { id: string; name: string }[];
  onCreate: () => void;
};

export const ProductsToolbar = ({
  search,
  setSearch,
  setPage,
  categoryFilter,
  setCategoryFilter,
  showUnpublished,
  setShowUnpublished,
  categories,
  onCreate,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        restrictSpecialChars={false}
      />

      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value);
          setPage(1);
        }}
        className="h-9 border-b border-[#D4B896] bg-transparent text-sm"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <Toggle
        checked={!showUnpublished}
        onChange={(val) => {
          setShowUnpublished(!val);
          setPage(1);
        }}
        label={showUnpublished ? "Unpublished" : "Published"}
      />

      <Button size="sm" onClick={onCreate}>
        <Plus className="size-3.5" /> New Product
      </Button>
    </div>
  );
};