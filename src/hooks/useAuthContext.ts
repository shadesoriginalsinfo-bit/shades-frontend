import { useOutletContext } from "react-router-dom";
import type { IUserProfile } from "@/types/user";

export type AuthContext = {
  user: IUserProfile;
};

export function useAuthContext() {
  const ctx = useOutletContext<AuthContext>();
  if (!ctx) {
    throw new Error(
      "useAuthContext must be used within a ProtectedRoute"
    );
  }
  return ctx;
}
