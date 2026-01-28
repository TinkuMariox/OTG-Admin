import { Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin Pages
import Dashboard from "../pages/Dashboard";
import Users from "../pages/User";
import Vendors from "../pages/Vendors";
import VendorMaterials from "../pages/VendorMaterials";
import Categories from "../pages/Categories";
import SubCategories from "../pages/SubCategories";
import Materials from "../pages/Materials";
import Bookings from "../pages/Booking";
import Transactions from "../pages/Transactions";
import CMS from "../pages/CMS";

// Layout & Route Guards
import AdminLayout from "../components/layout/AdminLayout";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* ===== PRIVATE/ADMIN ROUTES ===== */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route
            path="/vendors/:vendorId/materials"
            element={<VendorMaterials />}
          />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sub-categories" element={<SubCategories />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cms" element={<CMS />} />
        </Route>
      </Route>

      {/* ===== DEFAULT REDIRECT ===== */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
