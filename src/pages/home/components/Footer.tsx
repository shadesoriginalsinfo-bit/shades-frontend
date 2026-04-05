import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "/new-collection" },
      { label: "Kurtas", href: "/shop?category=kurtas" },
      { label: "Sarees", href: "/shop?category=sarees" },
      { label: "Lehengas", href: "/shop?category=lehengas" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return Policy", href: "/returns" },
      { label: "Track My Order", href: "/track" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter / X" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => (
  <footer className="bg-[#100C07] text-white">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16 pt-14 pb-8">
      {/* Main grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.07]">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-2">
          <h3 className="text-3xl font-bold font-serif text-[#C6A46C] tracking-widest mb-4">
            SHADES
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed tracking-wide max-w-xs">
            Crafting timeless ethnic wear that celebrates your unique identity.
            Each piece tells a story of tradition, elegance, and artisanship.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5 mt-6">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C6A46C] hover:text-[#C6A46C] transition-all duration-200"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>

          {/* Contact info */}
          <div className="mt-7 space-y-2.5">
            {[
              { Icon: MapPin, text: "123 Fashion Street, Mumbai, MH 400001" },
              { Icon: Phone, text: "+91 98765 43210" },
              { Icon: Mail, text: "hello@shades.in" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon size={13} className="text-[#C6A46C] mt-0.5 shrink-0" />
                <span className="text-xs text-gray-500 tracking-wide">{text}</span>
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
                  <Link
                    to={href}
                    className="text-xs text-gray-500 hover:text-[#C6A46C] transition-colors duration-200 tracking-wide"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter bar */}
      {/* <div className="py-8 border-b border-white/[0.07] flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C] mb-1">Newsletter</p>
          <p className="text-xs text-gray-500 tracking-wide">
            Get early access to new arrivals & exclusive offers.
          </p>
        </div>
        <div className="flex items-stretch gap-0 w-full sm:w-auto max-w-xs border border-white/10 rounded-sm overflow-hidden">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none tracking-wide"
          />
          <button className="px-5 py-2.5 bg-[#C6A46C] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#B8936A] transition-colors shrink-0">
            Join
          </button>
        </div>
      </div> */}

      {/* Bottom bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600 tracking-wider text-center sm:text-left">
          © {new Date().getFullYear()} Shades Ethnic Wear. All rights reserved.
        </p>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C]/40">
          Secure &nbsp;·&nbsp; Trusted &nbsp;·&nbsp; Exclusive
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;