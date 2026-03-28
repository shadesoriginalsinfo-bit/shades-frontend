import { logout } from "@/lib/api";
import { handleApiError } from "@/utils/handleApiError";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      await logout();

      queryClient.removeQueries({ queryKey: ["auth-user"] });

      toast.success("Logout Successfull !!");
      navigate("/login");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    logout: handleLogout,
    logoutLoading: loading,
  };
}
