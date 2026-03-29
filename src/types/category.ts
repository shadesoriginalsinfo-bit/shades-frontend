export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  children?: ICategory[];
}

export interface ICreateCategory {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface IUpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
}
