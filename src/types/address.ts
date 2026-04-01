export interface IAddress {
  id: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAddress {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}
