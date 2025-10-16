import { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiTag, FiShoppingBag, FiLogOut, FiMenu, FiX, FiFolder, FiBarChart2 } from 'react-icons/fi';
import CouponsManager from './CouponsManager';
import StoresManager from './StoresManager';
import CategoriesManager from './CategoriesManager';
import AnalyticsManager from './AnalyticsManager';
import Dashboard from './Dashboard';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/coupons', icon: FiTag, label: 'Coupons' },
    { path: '/admin/stores', icon: FiShoppingBag, label: 'Stores' },
    { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-light flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-secondary text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="bg-primary px-3 py-1 rounded font-bold">COUPON</span>
              <span className="text-primary font-bold">FOLLOW</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-primary/80 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-secondary">Admin Panel</h1>
            <div className="w-10 lg:w-0" /> {/* Spacer for mobile */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coupons" element={<CouponsManager />} />
            <Route path="/stores" element={<StoresManager />} />
            <Route path="/categories" element={<CategoriesManager />} />
            <Route path="/analytics" element={<AnalyticsManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

