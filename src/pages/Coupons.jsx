import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FiTag } from 'react-icons/fi';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedCodes, setRevealedCodes] = useState(new Set());

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const couponsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleRevealCode = (couponId) => {
    setRevealedCodes(prev => new Set([...prev, couponId]));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Featured Coupon Codes</h1>
          <h2 className="text-xl text-gray-600">Today's Top Featured Promo Codes</h2>
        </div>
      </div>

      {/* Coupons List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded p-16 text-center">
            <FiTag className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Coupons Yet</h2>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6 flex items-start gap-6">
                  {/* Store Logo */}
                  <div className="flex-shrink-0">
                    {coupon.storeLogoUrl ? (
                      <img 
                        src={coupon.storeLogoUrl} 
                        alt={coupon.storeName}
                        className="w-20 h-20 object-contain border border-gray-200 p-2 bg-white"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {coupon.storeName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Coupon Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-[#0891b2] hover:underline mb-2 leading-tight">
                      <Link to={`/store/${coupon.storeId}`}>
                        {coupon.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                      {coupon.description}
                    </p>
                    
                    <p className="text-gray-500 text-sm">
                      {coupon.storeName}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {coupon.code ? (
                      <div className="relative">
                        {revealedCodes.has(coupon.id) ? (
                          <div className="bg-white border-2 border-dashed border-[#0891b2] px-4 py-3 text-center min-w-[140px]">
                            <span className="font-bold text-lg text-[#2c3e50] font-mono">
                              {coupon.code}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRevealCode(coupon.id)}
                            className="bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold px-6 py-3 transition-colors min-w-[140px] text-sm"
                          >
                            Show Coupon Code
                          </button>
                        )}
                      </div>
                    ) : (
                      <a
                        href={coupon.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold px-6 py-3 transition-colors min-w-[140px] text-sm inline-block text-center"
                      >
                        Get Deal
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && coupons.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold hover:bg-primary-dark transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              4
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              5
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

