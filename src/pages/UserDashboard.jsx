import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHeart, FiClock, FiTag, FiTrendingUp, FiSettings, FiLogOut } from 'react-icons/fi';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [cashbackHistory, setCashbackHistory] = useState([]);

  useEffect(() => {
    // Simulate loading user data
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Mock data - in real app, fetch from Firebase
    setSavedCoupons([
      { id: 1, title: 'Amazon 20% Off', store: 'Amazon', code: 'SAVE20', expiry: '2024-12-31' },
      { id: 2, title: 'Nike Free Shipping', store: 'Nike', code: 'FREESHIP', expiry: '2024-11-30' }
    ]);
    
    setFavoriteStores([
      { id: 1, name: 'Amazon', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png' },
      { id: 2, name: 'Nike', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' },
      { id: 3, name: 'Target', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Target-Logo.png' }
    ]);

    setCashbackHistory([
      { id: 1, store: 'Amazon', amount: 15.50, date: '2024-10-15', status: 'pending' },
      { id: 2, store: 'Nike', amount: 8.75, date: '2024-10-10', status: 'paid' }
    ]);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'saved', label: 'Saved Coupons', icon: FiTag },
    { id: 'favorites', label: 'Favorite Stores', icon: FiHeart },
    { id: 'cashback', label: 'Cashback History', icon: FiClock },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiLogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Saved</p>
                        <p className="text-2xl font-bold text-gray-900">$127.50</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <FiTrendingUp className="text-green-600" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Saved Coupons</p>
                        <p className="text-2xl font-bold text-gray-900">{savedCoupons.length}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FiTag className="text-blue-600" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Favorite Stores</p>
                        <p className="text-2xl font-bold text-gray-900">{favoriteStores.length}</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <FiHeart className="text-red-600" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FiTag className="text-green-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Used Amazon coupon</p>
                          <p className="text-sm text-gray-500">Saved $15.50 • 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiHeart className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Added Nike to favorites</p>
                          <p className="text-sm text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Saved Coupons</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {savedCoupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FiTag className="text-primary" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{coupon.title}</h4>
                            <p className="text-sm text-gray-500">{coupon.store} • Expires {coupon.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {coupon.code}
                          </span>
                          <button className="text-primary hover:text-primary-dark font-medium">
                            Use Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Favorite Stores</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteStores.map((store) => (
                      <Link
                        key={store.id}
                        to={`/store/${store.id}`}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={store.logo}
                          alt={store.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                          <span className="text-lg font-bold text-gray-400">{store.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{store.name}</h4>
                          <p className="text-sm text-gray-500">View coupons</p>
                        </div>
                        <FiHeart className="text-red-500" size={20} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cashback' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Cashback History</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {cashbackHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">$</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.store}</h4>
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${item.amount}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            item.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">New coupon alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Cashback notifications</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                    <p className="text-sm text-gray-600 mb-4">Manage your privacy settings and data preferences.</p>
                    <button className="text-primary hover:text-primary-dark font-medium">
                      View Privacy Policy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
