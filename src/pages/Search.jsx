import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    discountType: '',
    minDiscount: '',
    maxDiscount: '',
    expiryDate: '',
    sortBy: 'relevance'
  });

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Search stores
      const storesQuery = query(
        collection(db, 'stores'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name')
      );
      const storesSnapshot = await getDocs(storesQuery);
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'store',
        ...doc.data()
      }));

      // Search coupons
      const couponsQuery = query(
        collection(db, 'coupons'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        orderBy('title')
      );
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'coupon',
        ...doc.data()
      }));

      setResults([...storesData, ...couponsData]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch();
    }
  };

  const applyFilters = (items) => {
    return items.filter(item => {
      // Tab filter
      if (activeTab !== 'all' && item.type !== activeTab) return false;
      
      // Category filter
      if (filters.category && item.category !== filters.category) return false;
      
      // Discount type filter (for coupons)
      if (filters.discountType && item.type === 'coupon') {
        if (filters.discountType === 'percentage' && !item.title.toLowerCase().includes('%')) return false;
        if (filters.discountType === 'amount' && !item.title.toLowerCase().includes('$')) return false;
        if (filters.discountType === 'free' && !item.title.toLowerCase().includes('free')) return false;
      }
      
      // Discount range filter (for coupons)
      if (item.type === 'coupon') {
        const discountMatch = item.title.match(/(\d+)%/);
        if (discountMatch) {
          const discount = parseInt(discountMatch[1]);
          if (filters.minDiscount && discount < parseInt(filters.minDiscount)) return false;
          if (filters.maxDiscount && discount > parseInt(filters.maxDiscount)) return false;
        }
      }
      
      // Expiry date filter
      if (filters.expiryDate && item.type === 'coupon') {
        if (filters.expiryDate === 'week' && item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          if (expiry > weekFromNow) return false;
        }
        if (filters.expiryDate === 'month' && item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          const monthFromNow = new Date();
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          if (expiry > monthFromNow) return false;
        }
      }
      
      return true;
    });
  };

  const sortResults = (items) => {
    switch (filters.sortBy) {
      case 'name':
        return items.sort((a, b) => (a.name || a.title).localeCompare(b.name || b.title));
      case 'discount':
        return items.sort((a, b) => {
          const aDiscount = a.title?.match(/(\d+)%/)?.[1] || 0;
          const bDiscount = b.title?.match(/(\d+)%/)?.[1] || 0;
          return parseInt(bDiscount) - parseInt(aDiscount);
        });
      case 'newest':
        return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return items;
    }
  };

  const filteredResults = sortResults(applyFilters(results));

  const clearFilters = () => {
    setFilters({
      category: '',
      discountType: '',
      minDiscount: '',
      maxDiscount: '',
      expiryDate: '',
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'relevance');

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-6">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for stores, coupons, or deals..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Tabs and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex gap-4 flex-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Results ({results.length})
              </button>
              <button
                onClick={() => setActiveTab('store')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'store' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Stores ({results.filter(r => r.type === 'store').length})
              </button>
              <button
                onClick={() => setActiveTab('coupon')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'coupon' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Coupons ({results.filter(r => r.type === 'coupon').length})
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <FiFilter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full">
                    {Object.values(filters).filter(v => v !== '' && v !== 'relevance').length}
                  </span>
                )}
              </button>
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="name">Sort by Name</option>
                <option value="discount">Sort by Discount</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Travel">Travel</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                  </select>
                </div>

                {/* Discount Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={filters.discountType}
                    onChange={(e) => setFilters({...filters, discountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Types</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Amount ($)</option>
                    <option value="free">Free Shipping</option>
                  </select>
                </div>

                {/* Discount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min %"
                      value={filters.minDiscount}
                      onChange={(e) => setFilters({...filters, minDiscount: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Max %"
                      value={filters.maxDiscount}
                      onChange={(e) => setFilters({...filters, maxDiscount: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Expiry Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                  <select
                    value={filters.expiryDate}
                    onChange={(e) => setFilters({...filters, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any Time</option>
                    <option value="week">Within 1 Week</option>
                    <option value="month">Within 1 Month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-6">
              {filteredResults.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {item.type === 'store' ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex items-center justify-center border border-gray-200 p-2">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">{item.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#2c3e50] mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-2">{item.description || 'Get great deals and cashback'}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Category: {item.category || 'General'}</span>
                          <span>•</span>
                          <span>Up to 10% cashback</span>
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Visit Store
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-lg">
                        <span className="text-2xl font-bold">%</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#2c3e50] mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-2">{item.description || 'Save money with this exclusive offer'}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Code: {item.code || 'SAVE20'}</span>
                          <span>•</span>
                          <span>Expires: {item.expiryDate || 'No expiry'}</span>
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Get Code
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching with different keywords or check your spelling.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Start your search</h3>
              <p className="text-gray-500">Enter a store name, coupon code, or deal to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
