import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Check if token exists in localStorage as fallback
  const storedToken = localStorage.getItem("token");

  if (!isAuthenticated && !storedToken && !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
