import { Select } from "antd";
import { X } from "lucide-react";

type StatusFilterProps<T extends string> = {
  allLabel?: string;
  statuses: T[];
  value: (T | "ALL")[];
  onChange: (val: (T | "ALL")[]) => void;
  forceMobileDropdown?: boolean;
};

const StatusFilter = <T extends string>({
  allLabel = "ALL",
  statuses,
  value,
  onChange,
  forceMobileDropdown = false,
}: StatusFilterProps<T>) => {
  const toggleStatusChip = (s: T | "ALL") => {
    if (s === "ALL") {
      onChange(["ALL"]);
      return;
    }

    if (value.includes("ALL")) {
      onChange([s]);
      return;
    }

    if (value.includes(s)) {
      const next = value.filter((x) => x !== s);
      onChange(next.length ? next : ["ALL"]);
    } else {
      onChange([...value, s]);
    }
  };

  const handleMobileSelectChange = (vals: string[]) => {
    if (!vals || vals.length === 0) {
      onChange(["ALL"]);
      return;
    }

    if (vals.length > 1 && vals.includes("ALL")) {
      onChange(vals.filter((v) => v !== "ALL") as T[]);
      return;
    }

    onChange(vals as (T | "ALL")[]);
  };

  return (
    <>
      {/* Desktop chips */}
      <div className={`items-center gap-2 ${
          forceMobileDropdown ? "hidden" : "hidden lg:flex"
        }`}>
        <button
          type="button"
          onClick={() => toggleStatusChip("ALL")}
          className={`px-4 py-1 rounded-full border text-sm transition cursor-pointer ${
            value.includes("ALL")
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-200"
          }`}
        >
          {allLabel}
        </button>

        {statuses.map((s) => {
          const isActive = value.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleStatusChip(s)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition cursor-pointer ${
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {s}
              {isActive && <X className="w-4" />}
            </button>
          );
        })}
      </div>

      {/* Mobile dropdown */}
      <div className={`${forceMobileDropdown ? "block" : "lg:hidden"} w-full md:min-w-48 mb-2`}>
        <Select
          mode="multiple"
          value={value}
          onChange={handleMobileSelectChange}
          placeholder="Status"
          allowClear
          style={{ width: "100%" }}
          options={[
            { value: "ALL", label: allLabel },
            ...statuses.map((s) => ({ value: s, label: s })),
          ]}
          className="h-10"
        />
      </div>
    </>
  );
};

export default StatusFilter;
