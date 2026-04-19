import React from "react";
import logo from "@/assets/logo2.png";
import MobileHeader from "./MobileHeader";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <MobileHeader />

      <header className="hidden md:flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 select-none fixed top-0 shadow-sm z-50">
        <div className="flex gap-8">
          <Link to="/">
            <img src={logo} alt="bpXchange" className=" h-12" />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm text-primary">Welcome Back!</span>
            <span className=" text-gray-500 -mt-1 font-medium">
              {user.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Notification bell */}
          {/* <Link
            to="/notifications"
            aria-label="Notification Bell"
            className="relative bg-white p-2 text-gray-800 focus:outline-none cursor-pointer"
            title="Notifications"
          >
            <ShoppingCart size={20} width={32} />
            {cartCount > 0 && (
              <span
                className={`absolute top-0.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 font-semibold text-white ${
                  cartCount > 99 ? "text-[8px]" : "text-xs"
                }`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link> */}
        </div>
      </header>
    </div>
  );
};

export default Header;
