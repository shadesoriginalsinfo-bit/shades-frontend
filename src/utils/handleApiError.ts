import { toast } from "react-hot-toast";

interface ApiErrorResponse {
  message?: string;
  errors?: string[] | { message?: string }[];
}

export function handleApiError(err: any) {
  const errorData: ApiErrorResponse = err?.response?.data;

  if (Array.isArray(errorData?.errors) && errorData.errors.length) {
    
    errorData.errors.forEach((e) => {
      if (typeof e === "string") {
        console.log(e)
        toast.error(e);
      } else if (typeof e === "object" && e?.message) {
        toast.error(e.message);
        console.log(e.message)
      }
    });
  } else if (errorData?.message) {
    toast.error(errorData.message);
    console.log(errorData.message)
  } else {
    toast.error("Something went wrong");
    console.log("Something went wrong")
  }
}
