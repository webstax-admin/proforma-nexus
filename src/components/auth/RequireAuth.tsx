import { ReactNode } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAppState } from "@/store/app-state";

interface RequireAuthProps {
  role?: "admin" | "company" | "applicant";
  enforceIdMatchFromParam?: boolean; // when role is company/applicant
  children: ReactNode;
}

export const RequireAuth = ({ role, enforceIdMatchFromParam, children }: RequireAuthProps) => {
  const { currentUser } = useAppState();
  const location = useLocation();
  const params = useParams();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  if (enforceIdMatchFromParam && currentUser.linkedId && params.id && params.id !== currentUser.linkedId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
