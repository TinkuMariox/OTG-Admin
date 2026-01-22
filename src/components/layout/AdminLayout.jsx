import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  CreditCard,
  X
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    // DASHBOARD
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },

    // USER MANAGEMENT
    { icon: Users, label: 'UsersManagement', path: '/users' },
    // { icon: Users, label: 'Admins', path: '/users/admins' },
    // { icon: Users, label: 'Customers', path: '/users/customers' },
    
    
    // CATALOG
    { icon: Users, label: 'Vendors', path: '/vendors' },
    { icon: Package, label: 'Categories', path: '/categories' },
    { icon: Layers, label: 'Sub Categories', path: '/sub-categories' },
    { icon: Package, label: 'Materials', path: '/materials' },

    // BOOKINGS
    { icon: Layers, label: 'Bookings', path: '/bookings' },

    // TRANSACTIONS
    { icon: CreditCard, label: 'Transactions', path: '/transactions' },

    // CMS
    { icon: FileText, label: 'CMS Management', path: '/cms' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-12 border-b border-gray-100">
          <div className="pl-4">
            <h1 className="text-xl font-semibold text-gray-900">BuildHub</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Admin Panel
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  size={20}
                  className={active ? 'text-white' : 'text-gray-500'}
                />
                <span
                  className={`text-sm ${
                    active ? 'font-semibold' : 'font-normal'
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
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
