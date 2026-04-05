import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/utils/handleApiError";
import type { ICategory, ICreateCategory, IUpdateCategory } from "@/types/category";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import CategoryItem from "./components/CategoryItem";
import CategoryFormModal, { emptyForm, type CatForm } from "./components/CategoryFormModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { CATEGORIES_QUERY_KEY } from "@/hooks/useCategories";

const generateSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const CategoriesTab = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);

  const [showCreate, setShowCreate] = useState(false);
  const [editingCat, setEditingCat] = useState<ICategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<ICategory | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm());

  // Tree for display
  const treeQuery = useQuery({
    queryKey: ["admin-categories-tree", debouncedSearch],
    queryFn: () => getCategories({ search: debouncedSearch || undefined, flat: true }),
  });

  const categories = treeQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: ICreateCategory) => createCategory(payload),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["admin-categories-tree"] });
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      setShowCreate(false);
      setForm(emptyForm());
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateCategory }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["admin-categories-tree"] });
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      setEditingCat(null);
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories-tree"] });
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      setDeletingCat(null);
    },
    onError: handleApiError,
  });

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug === generateSlug(prev.name) || prev.slug === ""
          ? generateSlug(name)
          : prev.slug,
    }));
  };

  const openEdit = (cat: ICategory) => {
    setEditingCat(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", sortOrder: cat.sortOrder });
  };

  const handleSubmit = (isEdit: boolean) => {
    if (!form.name || !form.slug) return toast.error("Name and slug are required");
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      sortOrder: form.sortOrder,
    };
    if (isEdit && editingCat) {
      updateMutation.mutate({ id: editingCat.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            restrictSpecialChars={false}
          />
        </div>
        <Button
          size="sm"
          onClick={() => {
            setShowCreate(true);
            setForm(emptyForm());
          }}
        >
          <Plus className="size-3.5" /> New Category
        </Button>
      </div>

      {/* Category tree */}
      <div className="bg-white border border-[#E8DDD0]">
        <div className="flex items-center gap-4 px-4 py-3 bg-[#F8F4EE] border-b border-[#E8DDD0]">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium flex-1">
            Name / Slug
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium hidden md:block">
            Description
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium hidden md:block">
            Sort Order
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
            Actions
          </span>
        </div>

        {treeQuery.isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#C6A46C]">
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="ml-2 text-sm">Loading categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FolderOpen className="size-10 mb-3 opacity-30" />
            <p className="text-sm">No categories found</p>
          </div>
        ) : (
          <div>
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                depth={0}
                onEdit={openEdit}
                onDelete={setDeletingCat}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={showCreate || !!editingCat}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false);
            setEditingCat(null);
          }
        }}
        editingCat={editingCat}
        form={form}
        onNameChange={handleNameChange}
        onFormChange={setForm}
        isPending={isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        onConfirm={() => deletingCat && deleteMutation.mutate(deletingCat.id)}
        isPending={deleteMutation.isPending}
        title="Delete Category"
      >
        <p className="text-sm text-gray-600">
          Delete{" "}
          <span className="font-medium text-gray-800">"{deletingCat?.name}"</span>?
          {!!deletingCat?.children?.length && (
            <span className="block mt-1 text-orange-500 text-xs">
              This will also delete all subcategories.
            </span>
          )}
        </p>
      </ConfirmDeleteModal>
    </>
  );
};

export default CategoriesTab;
