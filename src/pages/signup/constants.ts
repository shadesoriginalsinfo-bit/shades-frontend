export interface IRegisterForm {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
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

export const initialFormValue: IRegisterForm = {
  name: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  address: {
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
};
