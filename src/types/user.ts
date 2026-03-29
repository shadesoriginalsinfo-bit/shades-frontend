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