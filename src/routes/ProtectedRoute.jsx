import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {

  const isAuthenticated = true;

  // ❌ Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in → allow access
  return <Outlet />;
};

export default ProtectedRoute;
