export interface IReviewUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface IReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IReviewUser;
}

export interface IReviewsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  averageRating: number;
  totalReviews: number;
}

export interface IReviewsResponse {
  data: IReview[];
  meta: IReviewsMeta;
}

export interface ICreateReview {
  rating: number;
  comment?: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}
