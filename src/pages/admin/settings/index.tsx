import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAppConfig, adminSetConfig } from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";

const CONFIG_FIELDS = [
  {
    key: "SHIPPING_FLAT",
    label: "Flat Shipping Charge",
    description: "Fixed shipping fee charged when order is below the free threshold (₹)",
    type: "number",
  },
  {
    key: "SHIPPING_FREE_THRESHOLD",
    label: "Free Shipping Threshold",
    description: "Orders above this amount get free shipping (₹)",
    type: "number",
  },
];

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ["app-config"],
    queryFn: getAppConfig,
  });

  useEffect(() => {
    if (config) setValues(config);
  }, [config]);

  const mutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminSetConfig(key, value),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ["app-config"] });
      toast.success(`${key} updated`);
    },
    onError: handleApiError,
    onSettled: () => setSaving(null),
  });

  const handleSave = (key: string) => {
    const value = values[key];
    if (value === undefined || value === "") {
      toast.error("Value cannot be empty");
      return;
    }
    setSaving(key);
    mutation.mutate({ key, value });
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 size={18} className="text-[#9A7A46]" />
          <h1 className="text-xl font-bold text-gray-800">Store Settings</h1>
        </div>
        <p className="text-sm text-gray-500">
          Manage dynamic configuration values for the store.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-12 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading config…</span>
        </div>
      ) : (
        <div className="space-y-4">
          {CONFIG_FIELDS.map(({ key, label, description, type }) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">
                {label}
              </label>
              <p className="text-xs text-gray-400 mb-3">{description}</p>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type={type}
                    min={0}
                    value={values[key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#9A7A46] transition-colors"
                  />
                </div>
                <button
                  onClick={() => handleSave(key)}
                  disabled={saving === key}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#2A1810] text-white text-xs font-medium rounded-lg hover:bg-[#9A7A46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {saving === key ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
