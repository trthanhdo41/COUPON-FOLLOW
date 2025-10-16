import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiTag, FiShoppingBag, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

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
      
      setStats({
        totalCoupons: couponsSnapshot.size,
        totalStores: storesSnapshot.size,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/coupons"
            className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all"
          >
            <div className="bg-primary text-white p-3 rounded-lg">
              <FiTag size={24} />
            </div>
            <div>
              <h4 className="font-bold text-secondary">Add New Coupon</h4>
              <p className="text-gray-500 text-sm">Create a new coupon code</p>
            </div>
          </a>
          <a
            href="/admin/stores"
            className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-all"
          >
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <h4 className="font-bold text-secondary">Add New Store</h4>
              <p className="text-gray-500 text-sm">Register a new merchant</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

