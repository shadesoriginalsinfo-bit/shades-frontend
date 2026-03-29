import type { IRegisterUser, IUserProfile } from "@/types/user";
import type { ICategory, ICreateCategory, IUpdateCategory } from "@/types/category";
import type { ICreateProduct, IProduct, IProductQuery, IProductsResponse, IUpdateProduct } from "@/types/product";
import axios from "./axios";


// ── Auth ────────────────────────────────────────────────────────────────

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


// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(params?: { search?: string; flat?: boolean }): Promise<ICategory[]> {
  const { data } = await axios.get("/categories", { params });
  return data.data;
}

export async function createCategory(payload: ICreateCategory): Promise<ICategory> {
  const { data } = await axios.post("/categories", payload);
  return data.data;
}

export async function updateCategory(id: string, payload: IUpdateCategory): Promise<ICategory> {
  const { data } = await axios.patch(`/categories/${id}`, payload);
  return data.data;
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const { data } = await axios.delete(`/categories/${id}`);
  return data;
}


// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(params?: IProductQuery): Promise<IProductsResponse> {
  const { data } = await axios.get("/products", { params });
  return data;
}

export async function getProductById(id: string): Promise<IProduct> {
  const { data } = await axios.get(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: ICreateProduct): Promise<IProduct> {
  const { data } = await axios.post("/products", payload);
  return data.data;
}

export async function updateProduct(id: string, payload: IUpdateProduct): Promise<IProduct> {
  const { data } = await axios.patch(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const { data } = await axios.delete(`/products/${id}`);
  return data;
}

export async function addProductImage(
  productId: string,
  payload: { url: string; altText?: string; position?: number },
) {
  const { data } = await axios.post(`/products/${productId}/images`, payload);
  return data.data;
}

export async function removeProductImage(productId: string, imageId: string) {
  const { data } = await axios.delete(`/products/${productId}/images/${imageId}`);
  return data;
}

export async function updateProductStock(productId: string, stock: number) {
  const { data } = await axios.patch(`/products/${productId}/stock`, { stock });
  return data.data;
}