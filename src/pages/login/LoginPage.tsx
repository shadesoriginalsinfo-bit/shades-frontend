import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/transparentLogo.png";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";
import toast from "react-hot-toast";
import { CornerOrnament, GoldDivider, GoldPattern } from "@/components/comps";
import { INDIAN_MOBILE_REGEX } from "@/utils/validation";
import { Role } from "@/types/enum";

interface ILoginForm {
  mobileNumber: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ILoginForm>({ mobileNumber: "", password: "" });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const LoginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Login Successful");
      if(data.role === Role.ADMIN){
        navigate("/admin/dashboard");
        return;
      }
      navigate("/");
    },
    onError: async (error: any) => {
      handleApiError(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!INDIAN_MOBILE_REGEX.test(form.mobileNumber)){
      return toast.error("Please Enter valid 10 Digit Mobile Number.")
    }
    LoginMutation.mutate({ mobileNumber: form.mobileNumber, password: form.password });
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center relative overflow-hidden">

      {/* Dot + grid pattern */}
      <GoldPattern />

      {/* Radial warm glow — Tailwind arbitrary background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(212,175,122,0.07)_0%,transparent_70%)]" />

      {/* ── Card wrapper ──────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md mx-6 animate-[fadeUp_0.6s_ease_both]">

        {/* Corner ornaments — transforms via Tailwind scale utilities */}
        <CornerOrnament className="absolute -top-3 -left-3 w-14 h-14 z-20" />
        <CornerOrnament className="absolute -top-3 -right-3 w-14 h-14 z-20 scale-x-[-1]" />
        <CornerOrnament className="absolute -bottom-3 -left-3 w-14 h-14 z-20 scale-y-[-1]" />
        <CornerOrnament className="absolute -bottom-3 -right-3 w-14 h-14 z-20 scale-x-[-1] scale-y-[-1]" />

        {/* Main card */}
        <div className="bg-white md:border border-[#E8DDD0] px-0 md:px-10 py-2 md:py-6 md:shadow-[0_8px_60px_rgba(198,164,108,0.12),0_2px_12px_rgba(0,0,0,0.04)]">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-24 object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center mb-1">
            {/* font-serif resolves to Georgia in Tailwind's default stack */}
            <h1 className="text-3xl text-gray-800 font-light tracking-tight font-serif">
              Welcome Back
            </h1>
          </div>

          <GoldDivider />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* mobileNumber */}
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.25em] uppercase text-[#C6A46C] font-medium">
                Mobile Number
              </label>
              <Input
                name="mobileNumber"
                type="number"
                placeholder="you@example.com"
                value={form.mobileNumber}
                onChange={handleOnChange}
                disabled={LoginMutation.isPending}
                required
                restrictSpecialChars={false}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.25em] uppercase text-[#C6A46C] font-medium">
                Password
              </label>
              <PasswordInput
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleOnChange}
                disabled={LoginMutation.isPending}
                required
              />
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-5">
              <Link
                to="/forgot-password"
                className="text-[11px] tracking-wider text-[#B8936A] hover:text-[#C6A46C] transition-colors underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={LoginMutation.isPending}
              className="w-full"
            >
              {LoginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-30"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-80"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Logging in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-3 tracking-wide">
            New here?{" "}
            <Link
              to="/signup"
              className="text-[#C6A46C] font-semibold hover:text-[#B8936A] transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-[#C6A46C]/50 md:mt-5">
          Secure &nbsp;·&nbsp; Trusted &nbsp;·&nbsp; Exclusive
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;