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
            className={clsx(
              "px-4 py-2 font-medium border-b-2 cursor-pointer transition",
              isActive
                ? "border-[#1B77BB] text-[#1B77BB]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
