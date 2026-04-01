import type { Role } from "./enum";

export type IUserProfile = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: Role;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUserDetail extends IAdminUser {
  _count: { orders: number; addresses: number };
}

export interface IAdminUserQuery {
  search?: string;
  role?: Role;
  isDeleted?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface IAdminUsersResponse {
  data: IAdminUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface IRegisterUser {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  address: {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
}