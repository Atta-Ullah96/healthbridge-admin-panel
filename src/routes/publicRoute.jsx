import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
let isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
