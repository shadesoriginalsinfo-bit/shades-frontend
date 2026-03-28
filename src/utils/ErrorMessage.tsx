import { AlertTriangle } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  error?: unknown;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  let message: string = "Something went wrong.";

  if (typeof error === "string") {
    message = error;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data?.message === "string"
  ) {
    message = (error as any).response.data.message;
  }
  else if(error instanceof Error){
    message = error.message;
  }

  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center">
      <div className="flex w-[95%] max-w-md items-center gap-3 rounded-lg border border-red-300 bg-white p-6 text-red-700 shadow-lg">
        <AlertTriangle className="h-8 w-8 shrink-0 text-red-600" />
        <p className="text-lg font-semibold leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
