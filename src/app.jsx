import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/User";
import Vendors from "./pages/Vendors";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import Materials from "./pages/Materials";
import Bookings from "./pages/Booking";
import Transactions from "./pages/Transactions";
import CMS from "./pages/CMS";

import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sub-categories" element={<SubCategories />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cms" element={<CMS />} />
        </Route>

        {/* ===== DEFAULT ===== */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
