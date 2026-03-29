import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LabelField from "@/components/LabelField";
import type { ICategory } from "@/types/category";
import Spinner from "./Spinner";

export const emptyForm = () => ({ name: "", slug: "", description: "", parentId: "" });
export type CatForm = ReturnType<typeof emptyForm>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCat: ICategory | null;
  form: CatForm;
  onNameChange: (name: string) => void;
  onFormChange: (updater: (prev: CatForm) => CatForm) => void;
  flatCategories: ICategory[];
  isPending: boolean;
  onSubmit: (isEdit: boolean) => void;
}

const CategoryFormModal = ({
  open,
  onOpenChange,
  editingCat,
  form,
  onNameChange,
  onFormChange,
  flatCategories,
  isPending,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
          {editingCat ? "Edit Category" : "New Category"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <LabelField label="Name">
          <Input
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Category name"
            restrictSpecialChars={false}
          />
        </LabelField>

        <LabelField label="Slug *">
          <Input
            value={form.slug}
            onChange={(e) => onFormChange((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="category-slug"
            restrictSpecialChars={false}
          />
        </LabelField>

        <LabelField label="Description">
          <Input
            value={form.description}
            onChange={(e) => onFormChange((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description..."
          />
        </LabelField>

        <div>
          <label>Parent Category</label>
          <select
            value={form.parentId}
            onChange={(e) => onFormChange((prev) => ({ ...prev, parentId: e.target.value }))}
            className="w-full h-8 border-b border-[#D4B896] bg-transparent text-sm text-gray-700 outline-none focus:border-[#C6A46C] pb-1"
          >
            <option value="">None (Root category)</option>
            {flatCategories
              .filter((c) => c.id !== editingCat?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button size="sm" disabled={isPending} onClick={() => onSubmit(!!editingCat)}>
          {isPending && <Spinner />}
          {editingCat ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CategoryFormModal;
