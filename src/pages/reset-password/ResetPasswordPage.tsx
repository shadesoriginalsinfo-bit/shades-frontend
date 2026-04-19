import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { PASSWORD_REGEX } from "@/utils/validation";
import { PasswordInput } from "@/components/PasswordInput";
import toast from "react-hot-toast";
import img from "@/assets/forgotPasswordImg.svg";
import logo from "@/assets/logo2.png";
import { handleApiError } from "@/utils/handleApiError";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      resetPassword(data),
    onSuccess: () => {
      toast.success("Password Reset Successfull.");
      navigate("/login");
    },
    onError: (err: any) => {
      handleApiError(err);
      console.log(err);
      const message =
        err?.response?.data?.message || "Failed to reset password";
      setClientError(message);
    },
  });

  const validate = (): boolean => {
    setClientError(null);

    if (!token) {
      setClientError("Invalid or missing token.");
      return false;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setClientError("Please fill both password fields.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setClientError("New and Confirm Password mismatch.");
      return false;
    }

    if (newPassword.length < 8) {
      setClientError("Password must be at least 8 characters.");
      return false;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setClientError(
        "Password must contain uppercase, lowercase, number and atleast one @ _ ! # $ % * & character",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutation.mutate({
      token: token as string,
      newPassword: newPassword.trim(),
    });
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col md:flex-row">
      {/* Left illustration (hidden on small screens) */}
      <div className="hidden md:flex md:w-[45%] bg-[#EAF4FF] items-center justify-center p-8">
        {/* keep illustration or replace */}
        <img
          src={img}
          alt="Reset Password Illustration"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right form */}
      <div className="w-full h-full md:w-[55%] p-4 sm:px-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-[#1B77BB] cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <img src={logo} alt="BpXchange" className="h-10" />
        </div>

        <div className="flex max-h-[65%] md:h-full flex-col justify-center flex-1">
          <h1 className="text-3xl font-bold text-center text-[#37474F] mb-6">
            Reset Password
          </h1>
          {clientError ? (
            <div className="text-sm text-red-600 text-center">
              {clientError}
            </div>
          ) : null}

          {!token ? (
            <div className="text-center text-red-600">
              Invalid or missing token. Please use the link from your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 lg:px-20">
              <div>
                <PasswordInput
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={mutation.isPending}
                  required
                />

                <p className="text-xs text-gray-500 mt-1">
                  Password must contain uppercase, lowercase, number and atleast
                  one @ _ ! # $ % * & character
                </p>
              </div>

              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={mutation.isPending}
                required
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
