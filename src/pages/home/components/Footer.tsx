import { GoldDivider } from "@/components/comps";
import { Phone, Mail, ClockAlert, MessageCircle } from "lucide-react";
import { type ICategory } from "@/types/category";
import { useCategories } from "@/hooks/useCategories";

const base = window.location.origin;

const HELP_LINKS = [
  { label: "Shipping Policy", href: `${base}/help#shipping` },
  { label: "Return Policy", href: `${base}/help#exchange` },
  { label: "Track My Order", href: `${base}/help#track` },
  { label: "Terms of Service", href: `${base}/help#terms` },
  { label: "Privacy Policy", href: `${base}/help#privacy` },
  { label: "Cancellation", href: `${base}/help#cancellation` },
];

// const SOCIAL_LINKS = [
//   { Icon: Instagram, href: "#", label: "Instagram" },
//   { Icon: Facebook, href: "#", label: "Facebook" },
//   { Icon: Twitter, href: "#", label: "Twitter / X" },
//   { Icon: Youtube, href: "#", label: "YouTube" },
// ];

const Footer = () => {
  const { categories } = useCategories();

  const FOOTER_LINKS = [
    {
      heading: "Shop",
      links: categories.slice(0, 4).map((cat: ICategory) => ({
        label: cat.name,
        href: `/shop?category=${cat.slug}`,
      })),
    },
    {
      heading: "Help",
      links: HELP_LINKS,
    },
  ];

  return (
    <footer className="bg-[#100C07] text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16 pt-14 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.07]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-3xl font-bold font-serif text-[#C6A46C] tracking-widest mb-4">
              SHADES
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed tracking-wide max-w-xs">
              Crafting timeless ethnic wear that celebrates your unique
              identity. Each piece tells a story of tradition, elegance, and
              artisanship.
            </p>

            {/* Social icons */}
            {/* <div className="flex items-center gap-2.5 mt-6">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-all duration-200"
              >
                <Icon size={13} />
              </a>
            ))}
          </div> */}

            <GoldDivider />

            {/* Contact info */}
            <div className="mt-7 space-y-2.5">
              {[
                // { Icon: MapPin, text: "123 Fashion Street, Mumbai, MH 400001", href: undefined },
                {
                  Icon: Phone,
                  text: "+91 9972829912",
                  href: "tel:+919972829912",
                },
                {
                  Icon: MessageCircle,
                  text: "+91 8548995696",
                  href: "https://wa.me/918548995696",
                },
                {
                  Icon: Mail,
                  text: "shadesoriginals.info@gmail.com",
                  href: "mailto:shadesoriginals.info@gmail.com",
                },
                {
                  Icon: ClockAlert,
                  text: "Support Hours: 10 AM - 6.30 PM",
                  href: undefined,
                },
              ].map(({ Icon, text, href }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={13} className="text-[#C6A46C] mt-0.5 shrink-0" />
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-xs text-gray-300 tracking-wide hover:text-[#C6A46C] transition-colors"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-300 tracking-wide">
                      {text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C] font-semibold mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-xs text-gray-300 hover:text-[#C6A46C] transition-colors duration-200 tracking-wide"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300 tracking-wider text-center sm:text-left">
            © {new Date().getFullYear()} Shades Ethnic Wear. All rights
            reserved.
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C]">
            Secure &nbsp;·&nbsp; Trusted &nbsp;·&nbsp; Exclusive
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
