import { useParams } from "react-router-dom";
import Header from "@/pages/home/components/Header";
import Footer from "@/pages/home/components/Footer";
import ProductImageGallery, {
  GallerySkeleton,
} from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductInfoSkeleton from "./components/ProductInfoSkeleton";
import RelatedProducts from "./components/RelatedProducts";
import ProductNotFound from "./components/ProductNotFound";
import { PromoStrip } from "@/pages/home/components/Banners";
import { getProductById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError, error} = useQuery({
    queryKey: ["products", id],
    queryFn: () =>getProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if(isError) return <div className="min-h-screen flex items-center justify-center">
    <p className="text-red-500">Error loading product: {(error as Error).message}</p>
  </div>

  const primaryCategory = product?.productCategories[0].category;

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Announcement strip */}
      <PromoStrip />

      {/* Sticky header */}
      <Header />

      {/* ── Hero band matching the carousel/shop-banner aesthetic ── */}
      <div className="relative bg-gradient-to-r from-[#F5EFE7] via-[#EDE0D0] to-[#F0E6DA] border-b border-[#E8DDD0] overflow-hidden">
        {/* Diagonal texture — same as carousel */}
        <div className="absolute inset-0 opacity-[0.025] bg-[repeating-linear-gradient(45deg,#C6A46C_0px,#C6A46C_1px,transparent_1px,transparent_12px)]" />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(212,175,122,0.15)_0%,transparent_70%)]" />
        {/* Decorative arch right */}
        <div className="absolute right-10 bottom-0 w-32 h-[120%] rounded-t-full border border-[#C6A46C]/12 hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          {/* Inline breadcrumb text — real breadcrumb is inside ProductInfo */}
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C]/60 font-medium">
            {isLoading
              ? "Loading product…"
              : isError
              ? "Product not found"
              : product?.title ?? "Product Details"}
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Error / not found */}
        {isError && <ProductNotFound isError />}
        {!isLoading && !isError && !product && <ProductNotFound />}

        {/* Product layout: image gallery (left) + info panel (right) */}
        {(isLoading || product) && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

            {/* ── Left: image gallery ── */}
            <div className="lg:sticky lg:top-24">
              {isLoading ? (
                <GallerySkeleton />
              ) : (
                <ProductImageGallery
                  images={product!.images}
                  title={product!.title}
                />
              )}
            </div>

            {/* ── Right: product info ── */}
            <div>
              {isLoading ? (
                <ProductInfoSkeleton />
              ) : (
                <ProductInfo product={product!} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Related products ── */}
      {!isLoading && !isError && product && (
        <RelatedProducts
          categoryId={primaryCategory?.id}
          currentProductId={product.id}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;