import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: any;
  allowedRoles: string[];
}) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // No login at all
  if (!token || !userRaw) {
    return <Navigate to="/login" />;
  }

  let user;

  try {
    user = JSON.parse(userRaw);
  } catch (err) {
    // corrupted localStorage fallback
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  // No role found
  if (!user?.role) {
    return <Navigate to="/login" />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}