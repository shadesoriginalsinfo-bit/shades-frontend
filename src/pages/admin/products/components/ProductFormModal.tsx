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
import type { IProduct } from "@/types/product";
import Spinner from "./Spinner";

export const emptyProductForm = () => ({
  title: "",
  marketPrice: "",
  discountPrice: "",
  gstPercent: "",
  shortDesc: "",
  description: "",
  careInstruction: "",
  isPublished: true,
  categoryIds: [] as string[],
});

export type ProductForm = ReturnType<typeof emptyProductForm>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: IProduct | null;
  form: ProductForm;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onTogglePublished: () => void;
  onToggleCategory: (id: string) => void;
  categories: ICategory[];
  isPending: boolean;
  onSubmit: (isEdit: boolean) => void;
}

const ProductFormModal = ({
  open,
  onOpenChange,
  editingProduct,
  form,
  onFormChange,
  onTogglePublished,
  onToggleCategory,
  categories,
  isPending,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-base font-light tracking-wide text-gray-800 font-serif">
          {editingProduct ? "Edit Product" : "New Product"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <LabelField label="Title *">
          <Input
            name="title"
            value={form.title}
            onChange={onFormChange}
            placeholder="Product title"
            restrictSpecialChars={false}
          />
        </LabelField>

        <div className="grid grid-cols-2 gap-4">
          <LabelField label="Market Price (₹)">
            <Input
              name="marketPrice"
              type="number"
              value={form.marketPrice}
              onChange={onFormChange}
              placeholder="0.00"
              restrictSpecialChars={false}
            />
          </LabelField>

          <LabelField label="Discount Price (₹)">
            <Input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={onFormChange}
              placeholder="Optional"
              restrictSpecialChars={false}
            />
          </LabelField>
        </div>

        <LabelField label="GST (%)">
          <Input
            name="gstPercent"
            type="number"
            value={form.gstPercent}
            onChange={onFormChange}
            placeholder="e.g. 18"
            restrictSpecialChars={false}
          />
        </LabelField>

        <div>
          <LabelField label="Short Description">
            <Input
              name="shortDesc"
              value={form.shortDesc}
              onChange={onFormChange}
              placeholder="Brief summary"
              restrictSpecialChars={false}
            />
          </LabelField>
        </div>

        <div>
          <LabelField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder={"Each line becomes a bullet point\nLine 1\nLine 2"}
              rows={4}
              className="w-full bg-transparent text-sm text-gray-800 outline-none border border-[#D4B896] px-2 pb-1 pt-1.5 placeholder:text-[#9A7A46]/70 placeholder:text-xs placeholder:tracking-wider focus:border-[#9A7A46] focus:shadow-[0_1px_0_0_#9A7A46] resize-none"
            />
          </LabelField>
        </div>

        <div>
          <LabelField label="Care Instructions">
            <textarea
              name="careInstruction"
              value={form.careInstruction}
              onChange={onFormChange}
              placeholder={
                "Each line becomes a bullet point\nHand wash in cold water\nDo not bleach"
              }
              rows={4}
              className="w-full bg-transparent text-sm text-gray-800 outline-none border border-[#D4B896] px-2 pb-1 pt-1.5 placeholder:text-[#9A7A46]/70 placeholder:text-xs placeholder:tracking-wider focus:border-[#9A7A46] focus:shadow-[0_1px_0_0_#9A7A46] resize-none"
            />
          </LabelField>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePublished}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              form.isPublished ? "bg-[#9A7A46]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full transition-transform shadow-sm ${
                form.isPublished ? "translate-x-4" : ""
              }`}
            />
          </button>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#9A7A46] font-medium">
            Published
          </span>
        </div>

        {categories.length > 0 && (
          <div>
            <label>Categories *</label>
            <div className="max-h-36 overflow-y-auto border border-[#E8DDD0] rounded-sm p-2 space-y-1.5">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#9A7A46] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(cat.id)}
                    onChange={() => onToggleCategory(cat.id)}
                    className="accent-[#9A7A46] size-3.5"
                  />
                  <span className="text-xs text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => onSubmit(!!editingProduct)}
        >
          {isPending && <Spinner />}
          {editingProduct ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ProductFormModal;
