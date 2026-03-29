import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api";
import { type ICategory } from "@/types/category";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import CategoryBar from "./CategoryBar";
import SectionHeading from "./SectionHeading";

interface ProductsSectionProps {
  /** Section heading eyebrow text */
  eyebrow?: string;
  /** Section heading title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** How many products to fetch */
  limit?: number;
  /** Whether to show the category filter bar */
  showCategoryFilter?: boolean;
  /** If set, will lock the section to this category id */
  fixedCategoryId?: string;
}

const LIMIT = 8;

const ProductsSection = ({
  eyebrow = "Our Collection",
  title = "Featured Products",
  subtitle = "Handpicked pieces crafted with love and tradition",
  limit = LIMIT,
  showCategoryFilter = true,
  fixedCategoryId,
}: ProductsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState(fixedCategoryId ?? "");

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["home-products", { selectedCategory, limit }],
    queryFn: () =>
      getProducts({
        categoryId: selectedCategory || undefined,
        isPublished: true,
        limit,
        page: 1,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData } = useQuery<ICategory[]>({
    queryKey: ["home-categories-flat"],
    queryFn: () => getCategories({ flat: true }),
    staleTime: 1000 * 60 * 10,
    enabled: showCategoryFilter,
  });

  const products = productsData?.data ?? [];
  const categories = categoriesData ?? [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {/* Category filter */}
        {showCategoryFilter && !fixedCategoryId && categories.length > 0 && (
          <div className="mb-8">
            <CategoryBar
              categories={categories}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Error state */}
        {productsError && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 tracking-wider">
              Failed to load products. Please try again later.
            </p>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {productsLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* Empty state */}
        {!productsLoading && !productsError && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400 tracking-wider">
              No products found in this category.
            </p>
          </div>
        )}

        {/* View all CTA */}
        {!productsLoading && products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to={`/shop${selectedCategory ? `?category=${selectedCategory}` : ""}`}
              className="inline-flex items-center gap-2.5 px-10 py-3.5 border border-[#C6A46C] text-[#C6A46C] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#C6A46C] hover:text-white transition-all duration-200 rounded-sm group"
            >
              View All Products
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;