import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  CreditCard,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Grid3X3,
  Box,
} from "lucide-react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [materialMenuOpen, setMaterialMenuOpen] = useState(false);

  // Material Management sub-items
  const materialSubItems = [
    { icon: FolderOpen, label: "Categories", path: "/categories" },
    { icon: Grid3X3, label: "Sub Categories", path: "/sub-categories" },
    { icon: Box, label: "Materials", path: "/materials" },
  ];

  // Check if any material sub-item is active
  const isMaterialActive = materialSubItems.some(
    (item) => location.pathname === item.path,
  );

  // Auto-expand material menu if any sub-item is active
  useEffect(() => {
    if (isMaterialActive) {
      setMaterialMenuOpen(true);
    }
  }, [isMaterialActive]);

  const menuItems = [
    // DASHBOARD
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },

    // USER MANAGEMENT
    { icon: Users, label: "Users Management", path: "/users" },

    // VENDORS
    { icon: Users, label: "Vendors", path: "/vendors" },

    // BOOKINGS
    { icon: Layers, label: "Bookings", path: "/bookings" },

    // TRANSACTIONS
    { icon: CreditCard, label: "Transactions", path: "/transactions" },

    // CMS
    { icon: FileText, label: "CMS Management", path: "/cms" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-12 border-b border-gray-100">
          <div className="pl-4">
            <h1 className="text-xl font-semibold text-gray-900">OTG</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Admin Panel
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-lg md:hidden hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-gray-500"}
                />
                <span
                  className={`text-sm ${
                    active ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Material Management - Expandable Menu */}
          <div>
            <button
              onClick={() => setMaterialMenuOpen(!materialMenuOpen)}
              className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isMaterialActive
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package
                  size={20}
                  className={
                    isMaterialActive ? "text-orange-500" : "text-gray-500"
                  }
                />
                <span
                  className={`text-sm ${
                    isMaterialActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  Material Management
                </span>
              </div>
              {materialMenuOpen ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>

            {/* Sub Menu */}
            {materialMenuOpen && (
              <div className="pl-4 mt-1 ml-4 space-y-1 border-l-2 border-gray-200">
                {materialSubItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-orange-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-white" : "text-gray-400"}
                      />
                      <span
                        className={`text-sm ${
                          active ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Menu Items */}
          {menuItems.slice(3).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-gray-500"}
                />
                <span
                  className={`text-sm ${
                    active ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm text-red-600 transition-all rounded-lg bg-red-50 hover:bg-red-100"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
