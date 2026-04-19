import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/assets/forgotPasswordImg.svg";
import logo from "@/assets/logo2.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      navigate("/forgot-password/success");
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col md:flex-row">
      {/* ===== LEFT ILLUSTRATION ===== */}
      <div className="hidden md:flex md:w-[45%] bg-[#EAF4FF] items-center justify-center p-8">
        <img
          src={img}
          alt="Forgot Password Illustration"
          className="max-w-full h-auto"
        />
      </div>

      {/* ===== RIGHT FORM ===== */}
      <div className="w-full h-full md:w-[55%] p-4 sm:px-10 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 text-gray-600 hover:text-[#1B77BB] cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <img src={logo} alt="BpXchange" className="h-10" />
        </div>

        {/* Content */}
        <div className="flex max-h-[65%] md:h-full flex-col justify-center flex-1">
          <h1 className="text-3xl font-bold text-center text-[#37474F] mb-8">
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-1 lg:px-20">
            <Input
              name="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={forgotPasswordMutation.isPending}
              required
            />

            {/* Info message */}
            <div className="flex items-start gap-1 mb-10">
              <Info className="flex items-center mt-0.5" size={16} />
              <p className="text-gray-500 text-xs leading-relaxed">
                Please enter the email address you used to register. We will
                send you a link to reset your password.
              </p>
            </div>

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full bg-[#1B77BB] hover:bg-[#155f96]"
            >
              {forgotPasswordMutation.isPending
                ? "Sending link..."
                : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
