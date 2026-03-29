export interface IProductImage {
  id: string;
  url: string;
  altText?: string | null;
  position: number;
  createdAt: string;
}

export interface IProduct {
  id: string;
  title: string;
  marketPrice: number;
  discountPrice?: number | null;
  stock: number;
  description?: string | null;
  shortDesc?: string | null;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  images: IProductImage[];
  productCategories: { category: { id: string; name: string; slug: string } }[];
}

export interface IProductQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface ICreateProduct {
  title: string;
  marketPrice: number;
  discountPrice?: number;
  description?: string;
  shortDesc?: string;
  isPublished?: boolean;
  stock: number;
  categoryIds?: string[];
}

export interface IUpdateProduct {
  title?: string;
  marketPrice?: number;
  discountPrice?: number;
  description?: string;
  shortDesc?: string;
  isPublished?: boolean;
  categoryIds?: string[];
}

export interface IProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IProductsResponse {
  data: IProduct[];
  meta: IProductMeta;
}
