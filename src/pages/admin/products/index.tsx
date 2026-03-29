import { useState } from "react";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import { Tabs, type TabItem } from "@/components/Tabs";

type TabKey = "products" | "categories";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("products");

    const tabs: TabItem<TabKey>[] = [
    { key: "products", label: "PRODUCTS" },
    { key: "categories", label: "CATEGORIES" },
  ];

  return (
    <div className="space-y-4 p-1 md:p-4">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-gray-800 font-serif">
          Products & Categories
        </h1>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "products" ? <ProductsTab /> : <CategoriesTab />}
      
    </div>
  );
};

export default ProductsPage;
