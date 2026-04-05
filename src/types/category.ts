export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  children?: ICategory[];
}

export interface ICreateCategory {
  name: string;
  slug: string;
  sortOrder: number;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}
