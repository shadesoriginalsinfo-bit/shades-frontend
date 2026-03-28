import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Users,
  LucideLayoutDashboard,
  Settings,
  LogOut,
  ChartColumn,
} from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import LoadingModal from "@/pages/LoadingPage";
export interface SidebarItem {
  label: string;
  icon: React.ReactElement;
  key: string;
  path: string;
}


export const navLinks: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <LucideLayoutDashboard />,
    key: "dashboard",
    path: "/admin/dashboard",
  },
  // {
  //   label: "Category",
  //   icon: <FileText />,
  //   key: "category",
  //   path: "/admin/category",
  // },
  {
    label: "Orders",
    icon: <ChartColumn />,
    key: "orders",
    path: "/admin/orders",
  },
  {
    label: "Products",
    icon: <ChartColumn />,
    key: "products",
    path: "/admin/products",
  },
  {
    label: "User List",
    icon: <Users />,
    key: "users",
    path: "/admin/users",
  },
];

const Sidebar: React.FC = () => {

  const { logout, logoutLoading } = useLogout();

  if (logoutLoading) return <LoadingModal />;

  return (
    <nav className="w-56 border-r border-gray-200 bg-white px-3 py-6 hidden md:block fixed left-0 top-16 min-h-[90vh] mt-2 z-50">
      <ul className="flex flex-col space-y-2">
        {navLinks.map(({ label, icon, key, path }) => (
          <li key={key}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-150",
                  isActive
                    ? "bg-gray-100 text-[#C6A46C] font-bold"
                    : "text-[#496c87] hover:bg-gray-100 font-medium"
                )
              }
            >
              {/* <img src={icon} alt="Icon" className="h-5" /> */}
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-8 w-full">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            clsx(
              "w-[89%] flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-150",
              isActive
                ? "bg-gray-100 text-[#C6A46C] font-bold"
                : "text-[#496c87] hover:bg-gray-100 font-medium"
            )
          }
        >
          <Settings />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-150 text-[#C6A46C] font-semibold hover:font-bold cursor-pointer"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
