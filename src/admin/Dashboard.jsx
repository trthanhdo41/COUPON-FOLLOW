import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiTag, FiShoppingBag, FiTrendingUp, FiDollarSign, FiFolder, FiBarChart2 } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    totalStores: 0,
    activeCoupons: 0,
    totalSavings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const couponsSnapshot = await getDocs(collection(db, 'coupons'));
      const storesSnapshot = await getDocs(collection(db, 'stores'));
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      
      setStats({
        totalCoupons: couponsSnapshot.size,
        totalStores: storesSnapshot.size,
        totalCategories: categoriesSnapshot.size,
        activeCoupons: couponsSnapshot.size,
        totalSavings: couponsSnapshot.size * 50 // Mock calculation
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Coupons',
      value: stats.totalCoupons,
      icon: FiTag,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Stores',
      value: stats.totalStores,
      icon: FiShoppingBag,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Coupons',
      value: stats.activeCoupons,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Est. Savings',
      value: `$${stats.totalSavings.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your coupons.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`card ${stat.bgColor} border-l-4 border-l-${stat.color.split('-')[1]}-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-secondary">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-lg`}>
                <stat.icon size={32} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-bold text-secondary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/coupons"
            className="flex flex-col items-center text-center p-6 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="bg-primary group-hover:bg-primary-dark text-white p-4 mb-3 transition-colors">
              <FiTag size={28} />
            </div>
            <h4 className="font-bold text-secondary mb-1">Coupons</h4>
            <p className="text-gray-500 text-xs">Manage all coupons</p>
          </Link>
          
          <Link
            to="/admin/stores"
            className="flex flex-col items-center text-center p-6 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="bg-green-500 group-hover:bg-green-600 text-white p-4 mb-3 transition-colors">
              <FiShoppingBag size={28} />
            </div>
            <h4 className="font-bold text-secondary mb-1">Stores</h4>
            <p className="text-gray-500 text-xs">Manage merchants</p>
          </Link>
          
          <Link
            to="/admin/categories"
            className="flex flex-col items-center text-center p-6 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="bg-purple-500 group-hover:bg-purple-600 text-white p-4 mb-3 transition-colors">
              <FiFolder size={28} />
            </div>
            <h4 className="font-bold text-secondary mb-1">Categories</h4>
            <p className="text-gray-500 text-xs">Organize content</p>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="flex flex-col items-center text-center p-6 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="bg-orange-500 group-hover:bg-orange-600 text-white p-4 mb-3 transition-colors">
              <FiBarChart2 size={28} />
            </div>
            <h4 className="font-bold text-secondary mb-1">Analytics</h4>
            <p className="text-gray-500 text-xs">View insights</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

