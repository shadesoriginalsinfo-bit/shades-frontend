import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import {
  PromoStrip,
  TrustBar,
  FeatureBanners,
  ThreeBanners,
  DiscountBanner,
} from "./components/Banners";
import ProductsSection from "./components/ProductsSection";
import Footer from "./components/Footer";


const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      <PromoStrip />
      <Header />

      {/* Hero carousel */}
      <HeroCarousel />

      {/* Trust badges */}
      <TrustBar />

      {/* Featured products with category filter */}
      <ProductsSection
        eyebrow="Our Collection"
        title="Featured Products"
        subtitle="Handpicked pieces crafted with love and tradition"
        limit={8}
        showCategoryFilter={true}
      />

      {/* 2-column editorial feature banners */}
      <FeatureBanners />

      {/* New Arrivals — no category filter */}
      <ProductsSection
        eyebrow="Just In"
        title="New Arrivals"
        subtitle="Fresh styles added every week — be the first to wear them"
        limit={4}
        showCategoryFilter={false}
      />

      {/* 3-column mini category banners */}
      <ThreeBanners />

      {/* Full-width discount banner */}
      <DiscountBanner />

      <Footer />
    </div>
  );
};

export default HomePage;