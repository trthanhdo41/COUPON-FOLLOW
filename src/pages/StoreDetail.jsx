import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FiExternalLink, FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi';

export default function StoreDetail() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      // Fetch store details
      const storeDoc = await getDoc(doc(db, 'stores', storeId));
      if (storeDoc.exists()) {
        setStore({ id: storeDoc.id, ...storeDoc.data() });
      }

      // Fetch coupons for this store
      const q = query(
        collection(db, 'coupons'),
        where('storeId', '==', storeId)
      );
      const querySnapshot = await getDocs(q);
      const couponsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setLoading(false);
    }
  };

  const handleCopyCode = (code, couponId) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(couponId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="card text-center py-12 max-w-md">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Store Not Found</h2>
          <Link to="/stores" className="btn-primary inline-block">
            Back to Stores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/stores" className="inline-flex items-center text-primary hover:text-primary-dark font-semibold">
            <FiArrowLeft className="mr-2" />
            Back to Stores
          </Link>
        </div>
      </div>

      {/* Store Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Store Logo */}
            <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg border-2 border-gray-200 p-4">
              {store.logoUrl ? (
                <img 
                  src={store.logoUrl} 
                  alt={store.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-secondary mb-2">{store.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{store.description}</p>
              {store.website && (
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary-dark font-semibold"
                >
                  Visit Website
                  <FiExternalLink className="ml-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-secondary mb-6">
          Available Coupons ({coupons.length})
        </h2>

        {coupons.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No coupons available for this store yet</p>
            <p className="text-gray-400 mt-2">Check back soon for new deals!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className="card flex flex-col lg:flex-row items-start lg:items-center justify-between hover:border-primary border border-transparent transition-all"
              >
                <div className="flex-1 w-full lg:w-auto mb-4 lg:mb-0">
                  <h3 className="font-bold text-xl text-secondary mb-2">
                    {coupon.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{coupon.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      {coupon.discount}
                    </span>
                    {coupon.expiryDate && (
                      <span className="text-gray-400">
                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-auto lg:ml-6">
                  {coupon.code ? (
                    <button
                      onClick={() => handleCopyCode(coupon.code, coupon.id)}
                      className="btn-primary w-full lg:w-auto flex items-center justify-center space-x-2"
                    >
                      {copiedCode === coupon.id ? (
                        <>
                          <FiCheck size={18} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={18} />
                          <span>Copy Code: {coupon.code}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <a
                      href={coupon.link || store.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full lg:w-auto text-center block"
                    >
                      Get Deal
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

