import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import { RegisterUser } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { INDIAN_MOBILE_REGEX, PASSWORD_REGEX } from "@/utils/validation";
import TermsAndConditionsModal from "./components/T&CModal";
import TandC from "./components/TandC";
import { initialFormValue, type IRegisterForm } from "./constants";
import logo from "@/assets/transparentLogo.png";
import LabelField from "@/components/LabelField";
import { CornerOrnament, GoldDivider, GoldPattern } from "@/components/comps";


export default function SignupPage() {
  const [form, setForm] = useState<IRegisterForm>(initialFormValue);
  const [tncOpen, setTncOpen] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: RegisterUser,
    onSuccess: () => {
      setForm(initialFormValue);
      toast.success("Account created successfully");
      navigate(`/`);
    },
    onError: (err: any) => {
      handleApiError(err);
    },
  });

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((p) => ({ ...p, address: { ...p.address, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!INDIAN_MOBILE_REGEX.test(form.mobileNumber.trim())) return toast.error("Invalid mobile number");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!PASSWORD_REGEX.test(form.password)) return toast.error('Password must contain uppercase, lowercase, number and at least one @ _ ! # $ % * special characters');
    if (form.password !== form.confirmPassword) return toast.error("Password & Confirm Password mismatch");

    try {

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        password: form.password.trim(),
        address: {
          label: form.address.label,
          line1: form.address.line1,
          line2: form.address.line2,
          city: form.address.city,
          state: form.address.state,
          country: form.address.country,
          postalCode: form.address.postalCode,
        },
      };
      registerMutation.mutate(payload);
    } catch (err: any) {
      console.error(err);
      handleApiError(err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full min-h-screen bg-white flex items-start justify-center relative overflow-hidden py-4 md:py-10 px-6">

      {/* Background pattern + glow */}
      <GoldPattern />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(212,175,122,0.07)_0%,transparent_70%)]" />

      {/* ── Card wrapper ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-3xl animate-[fadeUp_0.6s_ease_both]">

        {/* Corner ornaments */}
        <CornerOrnament className="absolute -top-3 -left-3 w-14 h-14 z-20" />
        <CornerOrnament className="absolute -top-3 -right-3 w-14 h-14 z-20 scale-x-[-1]" />
        <CornerOrnament className="absolute -bottom-3 -left-3 w-14 h-14 z-20 scale-y-[-1]" />
        <CornerOrnament className="absolute -bottom-3 -right-3 w-14 h-14 z-20 scale-x-[-1] scale-y-[-1]" />

        {/* Main card */}
        <div className="bg-white md:border border-[#E8DDD0] px-0 sm:px-10 py-6 md:py-6 md:shadow-[0_8px_60px_rgba(198,164,108,0.12),0_2px_12px_rgba(0,0,0,0.04)]">

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img src={logo} alt="Logo" className="h-24 object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center mb-1">
            <h1 className="text-3xl text-gray-800 font-light tracking-tight font-serif">
              Create Your Account
            </h1>
          </div>

          <GoldDivider />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

              <LabelField label="Full Name">
                <Input
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="Mobile Number">
                <Input
                  name="mobileNumber"
                  placeholder="+91 00000 00000"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </LabelField>

              <LabelField label="Email Address">
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  restrictSpecialChars={false}
                />
              </LabelField>


              <LabelField label="Password">
                <PasswordInput
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </LabelField>

              <LabelField label="Confirm Password">
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </LabelField>

              <LabelField label="Label (Home / Office)">
                <Input
                  name="address.label"
                  placeholder="Home"
                  value={form.address.label}
                  onChange={handleChange}
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="Address Line 1">
                <Input
                  name="address.line1"
                  placeholder="Street, building, flat no."
                  value={form.address.line1}
                  onChange={handleChange}
                  required
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="Address Line 2">
                <Input
                  name="address.line2"
                  placeholder="Landmark, area (optional)"
                  value={form.address.line2}
                  onChange={handleChange}
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="City">
                <Input
                  name="address.city"
                  placeholder="Mumbai"
                  value={form.address.city}
                  onChange={handleChange}
                  required
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="State">
                <Input
                  name="address.state"
                  placeholder="Maharashtra"
                  value={form.address.state}
                  onChange={handleChange}
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="Country">
                <Input
                  name="address.country"
                  placeholder="India"
                  value={form.address.country}
                  onChange={handleChange}
                  required
                  restrictSpecialChars={false}
                />
              </LabelField>

              <LabelField label="Postal Code">
                <Input
                  name="address.postalCode"
                  placeholder="400001"
                  value={form.address.postalCode}
                  onChange={handleChange}
                  required
                />
              </LabelField>
            </div>

            {/* Terms */}
            <div className="mt-7">
              <TandC onOpenModal={() => setTncOpen(true)} />
            </div>

            <TermsAndConditionsModal open={tncOpen} onOpenChange={setTncOpen} />

            {/* Divider before submit */}
            <GoldDivider />

            {/* Submit */}
            <div className="flex flex-col items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={registerMutation.isPending}
                className="w-full sm:w-96"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-gray-400 tracking-wide">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-[#C6A46C] font-semibold hover:text-[#B8936A] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
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
}