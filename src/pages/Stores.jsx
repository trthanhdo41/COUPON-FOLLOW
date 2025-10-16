import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleStores, setVisibleStores] = useState(12);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, selectedLetter, selectedCategory]);

  const fetchStores = async () => {
    try {
      const q = query(collection(db, 'stores'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const storesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStores(storesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    // Filter by letter
    if (selectedLetter !== 'All') {
      if (selectedLetter === '#') {
        // Numbers and special characters
        filtered = filtered.filter(store => 
          /^[0-9]/.test(store.name) || /^[^A-Za-z0-9]/.test(store.name)
        );
      } else {
        filtered = filtered.filter(store => 
          store.name.charAt(0).toUpperCase() === selectedLetter
        );
      }
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(store => 
        store.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredStores(filtered);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setVisibleStores(12); // Reset visible count
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setVisibleStores(12); // Reset visible count
  };

  const handleLoadMore = () => {
    setVisibleStores(prev => Math.min(prev + 12, filteredStores.length));
  };

  const categories = [
    'All', 'Fashion', 'Electronics', 'Home & Garden', 'Health & Beauty',
    'Sports & Fitness', 'Travel', 'Food & Dining', 'Automotive', 'Other'
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  const topMerchants = [
    // Column 1
    ['Amazon Canada Coupons', 'Amazon Promo Codes', 'Arhaus Coupons', 'Asos Discount Codes', 'Autodesk Coupons', 'Best Buy Coupons', 'Chegg Coupons', 'Dell Coupons', 'eBay Coupons', 'eBay UK Coupons', 'Expedia Coupons', 'GoDaddy Coupons'],
    // Column 2
    ['Groupon Promo Codes', 'Groupon UK Coupons', 'GymShark Promo Codes', 'Home Depot Coupons', 'Hotels.com Coupons', 'Intuit Coupons', 'ITA Airways Coupons', 'J. Crew Coupons', 'Lenovo Coupons', 'Lowe\'s Coupons', 'New Balance Coupons', 'Nike Coupons'],
    // Column 3
    ['Princess Polly Coupons', 'Shutterstock Coupons', 'Target Coupons', 'The Ordinary Coupons', 'Torrid Coupons', 'Tory Burch Coupons', 'TripAdvisor Coupons', 'Udemy Coupons', 'Victoria\'s Secret Coupon Codes', 'Zazzle Coupons', 'Zoro Coupons']
  ];

  const recentlyAdded = [
    // Column 1
    ['AeroMexico Coupons', 'All-Clad Coupons', 'Beach Riot Coupons', 'COOFANDY Coupons'],
    // Column 2
    ['Culturelle Coupons', 'Jupiter Bike Coupons', 'Nutribullet Coupons', 'Red Wing Shoes Coupons'],
    // Column 3
    ['Solo Stove Coupons', 'tonies Coupons', 'TYR Coupons', 'Universal Standard Coupons']
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Filters */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-6 text-center">Browse All Stores</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center text-gray-600 mb-4">
            Showing {Math.min(visibleStores, filteredStores.length)} of {filteredStores.length} stores
            {selectedLetter !== 'All' && ` starting with "${selectedLetter}"`}
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No stores found</h3>
              <p className="text-gray-500">Try selecting a different letter or category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {filteredStores.slice(0, visibleStores).map((store) => (
                <Link 
                  key={store.id} 
                  to={`/store/${store.id}`}
                  className="bg-white border border-gray-200 hover:shadow-md transition-all p-6 flex flex-col items-center"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-3">
                    {store.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-400">
                          {store.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#2c3e50] text-center text-sm">
                    {store.name}
                  </h3>
                </Link>
                ))}
              </div>

              {/* Load More Button */}
              {visibleStores < filteredStores.length && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
                  >
                    Load More Stores ({filteredStores.length - visibleStores} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Top Merchants */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">Top Merchants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {topMerchants.map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {column.map((merchant, index) => (
                  <Link
                    key={index}
                    to={`/search?q=${merchant.toLowerCase()}`}
                    className="block text-[#64748b] hover:text-[#0891b2] hover:underline text-sm transition-colors"
                  >
                    {merchant}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">Recently Added</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {recentlyAdded.map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {column.map((merchant, index) => (
                  <Link
                    key={index}
                    to={`/search?q=${merchant.toLowerCase()}`}
                    className="block text-[#64748b] hover:text-[#0891b2] hover:underline text-sm transition-colors"
                  >
                    {merchant}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-[#2c3e50] mb-4 text-center">Browse by Letter</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleLetterClick('All')}
              className={`w-10 h-10 flex items-center justify-center border transition-all font-semibold ${
                selectedLetter === 'All'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-300 hover:bg-primary hover:text-white hover:border-primary text-[#2c3e50]'
              }`}
            >
              All
            </button>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-10 h-10 flex items-center justify-center border transition-all font-semibold ${
                  selectedLetter === letter
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-300 hover:bg-primary hover:text-white hover:border-primary text-[#2c3e50]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

