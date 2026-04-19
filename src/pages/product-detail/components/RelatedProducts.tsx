import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/pages/home/components/ProductCard";
import ProductCardSkeleton from "@/pages/home/components/ProductCardSkeleton";
import SectionHeading from "@/pages/home/components/SectionHeading";

interface RelatedProductsProps {
  categoryId: string | undefined;
  currentProductId: string;
}

const RelatedProducts = ({
  categoryId,
  currentProductId,
}: RelatedProductsProps) => {
  const { products, isLoading } = useProducts({
    categoryId: categoryId || undefined,
    isPublished: true,
    limit: 5, // fetch 5, filter out current below
    page: 1,
  });

  // exclude the current product and cap at 4
  const filtered = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  // Don't render the section if no related products (after loading)
  if (!isLoading && filtered.length === 0) return null;

  return (
    <section className="py-14 border-t border-[#E8DDD0] bg-[#FDFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="You May Also Like"
          title="Related Products"
          subtitle="Hand-selected pieces from the same collection"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* View all CTA */}
        {!isLoading && filtered.length > 0 && categoryId && (
          <div className="text-center mt-10">
            <Link
              to={`/shop?category=${categoryId}`}
              className="inline-flex items-center gap-2.5 px-10 py-3.5 border border-[#9A7A46] text-[#9A7A46] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#9A7A46] hover:text-white transition-all duration-200 rounded-sm group"
            >
              View Full Collection
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

export default RelatedProducts;
