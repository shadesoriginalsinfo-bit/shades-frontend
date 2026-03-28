import type { IRegisterUser, IUserProfile } from "@/types/user";
import axios from "./axios";



export async function login(payload: { mobileNumber: string; password: string }) {
  const { data } = await axios.post(`/auth/login`, payload);
  return data.data;
}


export async function logout() {
  const { data } = await axios.post(`/auth/logout`);
  return data;
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await axios.post(`/auth/forgot-password`, payload);
  return data;
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}) {
  const { data } = await axios.post(`/auth/reset-password`, payload);
  return data;
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  const { data } = await axios.patch(`/auth/change-password`, payload);
  return data;
}

export async function deleteMyAccount() {
  const { data } = await axios.delete(`/users/me`);
  return data;
}

export async function getMyProfile(): Promise<IUserProfile> {
  const { data } = await axios.get(`/auth/me`);
  return data.data;
}

export async function RegisterUser(payload: IRegisterUser) {
  const { data } = await axios.post(`/auth/signup`, payload);
  return data;
}