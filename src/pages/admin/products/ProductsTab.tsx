import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, BarChart2, ImagePlus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/utils/handleApiError";
import type { ICreateProduct, IProduct, IUpdateProduct } from "@/types/product";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
  updateProductStock,
} from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductsToolbar } from "./components/ProductToolbar";
import { Pagination } from "@/components/Pagination";
import ProductFormModal, { emptyProductForm, type ProductForm } from "./components/ProductFormModal";
import StockModal from "./components/StockModal";
import ImagesModal, { type ImageForm } from "./components/ImagesModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { useCategories } from "@/hooks/useCategories";
import { PRODUCTS_QUERY_KEY, useProducts } from "@/hooks/useProducts";

const LIMIT = 10;

const ProductsTab = () => {
  const queryClient = useQueryClient();

  // Filters & pagination
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [page, setPage] = useState(1);

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [stockProduct, setStockProduct] = useState<IProduct | null>(null);
  const [imagesProduct, setImagesProduct] = useState<IProduct | null>(null);

  // Forms
  const [form, setForm] = useState<ProductForm>(emptyProductForm());
  const [stockValue, setStockValue] = useState("");
  const [imageForm, setImageForm] = useState<ImageForm>({ url: "", altText: "", position: "" });


  const { products, meta, isLoading: productsLoading } = useProducts(
    {
      search: debouncedSearch || undefined,
      categoryId: categoryFilter || undefined,
      isPublished: showUnpublished ? false : undefined,
      page,
      limit: LIMIT,
    }
  );
  const { categories } = useCategories();

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: ICreateProduct) => createProduct(payload),
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      setShowCreate(false);
      setForm(emptyProductForm());
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateProduct }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      setEditingProduct(null);
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      setDeletingProduct(null);
    },
    onError: handleApiError,
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => updateProductStock(id, stock),
    onSuccess: () => {
      toast.success("Stock updated");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      setStockProduct(null);
    },
    onError: handleApiError,
  });

  const addImageMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: { url: string; altText?: string; position?: number };
    }) => addProductImage(productId, payload),
    onSuccess: () => {
      toast.success("Image added");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      setImageForm({ url: "", altText: "", position: "" });
    },
    onError: handleApiError,
  });

  const removeImageMutation = useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      removeProductImage(productId, imageId),
    onSuccess: () => {
      toast.success("Image removed");
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
    onError: handleApiError,
  });

  // Helpers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const openEdit = (product: IProduct) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      marketPrice: String(product.marketPrice),
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      stock: String(product.stock),
      gstPercent: String(product.gstPercent),
      shortDesc: product.shortDesc ?? "",
      description: product.description ?? "",
      careInstruction: product.careInstruction ?? "",
      isPublished: product.isPublished,
      categoryIds: product.productCategories.map((pc) => pc.category.id),
    });
  };

  const openStock = (product: IProduct) => {
    setStockProduct(product);
    setStockValue(String(product.stock));
  };

  const openImages = (product: IProduct) => {
    setImagesProduct(product);
    setImageForm({ url: "", altText: "", position: "" });
  };

  const handleSubmitProduct = (isEdit: boolean) => {
    if (!form.title || !form.marketPrice) {
      return toast.error("Title and market price are required");
    }
    const base = {
      title: form.title,
      marketPrice: Number(form.marketPrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      gstPercent: Number(form.gstPercent) || 0,
      shortDesc: form.shortDesc || undefined,
      description: form.description || undefined,
      careInstruction: form.careInstruction || undefined,
      isPublished: form.isPublished,
      categoryIds: form.categoryIds.length ? form.categoryIds : undefined,
    };

    if (isEdit && editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, payload: base });
    } else {
      createMutation.mutate({ ...base, stock: Number(form.stock) });
    }
  };

  const handleAddImage = () => {
    if (!imagesProduct || !imageForm.url) return;
    addImageMutation.mutate({
      productId: imagesProduct.id,
      payload: {
        url: imageForm.url,
        altText: imageForm.altText || undefined,
        position: imageForm.position ? Number(imageForm.position) : undefined,
      },
    });
  };

  // Use fresh product data from query for images modal
  const freshImagesProduct =
    products.find((p) => p.id === imagesProduct?.id) ?? imagesProduct;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* Toolbar */}
      <ProductsToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        showUnpublished={showUnpublished}
        setShowUnpublished={setShowUnpublished}
        categories={categories ?? []}
        onCreate={() => setShowCreate(true)}
      />

      {/* Table */}
      <div className="bg-white border border-[#E8DDD0] overflow-x-auto">
        {productsLoading ? (
          <div className="flex items-center justify-center py-16 text-[#C6A46C]">
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="ml-2 text-sm">Loading products…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="size-10 mb-3 opacity-30" />
            <p className="text-sm">No products found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8DDD0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium w-12" />
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                  Stock
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium hidden md:table-cell">
                  Categories
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#C6A46C]/80 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#E8DDD0] hover:bg-[#FDFAF6] transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].altText ?? product.title}
                        className="size-10 object-cover rounded-sm border border-[#E8DDD0]"
                      />
                    ) : (
                      <div className="size-10 bg-[#F8F4EE] border border-[#E8DDD0] rounded-sm flex items-center justify-center">
                        <Package className="size-4 text-[#C6A46C]/40" />
                      </div>
                    )}
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 leading-tight">{product.title}</p>
                    {product.shortDesc && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.shortDesc}</p>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    {product.discountPrice ? (
                      <div>
                        <p className="text-[#C6A46C] font-medium">
                          ₹{product.discountPrice.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          ₹{product.marketPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-800">₹{product.marketPrice.toLocaleString("en-IN")}</p>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openStock(product)}
                      className="flex items-center gap-1 group"
                    >
                      <span
                        className={`font-medium ${product.stock === 0 ? "text-red-500" : "text-gray-800"}`}
                      >
                        {product.stock}
                      </span>
                      <BarChart2 className="size-3 text-gray-300 group-hover:text-[#C6A46C] transition-colors" />
                    </button>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium rounded-sm ${
                        product.isPublished
                          ? "bg-[#C6A46C]/10 text-[#C6A46C]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Categories */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {product.productCategories.slice(0, 2).map((pc) => (
                        <span
                          key={pc.category.id}
                          className="px-1.5 py-0.5 text-[10px] bg-[#F8F4EE] text-[#9A7A50] border border-[#E8DDD0] rounded-sm"
                        >
                          {pc.category.name}
                        </span>
                      ))}
                      {product.productCategories.length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{product.productCategories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => openImages(product)}
                        title="Manage images"
                      >
                        <ImagePlus className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => openEdit(product)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="destructive"
                        onClick={() => setDeletingProduct(product)}
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={LIMIT}
          onPageChange={(val) => setPage(val)}
        />
      )}

      {/* Modals */}
      <ProductFormModal
        open={showCreate || !!editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false);
            setEditingProduct(null);
          }
        }}
        editingProduct={editingProduct}
        form={form}
        onFormChange={handleFormChange}
        onTogglePublished={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
        onToggleCategory={toggleCategory}
        categories={categories}
        isPending={isPending}
        onSubmit={handleSubmitProduct}
      />

      <ConfirmDeleteModal
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)}
        isPending={deleteMutation.isPending}
        title="Delete Product"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-800">"{deletingProduct?.title}"</span>? This action
          cannot be undone.
        </p>
      </ConfirmDeleteModal>

      <StockModal
        open={!!stockProduct}
        onClose={() => setStockProduct(null)}
        stockProduct={stockProduct}
        stockValue={stockValue}
        onStockValueChange={setStockValue}
        isPending={stockMutation.isPending}
        onSubmit={() =>
          stockProduct && stockMutation.mutate({ id: stockProduct.id, stock: Number(stockValue) })
        }
      />

      <ImagesModal
        open={!!imagesProduct}
        onClose={() => setImagesProduct(null)}
        product={freshImagesProduct ?? null}
        imageForm={imageForm}
        onImageFormChange={setImageForm}
        onAddImage={handleAddImage}
        onRemoveImage={(imageId) =>
          imagesProduct && removeImageMutation.mutate({ productId: imagesProduct.id, imageId })
        }
        addImagePending={addImageMutation.isPending}
        removeImagePending={removeImageMutation.isPending}
      />
    </>
  );
};

export default ProductsTab;
