import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { IAddress, ICreateAddress } from "@/types/address";

const emptyForm: ICreateAddress = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  isDefault: false,
};

interface Props {
  address?: IAddress | null;
  onClose: () => void;
  onSave: (payload: ICreateAddress, id?: string) => void;
  isSaving: boolean;
}

const AddressFormModal = ({ address, onClose, onSave, isSaving }: Props) => {
  const [form, setForm] = useState<ICreateAddress>(emptyForm);

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label ?? "",
        line1: address.line1,
        line2: address.line2 ?? "",
        city: address.city,
        state: address.state ?? "",
        country: address.country,
        postalCode: address.postalCode,
        isDefault: address.isDefault,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ICreateAddress = {
      ...form,
      label: form.label || undefined,
      line2: form.line2 || undefined,
      state: form.state || undefined,
    };
    onSave(payload, address?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white border border-[#E8DDD0] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium">
              {address ? "Edit" : "New"} Address
            </p>
            <h2 className="font-serif font-bold text-[#2A1810] text-lg leading-tight">
              {address ? "Update Address" : "Add Address"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
              Label{" "}
              <span className="text-gray-400 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Home / Office"
              className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
              Street Address <span className="text-red-400">*</span>
            </label>
            <input
              name="line1"
              value={form.line1}
              onChange={handleChange}
              placeholder="House / Flat / Street"
              required
              className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
              Landmark{" "}
              <span className="text-gray-400 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              name="line2"
              value={form.line2}
              onChange={handleChange}
              placeholder="Near, opposite…"
              className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
                City <span className="text-red-400">*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
                State
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
                Country <span className="text-red-400">*</span>
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-medium block mb-1">
                Postal Code <span className="text-red-400">*</span>
              </label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="PIN Code"
                required
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#9A7A46] transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="accent-[#9A7A46]"
            />
            <span className="text-xs text-gray-600 tracking-wide">
              Set as default address
            </span>
          </label>

          <div className="flex gap-3 pt-2 border-t border-[#E8DDD0]">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9A7A46] transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Saving…
                </>
              ) : address ? (
                "Update"
              ) : (
                "Save Address"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E8DDD0] text-gray-500 text-xs tracking-[0.2em] uppercase font-medium hover:border-gray-400 transition-all rounded-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
