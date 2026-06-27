export interface ICoupon {
  code: string;
  description?: string | null;
  discountAmount: number;
  thresholdAmount: number;
  maxUsageCount?: number | null;
  usedCount: number;
  startDate?: string | null;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCoupon extends ICoupon {
  isDeleted: boolean;
}

export interface ICreateCoupon {
  code: string;
  description?: string;
  discountAmount: number;
  thresholdAmount: number;
  maxUsageCount?: number;
  startDate?: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface IUpdateCoupon {
  description?: string;
  maxUsageCount?: number;
  startDate?: string | null;
  expiryDate?: string | null;
  isActive?: boolean;
}

export interface IAppliedCoupon {
  code: string;
  description?: string | null;
  discountAmount: number;
  thresholdAmount: number;
}
