import { useDashboard } from "@/hooks/useDashboard";
import {
  Users,
  ShoppingBag,
  Package,
  Tag,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-400",
  SHIPPED: "bg-indigo-400",
  DELIVERED: "bg-emerald-400",
  CANCELLED: "bg-red-400",
};

const STATUS_TEXT: Record<string, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  CONFIRMED: "text-blue-700 bg-blue-50 border-blue-200",
  SHIPPED: "text-indigo-700 bg-indigo-50 border-indigo-200",
  DELIVERED: "text-emerald-700 bg-emerald-50 border-emerald-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_TEXT[status] ?? "text-gray-600 bg-gray-50 border-gray-200";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-medium border ${cls}`}
    >
      {status}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-[#9A7A46]">
      <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
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
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
}

function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-[#E8DDD0] p-5 flex items-start justify-between rounded-sm">
      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#9A7A46] font-semibold">
          {label}
        </p>
        <p className="text-2xl font-semibold text-gray-800 mt-1.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className="text-[#9A7A46]/50 mt-0.5">{icon}</div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { dashboard, isLoading, isError } = useDashboard();

  if (isLoading) return <Spinner />;

  if (isError || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <TrendingUp className="size-10 mb-3 opacity-30" />
        <p className="text-sm">Failed to load dashboard</p>
      </div>
    );
  }

  const { stats, ordersByStatus, recentOrders, recentUsers } = dashboard;

  const totalOrdersForBar =
    ordersByStatus.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="space-y-6 p-1 md:p-4">
      <h1 className="text-2xl font-light tracking-tight text-gray-800 font-serif">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString("en-IN")}
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString("en-IN")}
          icon={<ShoppingBag className="size-5" />}
        />
        <StatCard
          label="Products"
          value={stats.totalProducts.toLocaleString("en-IN")}
          icon={<Package className="size-5" />}
        />
        <StatCard
          label="Categories"
          value={stats.totalCategories.toLocaleString("en-IN")}
          icon={<Tag className="size-5" />}
        />
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee className="size-5" />}
          sub="All time"
        />
      </div>

      {/* Orders by Status */}
      {ordersByStatus.length > 0 && (
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-sm">
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-semibold mb-4">
            Orders by Status
          </h2>
          {/* Bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-px mb-4">
            {ordersByStatus.map((s) => (
              <div
                key={s.status}
                title={`${s.status}: ${s.count}`}
                className={`${STATUS_COLORS[s.status] ?? "bg-gray-300"} transition-all`}
                style={{ width: `${(s.count / totalOrdersForBar) * 100}%` }}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full inline-block ${STATUS_COLORS[s.status] ?? "bg-gray-300"}`}
                />
                <span className="text-xs text-gray-500">{s.status}</span>
                <span className="text-xs font-medium text-gray-700">
                  {s.count}
                </span>
                <span className="text-[10px] text-gray-400">
                  ({Math.round((s.count / totalOrdersForBar) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
        {/* Recent Orders */}
        <div className="bg-white border border-[#E8DDD0] rounded-sm">
          <div className="px-5 py-4 border-b border-[#E8DDD0]">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-semibold">
              Recent Orders
            </h2>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <ShoppingBag className="size-8 mb-2 opacity-30" />
              <p className="text-xs">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8DDD0]">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FDFAF6] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {order.user.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {order.id.slice(0, 10)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-medium text-gray-800">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-[#E8DDD0] rounded-sm">
          <div className="px-5 py-4 border-b border-[#E8DDD0]">
            <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#9A7A46] font-semibold">
              Recent Users
            </h2>
          </div>
          {recentUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Users className="size-8 mb-2 opacity-30" />
              <p className="text-xs">No users yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8DDD0]">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FDFAF6] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {user.role === "ADMIN" ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-medium bg-[#F8F4EE] text-[#9A7A50] border border-[#9A7A46]/40">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase font-medium bg-gray-50 text-gray-500 border border-gray-200">
                        User
                      </span>
                    )}
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
