import type { IAdminUser } from "./user";

export interface IDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  lostRevenue: number;
}

export interface IDashboardOrderByStatus {
  status: string;
  count: number;
}

export interface IDashboardRecentOrder {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export interface IDashboardData {
  stats: IDashboardStats;
  ordersByStatus: IDashboardOrderByStatus[];
  recentOrders: IDashboardRecentOrder[];
  recentUsers: IAdminUser[];
}
