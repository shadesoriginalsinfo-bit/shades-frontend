import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  ChevronDown,
  X,
  Trash2,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { handleApiError } from "@/utils/handleApiError";
import {
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
  adminRestoreUser,
} from "@/lib/api";
import { USERS_QUERY_KEY, useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { IAdminUser, IAdminUserDetail } from "@/types/user";
import type { Role } from "@/types/enum";

const LIMIT = 20;

// type RoleFilter = Role | "";
type DeletedFilter = "true" | "false" | "";

// ── Badges ─────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  return role === "ADMIN" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-widest uppercase font-medium bg-[#F8F4EE] text-[#9A7A50] border border-[#9A7A46]/40">
      <ShieldCheck className="size-3" />
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-widest uppercase font-medium bg-gray-50 text-gray-500 border border-gray-200">
      <User className="size-3" />
      User
    </span>
  );
}

function StatusDot({ isDeleted }: { isDeleted: boolean }) {
  return isDeleted ? (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-500">
      <span className="size-1.5 rounded-full bg-red-400 inline-block" />
      Deleted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
      <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
      Active
    </span>
  );
}

// ── Edit Modal ──────────────────────────────────────────────────────────────

interface EditModalProps {
  user: IAdminUser | null;
  onClose: () => void;
  onSave: (id: string, payload: { name?: string; role?: Role }) => void;
  isPending: boolean;
}

function EditModal({ user, onClose, onSave, isPending }: EditModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  // const [role, setRole] = useState<Role>(user?.role ?? "USER");

  if (!user) return null;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const payload: { name?: string; role?: Role } = {};
    if (name.trim() && name.trim() !== user.name) payload.name = name.trim();
    // if (role !== user.role) payload.role = role;
    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }
    onSave(user.id, payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 border border-[#E8DDD0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <h2 className="text-sm tracking-[0.15em] uppercase font-medium text-gray-700">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E8DDD0] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
            />
          </div>
          {/* <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full appearance-none border border-[#E8DDD0] bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            </div>
          </div> */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#E8DDD0]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#9A7A46] hover:bg-[#B8935B] text-white border-0"
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Detail Modal ────────────────────────────────────────────────────────────

interface DetailModalProps {
  userId: string | null;
  onClose: () => void;
  onEdit: (user: IAdminUser) => void;
}

function DetailModal({
  userId,
  onClose,
  // onEdit
}: DetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user-detail", userId],
    queryFn: () => adminGetUser(userId!),
    enabled: !!userId,
  });

  if (!userId) return null;

  const user = data as IAdminUserDetail | undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-4 border border-[#E8DDD0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
          <h2 className="text-sm tracking-[0.15em] uppercase font-medium text-gray-700">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[#9A7A46]">
            <svg
              className="animate-spin size-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="ml-2 text-sm">Loading…</span>
          </div>
        ) : user ? (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-400">{user.mobileNumber}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <RoleBadge role={user.role} />
                <StatusDot isDeleted={user.isDeleted} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8F4EE] p-3 text-center">
                <p className="text-lg font-medium text-gray-800">
                  {user._count.orders}
                </p>
                <p className="text-[10px] tracking-widest uppercase text-[#9A7A46]/70 mt-0.5">
                  Orders
                </p>
              </div>
              <div className="bg-[#F8F4EE] p-3 text-center">
                <p className="text-lg font-medium text-gray-800">
                  {user._count.addresses}
                </p>
                <p className="text-[10px] tracking-widest uppercase text-[#9A7A46]/70 mt-0.5">
                  Addresses
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>
                <span className="font-medium text-gray-500">ID:</span>{" "}
                <span className="font-mono">{user.id}</span>
              </p>
              <p>
                <span className="font-medium text-gray-500">Joined:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {/* <div className="pt-1">
              <Button
                variant="outline"
                onClick={() => { onClose(); onEdit(user); }}
                className="w-full border-[#E8DDD0] text-[#9A7A50] hover:bg-[#F8F4EE] hover:border-[#9A7A46] text-xs"
              >
                <Pencil className="size-3 mr-1.5" />
                Edit User
              </Button>
            </div> */}
          </div>
        ) : (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">
            User not found
          </p>
        )}
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

const UsersPage = () => {
  const queryClient = useQueryClient();

  // Filters
  const [searchInput, setSearchInput] = useState("");
  // const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("");
  const [page, setPage] = useState(1);

  // Modals
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<IAdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<IAdminUser | null>(null);

  const search = useDebounce(searchInput, 400);

  const { users, meta, isLoading } = useUsers({
    search: search.trim() || undefined,
    // role: roleFilter || undefined,
    isDeleted: deletedFilter || undefined,
    page,
    limit: LIMIT,
  });

  const resetFilters = () => {
    setSearchInput("");
    // setRoleFilter("");
    setDeletedFilter("");
    setPage(1);
  };

  const hasActiveFilters = searchInput || deletedFilter;

  // ── Mutations ─────────────────────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; role?: Role };
    }) => adminUpdateUser(id, payload),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-detail"] });
      setEditUser(null);
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      setDeleteUser(null);
    },
    onError: handleApiError,
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => adminRestoreUser(id),
    onSuccess: () => {
      toast.success("User restored");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: handleApiError,
  });

  const handleDelete = (user: IAdminUser) => {
    setDeleteUser(user);
  };

  const handleRestore = (user: IAdminUser) => {
    restoreMutation.mutate(user.id);
  };

  return (
    <div className="space-y-4 p-1 md:p-4">
      <h1 className="text-2xl font-light tracking-tight text-gray-800 font-serif">
        Users
      </h1>

      {/* Filters */}
      <div className="bg-white border border-[#E8DDD0] p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex flex-col gap-1 min-w-56 flex-1">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Search
            </label>
            <input
              type="text"
              placeholder="Name, email, phone or ID…"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="border border-[#E8DDD0] px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#9A7A46]"
            />
          </div>

          {/* Role */}
          {/* <div className="flex flex-col gap-1 min-w-32">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Role
            </label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as RoleFilter);
                  setPage(1);
                }}
                className="w-full appearance-none border border-[#E8DDD0] bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
              >
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            </div>
          </div> */}

          {/* Status */}
          <div className="flex flex-col gap-1 min-w-32">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#9A7A46]/80 font-medium">
              Status
            </label>
            <div className="relative">
              <select
                value={deletedFilter}
                onChange={(e) => {
                  setDeletedFilter(e.target.value as DeletedFilter);
                  setPage(1);
                }}
                className="w-full appearance-none border border-[#E8DDD0] bg-white px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#9A7A46]"
              >
                <option value="">All users</option>
                <option value="false">Active</option>
                <option value="true">Deleted</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="self-end text-gray-500 hover:text-gray-700"
            >
              <X className="size-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DDD0] overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#9A7A46]">
            <svg
              className="animate-spin size-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="ml-2 text-sm">Loading users…</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users className="size-10 mb-3 opacity-30" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8DDD0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#9A7A46]/80 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b border-[#E8DDD0] hover:bg-[#FDFAF6] transition-colors ${
                    user.isDeleted ? "opacity-60" : ""
                  }`}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs font-mono text-gray-400">
                      {user.id.slice(0, 8)}…
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-600 text-xs">{user.email}</p>
                    <p className="text-gray-400 text-xs">{user.mobileNumber}</p>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusDot isDeleted={user.isDeleted} />
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDetailUserId(user.id)}
                        className="border-[#E8DDD0] text-[#9A7A50] hover:bg-[#F8F4EE] hover:border-[#9A7A46] text-xs"
                      >
                        View
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditUser(user)}
                        className="border-[#E8DDD0] text-[#9A7A50] hover:bg-[#F8F4EE] hover:border-[#9A7A46]"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button> */}
                      {user.isDeleted ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(user)}
                          disabled={restoreMutation.isPending}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400"
                          title="Restore"
                        >
                          <RotateCcw className="size-3.5" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user)}
                          disabled={deleteMutation.isPending}
                          className="border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={LIMIT}
          onPageChange={(val) => setPage(val)}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
        onEdit={(user) => setEditUser(user)}
      />

      {/* Edit Modal */}
      <EditModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={(id, payload) => updateMutation.mutate({ id, payload })}
        isPending={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
        loading={deleteMutation.isPending}
        title="Delete User"
        description={`Are you sure to delete "${deleteUser?.name}" from users?`}
      />
    </div>
  );
};

export default UsersPage;
