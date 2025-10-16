import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { FiTrendingUp, FiUsers, FiDollarSign, FiEye, FiMousePointer, FiTag, FiShoppingBag, FiCalendar } from 'react-icons/fi';

export default function AnalyticsManager() {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    totalStores: 0,
    totalCategories: 0,
    activeCoupons: 0,
    totalViews: 0,
    totalClicks: 0,
    conversionRate: 0,
    avgSavings: 0
  });
  const [topStores, setTopStores] = useState([]);
  const [topCoupons, setTopCoupons] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic stats
      const couponsSnapshot = await getDocs(collection(db, 'coupons'));
      const storesSnapshot = await getDocs(collection(db, 'stores'));
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));

      // Calculate stats
      const totalCoupons = couponsSnapshot.size;
      const totalStores = storesSnapshot.size;
      const totalCategories = categoriesSnapshot.size;
      
      // Mock data for demo (trong production sẽ lấy từ analytics collection)
      const totalViews = totalCoupons * 127;
      const totalClicks = totalCoupons * 43;
      const conversionRate = totalClicks > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

      setStats({
        totalCoupons,
        totalStores,
        totalCategories,
        activeCoupons: totalCoupons,
        totalViews,
        totalClicks,
        conversionRate,
        avgSavings: 47.50
      });

      // Fetch top stores
      const storesQuery = query(collection(db, 'stores'), limit(5));
      const topStoresSnapshot = await getDocs(storesQuery);
      setTopStores(topStoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 500) + 50
      })));

      // Fetch top coupons
      const couponsQuery = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'), limit(5));
      const topCouponsSnapshot = await getDocs(couponsQuery);
      setTopCoupons(topCouponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: Math.floor(Math.random() * 500) + 50,
        clicks: Math.floor(Math.random() * 200) + 20
      })));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: FiEye,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12.5%'
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: FiMousePointer,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+8.2%'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      change: '+3.1%'
    },
    {
      title: 'Avg. Savings',
      value: `$${stats.avgSavings}`,
      icon: FiDollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      change: '+15.7%'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} border-l-4 border-l-${stat.color.split('-')[1]}-500 p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium text-sm">{stat.title}</p>
              <div className={`${stat.color} text-white p-2`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-secondary mb-1">{stat.value}</p>
            <p className="text-sm text-green-600 font-semibold">{stat.change} from last period</p>
          </div>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary text-white p-3">
              <FiTag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalCoupons}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="text-green-600 font-semibold">{stats.activeCoupons}</span> active
          </div>
        </div>

        <div className="bg-white p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 text-white p-3">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalStores}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Across {stats.totalCategories} categories
          </div>
        </div>

        <div className="bg-white p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 text-white p-3">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">User Engagement</p>
              <p className="text-2xl font-bold text-secondary">High</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {stats.conversionRate}% conversion rate
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stores */}
        <div className="bg-white border-2 border-gray-200 p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Top Performing Stores</h3>
          <div className="space-y-4">
            {topStores.map((store, index) => (
              <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-400">#{index + 1}</span>
                  <div className="w-10 h-10 flex items-center justify-center border border-gray-200 p-1">
                    {store.logoUrl ? (
                      <img src={store.logoUrl} alt={store.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-lg text-gray-400">{store.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.views} views • {store.clicks} clicks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{((store.clicks / store.views) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Coupons */}
        <div className="bg-white border-2 border-gray-200 p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Top Performing Coupons</h3>
          <div className="space-y-4">
            {topCoupons.map((coupon, index) => (
              <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="font-bold text-gray-400">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{coupon.title}</p>
                    <p className="text-xs text-gray-500">{coupon.views} views • {coupon.clicks} clicks</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-green-600">{coupon.discount}</p>
                  <p className="text-xs text-gray-500">{((coupon.clicks / coupon.views) * 100).toFixed(1)}% CTR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

