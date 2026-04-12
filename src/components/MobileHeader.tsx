import { useState } from "react";
import { HomeIcon, LogOut, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import logo from "@/assets/transparentLogo.png";
import LoadingModal from "@/pages/LoadingPage";
import { useLogout } from "@/hooks/useLogout";
import { navLinks } from "./Sidebar";

const MobileHeader = () => {


  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { logout, logoutLoading } = useLogout();

  if (logoutLoading) return <LoadingModal />;

  return (
    <div className="fixed md:hidden w-full bg-white z-50 shadow-md text-base">
      <div className="w-full flex justify-between items-center py-3 px-4">
        <Link to="/">
          <img src={logo} alt="bpXchange" className=" h-11" />
        </Link>

        {/* Hamburger menu - Mobile only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full min-h-screen bg-white shadow-md border-t border-gray-200 z-40">
          <ul className="flex flex-col px-4 pt-2">
            {navLinks.map(({ label, icon, key, path }) => (
              <NavLink
                key={key}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 p-3 font-medium rounded-md transition-colors duration-150 border-b border-gray-200",
                    isActive
                      ? "bg-gray-100 text-[#1B77BB] font-bold"
                      : "text-[#496c87] hover:bg-gray-100 font-medium"
                  )
                }
              >
                {/* <img src={icon} alt="Icon" className="h-5" /> */}
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </ul>
          <NavLink
            to="/"
            className="flex w-full items-center gap-2 px-7 py-3 font-medium rounded-md transition-colors duration-150 text-gray-800 hover:bg-gray-100 border-b border-gray-200 shadow-sm cursor-pointer"
          >
            <HomeIcon className="mr-2 h-8"/>
            <span>Home</span>
          </NavLink>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-7 py-3 font-medium rounded-md transition-colors duration-150 text-gray-800 hover:bg-gray-100 border-b border-gray-200 shadow-sm cursor-pointer"
          >
            <LogOut className="mr-2 h-8" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
