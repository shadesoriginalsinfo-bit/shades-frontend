import { useAuthUser } from "@/hooks/useAuth";
import LoadingModal from "@/pages/LoadingPage";
import type { Role } from "@/types/enum";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRoles?: Role[];
};

function ProtectedRoute({ allowedRoles }: Props) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) return <LoadingModal />;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (if roles are provided)
  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet context={{ user }} />;
}

export default ProtectedRoute;
