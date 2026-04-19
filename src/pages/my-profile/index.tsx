import { useState } from "react";
import { User, MapPin, ShoppingBag, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/pages/home/components/Footer";
import Header from "../home/components/Header";
import ProfileTab from "./components/ProfileTab";
import AddressesTab from "./components/AddressTab";
import OrdersTab from "./components/OrdersTab";
import SecurityTab from "./components/SecurityTab";

type Tab = "profile" | "addresses" | "orders" | "security";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User size={15} /> },
  { key: "addresses", label: "Addresses", icon: <MapPin size={15} /> },
  { key: "orders", label: "Orders", icon: <ShoppingBag size={15} /> },
  { key: "security", label: "Security", icon: <Shield size={15} /> },
];

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 min-h-[650px]">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#9A7A46] transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
              My Profile
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1810] tracking-tight">
            My Profile
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-px w-10 bg-[#9A7A46]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
            <div className="h-px w-6 bg-[#9A7A46]/50" />
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 border-b border-[#E8DDD0] mb-7 overflow-x-auto">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === key
                  ? "border-[#9A7A46] text-[#9A7A46]"
                  : "border-transparent text-gray-500 hover:text-[#9A7A46]"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "security" && <SecurityTab />}
      </main>

      <Footer />
    </div>
  );
};

export default MyProfile;
