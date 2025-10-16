import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function Cashback() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, selectedCategory]);

  const fetchStores = async () => {
    try {
      const q = query(collection(db, 'stores'), orderBy('createdAt', 'desc'), limit(20));
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
    if (selectedCategory === 'All') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        store.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleShopNow = (storeId, storeName) => {
    // Simulate opening store in new tab
    window.open(`https://${storeName.toLowerCase().replace(/\s+/g, '')}.com`, '_blank');
  };

  const topStores = [
    { 
      name: 'Trip.com', 
      cashback: 'Up to 7% back', 
      category: 'Travel',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Trip-com-Logo.png'
    },
    { 
      name: 'AliExpress', 
      cashback: 'Up to 21% back', 
      category: 'Shopping',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/AliExpress-Logo.png'
    },
    { 
      name: 'AT&T', 
      cashback: 'Up to 7% back', 
      category: 'Tech',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/ATT-Logo.png'
    },
    { 
      name: 'American Eagle', 
      cashback: 'Up to 8% back', 
      category: 'Fashion',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/American-Eagle-Logo.png'
    },
    { 
      name: 'Macy\'s', 
      cashback: 'Up to 5% back', 
      category: 'Department',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Macys-Logo.png'
    },
    { 
      name: 'Old Navy', 
      cashback: 'Up to 2.5% back', 
      category: 'Fashion',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Old-Navy-Logo.png'
    }
  ];

  const categories = [
    'All', 'Arts & Entertainment', 'Business', 'Clothing & Accessories', 
    'Food & Gifts', 'Health & Beauty', 'Home & Garden', 'Life & Family', 
    'Other', 'Sports & Fitness', 'Tech & Electronics', 'Travel'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#2c3e50] mb-4 text-center">Today's Top Cashback Offers</h1>
        </div>
      </div>

      {/* Top Cashback Offers */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {topStores.map((store, index) => (
                <div key={index} className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center p-2">
                      <img 
                        src={store.logo} 
                        alt={store.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-2xl font-bold text-gray-400">{store.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#2c3e50] mb-1">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">{store.cashback}</span>
                    <button 
                      onClick={() => handleShopNow(index + 1, store.name)}
                      className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 text-sm transition-colors"
                    >
                      SHOP NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">Earn Cashback at More Than 1000 Stores!</h2>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 mb-8">
            {/* Sidebar Categories */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 p-4">
                <h3 className="font-bold text-lg mb-4 text-[#2c3e50]">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryClick(cat)}
                      className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary text-white font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Store List */}
            <div className="flex-1">
              <div className="space-y-4">
                {filteredStores.map((store) => (
                  <div key={store.id} className="bg-white border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex items-center justify-center border border-gray-200 p-2">
                        {store.logoUrl ? (
                          <img src={store.logoUrl} alt={store.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">{store.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#0891b2] hover:underline">
                          <Link to={`/store/${store.id}`}>{store.name}</Link>
                        </h3>
                        <p className="text-sm text-gray-600">{store.description || 'Get cashback on your purchase'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-lg mb-2">Up to 10% back</p>
                      <button
                        onClick={() => handleShopNow(store.id, store.name)}
                        className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 text-sm transition-colors inline-block"
                      >
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

