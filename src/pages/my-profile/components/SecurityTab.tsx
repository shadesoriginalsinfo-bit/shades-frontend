import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword, deleteMyAccount } from "@/lib/api";
import { useLogout } from "@/hooks/useLogout";
import { handleApiError } from "@/utils/handleApiError";

const SecurityTab = () => {
  const { logout } = useLogout();

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const changePwMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: handleApiError,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: async () => {
      toast.success("Account deleted");
      await logout();
    },
    onError: handleApiError,
  });

  const handleChangePw = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    changePwMutation.mutate({
      oldPassword: pwForm.oldPassword,
      newPassword: pwForm.newPassword,
    });
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Change Password */}
      <section className="bg-white border border-[#E8DDD0] rounded-sm p-6">
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] font-medium">
            Security
          </p>
          <h3 className="font-serif font-bold text-[#2A1810] text-lg mt-0.5">
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePw} className="space-y-4">
          {/* Old password */}
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium block mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={pwForm.oldPassword}
                onChange={(e) =>
                  setPwForm((p) => ({ ...p, oldPassword: e.target.value }))
                }
                required
                placeholder="Enter current password"
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium block mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                required
                placeholder="Enter new password"
                className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              required
              placeholder="Repeat new password"
              className="w-full border border-[#E8DDD0] rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#C6A46C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={changePwMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changePwMutation.isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </section>

      {/* Delete Account */}
      <section className="bg-white border border-red-200 rounded-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-red-400 font-medium">
              Danger Zone
            </p>
            <h3 className="font-serif font-bold text-[#2A1810] text-lg mt-0.5">
              Delete Account
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium block mb-1">
              Type <span className="font-bold text-red-400">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full border border-red-200 rounded-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>
          <button
            onClick={() => {
              if (deleteConfirm !== "DELETE") {
                toast.error('Type "DELETE" to confirm');
                return;
              }
              deleteAccountMutation.mutate();
            }}
            disabled={
              deleteAccountMutation.isPending || deleteConfirm !== "DELETE"
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-red-700 transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleteAccountMutation.isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Deleting…
              </>
            ) : (
              "Delete My Account"
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SecurityTab;
