import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Pencil,
  Plus,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/utils/handleApiError";
import {
  adminCreateCoupon,
  adminDeleteCoupon,
  adminGetCoupons,
  adminUpdateCoupon,
} from "@/lib/api";
import type {
  IAdminCoupon,
  ICreateCoupon,
  IUpdateCoupon,
} from "@/types/coupon";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const COUPONS_QUERY_KEY = "admin-coupons";

const formatINR = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── Create / Edit Modal ───────────────────────────────────────────────────────

interface ModalProps {
  coupon?: IAdminCoupon | null;
  onClose: () => void;
  onSave: (data: ICreateCoupon | IUpdateCoupon) => void;
  isPending: boolean;
}

function CouponModal({ coupon, onClose, onSave, isPending }: ModalProps) {
  const isEdit = !!coupon;

  const [code, setCode] = useState(coupon?.code ?? "");
  const [description, setDescription] = useState(coupon?.description ?? "");
  const [discountAmount, setDiscountAmount] = useState(
    coupon ? String(coupon.discountAmount) : "",
  );
  const [thresholdAmount, setThresholdAmount] = useState(
    coupon ? String(coupon.thresholdAmount) : "",
  );
  const [maxUsageCount, setMaxUsageCount] = useState(
    coupon?.maxUsageCount != null ? String(coupon.maxUsageCount) : "",
  );
  const [startDate, setStartDate] = useState(
    coupon?.startDate ? coupon.startDate.slice(0, 10) : "",
  );
  const [expiryDate, setExpiryDate] = useState(
    coupon?.expiryDate ? coupon.expiryDate.slice(0, 10) : "",
  );
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit) {
      if (!code.trim()) return toast.error("Code is required");
      if (!discountAmount || isNaN(Number(discountAmount)))
        return toast.error("Invalid discount amount");
      if (!thresholdAmount || isNaN(Number(thresholdAmount)))
        return toast.error("Invalid threshold amount");
      onSave({
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        discountAmount: Number(discountAmount),
        thresholdAmount: Number(thresholdAmount),
        maxUsageCount: maxUsageCount ? Number(maxUsageCount) : undefined,
        startDate: startDate || undefined,
        expiryDate: expiryDate || undefined,
        isActive,
      } satisfies ICreateCoupon);
    } else {
      onSave({
        description: description.trim() || undefined,
        maxUsageCount: maxUsageCount ? Number(maxUsageCount) : undefined,
        startDate: startDate || null,
        expiryDate: expiryDate || null,
        isActive,
      } satisfies IUpdateCoupon);
    }
  };

  const inputCls =
    "w-full border border-[#E8DDD0] px-3 py-2 text-sm focus:outline-none focus:border-[#9A7A46] rounded-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-lg border border-[#E8DDD0] rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <h2 className="text-sm tracking-[0.15em] uppercase font-medium text-gray-700">
            {isEdit ? "Edit Coupon" : "New Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                Code <span className="text-red-400">*</span>
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE100"
                maxLength={50}
                className={inputCls}
              />
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
              Description{" "}
              <span className="text-gray-400 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. ₹100 off on orders above ₹500"
              maxLength={1000}
              className={inputCls}
            />
          </div>

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                  Discount (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="100"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                  Min Order (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={thresholdAmount}
                  onChange={(e) => setThresholdAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="500"
                  className={inputCls}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                Max Uses
              </label>
              <input
                type="number"
                value={maxUsageCount}
                onChange={(e) => setMaxUsageCount(e.target.value)}
                min="1"
                placeholder="∞"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.12em] uppercase text-gray-500 mb-1.5">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.12em] uppercase text-gray-500">
              Active
            </span>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className="text-[#9A7A46] cursor-pointer"
            >
              {isActive ? (
                <ToggleRight className="size-6" />
              ) : (
                <ToggleLeft className="size-6 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="bg-[#2A1F14] text-white hover:bg-[#3d2d1a]"
            >
              {isPending ? "Saving…" : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [COUPONS_QUERY_KEY],
    queryFn: adminGetCoupons,
  });
  const coupons = data ?? [];

  const [modalCoupon, setModalCoupon] = useState<IAdminCoupon | null | "new">(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<IAdminCoupon | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });

  const createMut = useMutation({
    mutationFn: (dto: ICreateCoupon) => adminCreateCoupon(dto),
    onSuccess: () => {
      toast.success("Coupon created");
      setModalCoupon(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const updateMut = useMutation({
    mutationFn: ({ code, dto }: { code: string; dto: IUpdateCoupon }) =>
      adminUpdateCoupon(code, dto),
    onSuccess: () => {
      toast.success("Coupon updated");
      setModalCoupon(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const deleteMut = useMutation({
    mutationFn: (code: string) => adminDeleteCoupon(code),
    onSuccess: () => {
      toast.success("Coupon deleted");
      setDeleteTarget(null);
      invalidate();
    },
    onError: handleApiError,
  });

  const handleSave = (dto: ICreateCoupon | IUpdateCoupon) => {
    if (modalCoupon === "new") {
      createMut.mutate(dto as ICreateCoupon);
    } else if (modalCoupon) {
      updateMut.mutate({ code: modalCoupon.code, dto: dto as IUpdateCoupon });
    }
  };

  return (
    <div className="space-y-6 p-1 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="size-5 text-[#9A7A46]" />
          <h1 className="text-base tracking-[0.15em] uppercase font-semibold text-gray-800">
            Coupons
          </h1>
        </div>
        <Button
          size="sm"
          className="bg-[#2A1F14] text-white hover:bg-[#3d2d1a] gap-1.5"
          onClick={() => setModalCoupon("new")}
        >
          <Plus className="size-3.5" />
          New Coupon
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-sm text-gray-400 py-10 text-center border border-dashed border-[#E8DDD0]">
          No coupons yet. Click "New Coupon" to create one.
        </div>
      ) : (
        <div className="border border-[#E8DDD0] rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8DDD0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                  Code
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                  Discount
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                  Min Order
                </th>
                <th className="text-center px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium hidden md:table-cell">
                  Usage
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium hidden lg:table-cell">
                  Expiry
                </th>
                <th className="text-center px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DE]">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.code}
                  className={`bg-white hover:bg-[#FDFAF6] transition-colors ${
                    coupon.isDeleted ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-mono font-semibold text-[#2A1810] tracking-wider">
                      {coupon.code}
                    </p>
                    {coupon.description && (
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">
                        {coupon.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-700">
                    {formatINR(coupon.discountAmount)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {formatINR(coupon.thresholdAmount)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 hidden md:table-cell">
                    {coupon.usedCount} /{" "}
                    {coupon.maxUsageCount != null ? coupon.maxUsageCount : "∞"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {formatDate(coupon.expiryDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border ${
                        coupon.isDeleted
                          ? "text-gray-400 bg-gray-50 border-gray-200"
                          : coupon.isActive
                            ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                            : "text-gray-400 bg-gray-50 border-gray-200"
                      }`}
                    >
                      {coupon.isDeleted
                        ? "Deleted"
                        : coupon.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!coupon.isDeleted && (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setModalCoupon(coupon)}
                          className="text-gray-400 hover:text-[#9A7A46] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(coupon)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {modalCoupon !== null && (
        <CouponModal
          coupon={modalCoupon === "new" ? null : modalCoupon}
          onClose={() => setModalCoupon(null)}
          onSave={handleSave}
          isPending={createMut.isPending || updateMut.isPending}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Coupon"
        description={
          deleteTarget
            ? `Coupon "${deleteTarget.code}" will be deactivated and removed.`
            : undefined
        }
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.code)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
