import { ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/transparentLogo.png";
import { useAuthUser } from "@/hooks/useAuth";
import dummyAvatar from "@/assets/profile.webp"

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "Kurtas", href: "/shop?cat=kurtas" },
      { label: "Sarees", href: "/shop?cat=sarees" },
      { label: "Lehengas", href: "/shop?cat=lehengas" },
      { label: "Dupattas", href: "/shop?cat=dupattas" },
    ],
  },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

const NavLink = ({ item, isActive }: NavLinkProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={item.href}
        className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
          isActive
            ? "text-[#C6A46C]"
            : "text-gray-700 hover:text-[#C6A46C]"
        }`}
      >
        {item.label}
        {item.children && (
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {/* Active underline */}
      {isActive && (
        <span className="absolute left-0 right-0 h-0.5 bg-[#C6A46C]" />
      )}

      {/* Dropdown */}
      {item.children && open && (
        <div className="absolute top-full left-0 mt-5 w-48 bg-white border border-[#E8DDD0] shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block px-5 py-3 text-xs tracking-wider text-gray-600 hover:text-[#C6A46C] hover:bg-[#F5EFE7] transition-colors border-b border-[#E8DDD0]/50 last:border-0"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const {data: user, isLoading} = useAuthUser()

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  
  // const cartCount = 2;
  const avatar = user?.avatar ? user.avatar : dummyAvatar;

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8DDD0] shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="Shades" className="h-12 object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 h-full">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  isActive={location.pathname === item.href}
                />
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search */}

              {location.pathname !== "/shop" && <div className="flex items-center gap-1 border border-[#c4b9a5] rounded-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className="hidden md:block w-48 bg-white/5 px-4 py-2.5 text-xs text-gray-500 placeholder:text-gray-400 outline-none rounded-sm tracking-wide focus:none"
                />
                <button
                  onClick={() => navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)}
                  className="hidden md:flex w-9 h-9 items-center justify-center text-gray-500 hover:text-[#C6A46C] transition-colors hover:bg-[#F5EFE7] rounded-md cursor-pointer"
                >
                  <Search size={17} />
                </button>
              </div>}

              {!isLoading && user ? (
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-1.5 text-xs tracking-wider text-gray-600 hover:text-[#c4b9a5] transition-colors border-2 border-[#C6A46C]  w-8 h-8 rounded-full"
                >
                  <img src={avatar} alt={user.name} className="w-full object-cover rounded-full" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 text-xs tracking-wider text-gray-600 hover:text-[#C6A46C] transition-colors border border-[#E8DDD0] hover:border-[#C6A46C] rounded-sm px-3 py-2"
                >
                  <User size={14} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Cart */}
              {/* <Link
                to="/cart"
                className="relative flex items-center gap-2 bg-[#1a1a1a] text-white text-xs px-4 py-2.5 hover:bg-[#C6A46C] transition-all duration-200 tracking-wider rounded-sm"
              >
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">Basket</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C6A46C] text-white text-[9px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link> */}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-[#C6A46C] transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#E8DDD0] px-4 py-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`block py-3 text-sm font-medium tracking-wide border-b border-[#E8DDD0]/50 last:border-0 ${
                  location.pathname === item.href
                    ? "text-[#C6A46C]"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 flex items-center gap-3">
              {!isLoading && user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs tracking-wider text-gray-600 hover:text-[#c4b9a5] transition-colors border-2 border-[#C6A46C]  w-8 h-8 rounded-full"
                >
                  <img src={avatar} alt={user.name} className="w-full object-cover rounded-full" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs tracking-wider text-gray-600 hover:text-[#C6A46C] transition-colors border border-[#E8DDD0] hover:border-[#C6A46C] rounded-sm px-3 py-2"
                >
                  <User size={14} />
                  <span>Sign In</span>
                </Link>
              )}
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-[#1a1a1a] text-white text-xs tracking-wider px-4 py-2.5 rounded-sm"
              >
                <ShoppingBag size={14} /> Cart
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;