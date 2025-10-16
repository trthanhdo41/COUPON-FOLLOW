import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stores');

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

  const filteredResults = results.filter(item => 
    activeTab === 'all' || item.type === activeTab
  );

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

          {/* Search Tabs */}
          <div className="flex gap-4 mb-6">
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
              onClick={() => setActiveTab('stores')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'stores' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Stores ({results.filter(r => r.type === 'stores').length})
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'coupons' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Coupons ({results.filter(r => r.type === 'coupons').length})
            </button>
          </div>
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
