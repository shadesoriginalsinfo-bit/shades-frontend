export interface IProductImage {
  id: string;
  url: string;
  altText?: string | null;
  position: number;
  createdAt: string;
}

export interface IProductVariantSize {
  id: string;
  size: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductVariant {
  id: string;
  color: string;
  colorCode?: string | null;
  createdAt: string;
  updatedAt: string;
  images: IProductImage[];
  sizes: IProductVariantSize[];
}

export interface IProduct {
  id: string;
  title: string;
  marketPrice: number;
  discountPrice?: number | null;
  gstPercent: number;
  careInstruction?: string;
  description?: string | null;
  shortDesc?: string | null;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  variants: IProductVariant[];
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

export interface ICreateProductVariantSize {
  size: string;
  stock: number;
}

export interface ICreateProductVariant {
  color: string;
  colorCode?: string;
  sizes: ICreateProductVariantSize[];
}

export interface ICreateProduct {
  title: string;
  marketPrice: number;
  discountPrice?: number;
  description?: string;
  shortDesc?: string;
  isPublished?: boolean;
  categoryIds?: string[];
  gstPercent: number;
  careInstruction?: string;
  variants?: ICreateProductVariant[];
}

export interface IUpdateProduct {
  title?: string;
  marketPrice?: number;
  discountPrice?: number;
  description?: string;
  shortDesc?: string;
  isPublished?: boolean;
  categoryIds?: string[];
  gstPercent?: number;
  careInstruction?: string;
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
