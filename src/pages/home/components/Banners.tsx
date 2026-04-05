import { Truck, RefreshCw, Shield, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   PromoStrip — thin scrolling announcement bar
   ───────────────────────────────────────────── */
const PROMO_ITEMS = [
  "🚚 Free Shipping on Orders Above ₹999",
  "✨ New Festive Collection Now Live",
  "🔄 Easy 7-Day Returns · No Questions Asked",
  "💎 Flat 20% Off — Use Code: SHADES20",
  "🎁 Gift Wrapping Available on All Orders",
];

export const PromoStrip = () => (
  <div className="bg-[#1a1a1a] text-white py-2.5 overflow-hidden">
    <div className="flex items-center gap-10 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
      {[...PROMO_ITEMS, ...PROMO_ITEMS].map((item, i) => (
        <span
          key={i}
          className="text-[11px] tracking-[0.18em] text-[#C6A46C] shrink-0"
        >
          {item}
        </span>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   TrustBar — 4-column trust badges
   ───────────────────────────────────────────── */
interface TrustItem {
  icon: React.ElementType;
  label: string;
  sub: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: Truck,    label: "Free Delivery",    sub: "On orders above ₹999" },
  { icon: RefreshCw, label: "Easy Exchange",   sub: "Hassle-free exchange" },
  { icon: Shield,   label: "Secure Payment",  sub: "100% safe checkout" },
  { icon: Star,     label: "Premium Quality", sub: "Handcrafted with care" },
];

export const TrustBar = () => (
  <section className="border-y border-[#E8DDD0] bg-[#FDFAF7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#F5EFE7] border border-[#E8DDD0] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#C6A46C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 tracking-wide">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FeatureBanners — two-column editorial banners
   ───────────────────────────────────────────── */
interface BannerCardProps {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  dark?: boolean;
}

const BannerCard = ({ eyebrow, title, cta, href, dark = false }: BannerCardProps) => (
  <Link
    to={href}
    className={`relative group h-64 md:h-72 overflow-hidden rounded-sm flex items-center ${
      dark
        ? "bg-gradient-to-br from-[#2A1F14] via-[#3D2B1F] to-[#1a1208]"
        : "bg-gradient-to-br from-[#F5EFE7] via-[#EDE0D0] to-[#E8D8C4]"
    }`}
  >
    {/* Decorative glow */}
    <div
      className={`absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_${
        dark ? "80%" : "20%"
      }_50%,rgba(198,164,108,0.2)_0%,transparent_70%)]`}
    />

    {/* Decorative arch */}
    <div
      className={`absolute ${dark ? "right-6" : "left-6"} bottom-0 w-40 h-[90%] rounded-t-full border ${
        dark ? "border-[#C6A46C]/12" : "border-[#C6A46C]/18"
      } transition-transform duration-500 group-hover:scale-105`}
    />
    <div
      className={`absolute ${dark ? "right-14" : "left-14"} bottom-0 w-24 h-[70%] rounded-t-full ${
        dark ? "bg-[#C6A46C]/06" : "bg-[#C6A46C]/08"
      } transition-transform duration-500 group-hover:scale-110`}
    />

    {/* Text */}
    <div
      className={`relative z-10 px-8 md:px-10 ${dark ? "ml-auto pr-12 text-right" : ""}`}
    >
      <p
        className={`text-[10px] tracking-[0.3em] uppercase font-medium mb-2 ${
          dark ? "text-[#C6A46C]" : "text-[#C6A46C]"
        }`}
      >
        {eyebrow}
      </p>
      <h3
        className={`text-3xl md:text-4xl font-bold font-serif leading-tight mb-5 ${
          dark ? "text-white" : "text-[#2A1810]"
        }`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <span
        className={`inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium transition-gap duration-200 group-hover:gap-3 ${
          dark ? "text-[#C6A46C]" : "text-[#2A1810]"
        }`}
      >
        {cta}
        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
      </span>
    </div>
  </Link>
);

export const FeatureBanners = () => (
  <section className="py-12 bg-white">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BannerCard
          eyebrow="New Season"
          title="Summer Kurta<br/>Collection"
          cta="Shop Now"
          href="/shop?category=kurtas"
          dark={false}
        />
        <BannerCard
          eyebrow="Exclusive"
          title="Designer<br/>Sarees"
          cta="Explore"
          href="/shop?category=sarees"
          dark={true}
        />
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   ThreeBanners — three-column mini banners
   ───────────────────────────────────────────── */
interface MiniBannerItem {
  label: string;
  sub: string;
  href: string;
  gradient: string;
  textColor: string;
}

const MINI_BANNERS: MiniBannerItem[] = [
  {
    label: "Lehengas",
    sub: "Bridal & Festive",
    href: "/shop?category=lehengas",
    gradient: "from-[#F0E6DA] to-[#E8DDD0]",
    textColor: "text-[#3D2B1F]",
  },
  {
    label: "Dupattas",
    sub: "Handwoven Luxury",
    href: "/shop?category=dupattas",
    gradient: "from-[#2A1F14] to-[#3D2B1F]",
    textColor: "text-white",
  },
  {
    label: "Sale",
    sub: "Up to 50% Off",
    href: "/sale",
    gradient: "from-[#C6A46C] to-[#B8936A]",
    textColor: "text-white",
  },
];

export const ThreeBanners = () => (
  <section className="py-12 bg-[#FDFAF7]">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MINI_BANNERS.map(({ label, sub, href, gradient, textColor }) => (
          <Link
            key={label}
            to={href}
            className={`group relative h-36 bg-gradient-to-br ${gradient} rounded-sm overflow-hidden flex items-end p-5 hover:shadow-[0_6px_24px_rgba(198,164,108,0.2)] transition-all duration-300`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_90%_10%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
            <div className="relative z-10">
              <p className={`text-[10px] tracking-[0.2em] uppercase ${textColor} opacity-60 mb-1`}>
                {sub}
              </p>
              <h4 className={`text-xl font-bold font-serif ${textColor} leading-tight`}>
                {label}
              </h4>
            </div>
            <ArrowRight
              size={16}
              className={`absolute right-5 bottom-5 ${textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
            />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   DiscountBanner — full-width promo bar
   ───────────────────────────────────────────── */
export const DiscountBanner = () => (
  <section className="py-12 bg-white">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
      <div className="relative bg-gradient-to-r from-[#C6A46C] via-[#BFA060] to-[#B8936A] rounded-sm overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(45deg,white_0px,white_1px,transparent_1px,transparent_14px)]" />

        {/* Decorative large text */}
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] font-black text-white/[0.07] font-serif leading-none select-none hidden lg:block">
          SALE
        </span>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-10 gap-8">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/60 mb-1">
              Limited Time Offer
            </p>
            <h3 className="text-4xl sm:text-5xl font-bold text-white font-serif tracking-wide">
              FLAT 20% OFF
            </h3>
            <p className="text-white/75 text-sm mt-2 tracking-wide">
              On all ethnic wear · Use code:{" "}
              <span className="font-semibold text-white bg-white/15 px-2 py-0.5 rounded">
                SHADES20
              </span>
            </p>
          </div>

          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-2.5 px-10 py-3.5 bg-white text-[#C6A46C] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#F5EFE7] transition-all duration-200 rounded-sm group shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            Shop Now
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  </section>
);