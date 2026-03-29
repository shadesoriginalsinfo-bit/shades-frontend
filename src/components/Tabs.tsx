import clsx from "clsx";

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={clsx("flex gap-2 border-b", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors border-b-2 -mb-px ${
              isActive
                ? "border-[#C6A46C] text-[#C6A46C] font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
