import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    storeId: '',
    storeName: '',
    storeLogoUrl: '',
    title: '',
    description: '',
    code: '',
    discount: '',
    link: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch coupons
      const couponsQuery = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);

      // Fetch stores for dropdown
      const storesSnapshot = await getDocs(collection(db, 'stores'));
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStores(storesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleStoreSelect = (storeId) => {
    const selectedStore = stores.find(s => s.id === storeId);
    if (selectedStore) {
      setFormData({
        ...formData,
        storeId: storeId,
        storeName: selectedStore.name,
        storeLogoUrl: selectedStore.logoUrl || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCoupon) {
        // Update existing coupon
        await updateDoc(doc(db, 'coupons', editingCoupon.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new coupon
        await addDoc(collection(db, 'coupons'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon. Please try again.');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      storeId: coupon.storeId || '',
      storeName: coupon.storeName || '',
      storeLogoUrl: coupon.storeLogoUrl || '',
      title: coupon.title || '',
      description: coupon.description || '',
      code: coupon.code || '',
      discount: coupon.discount || '',
      link: coupon.link || '',
      expiryDate: coupon.expiryDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        fetchData();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Error deleting coupon. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      storeId: '',
      storeName: '',
      storeLogoUrl: '',
      title: '',
      description: '',
      code: '',
      discount: '',
      link: '',
      expiryDate: ''
    });
    setEditingCoupon(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Manage Coupons</h2>
          <p className="text-gray-600 mt-1">Add, edit, or remove coupon codes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus size={20} />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-secondary">Store</th>
                <th className="text-left py-4 px-4 font-semibold text-secondary">Title</th>
                <th className="text-left py-4 px-4 font-semibold text-secondary">Code</th>
                <th className="text-left py-4 px-4 font-semibold text-secondary">Discount</th>
                <th className="text-left py-4 px-4 font-semibold text-secondary">Expiry</th>
                <th className="text-right py-4 px-4 font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No coupons yet. Click "Add Coupon" to create one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {coupon.storeLogoUrl && (
                          <img src={coupon.storeLogoUrl} alt="" className="w-10 h-10 object-contain" />
                        )}
                        <span className="font-medium">{coupon.storeName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate">{coupon.title}</td>
                    <td className="py-4 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {coupon.code || 'No code'}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                        {coupon.discount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-secondary">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Store *</label>
                <select
                  required
                  value={formData.storeId}
                  onChange={(e) => handleStoreSelect(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a store...</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Coupon Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Save 20% Off Your Order"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Describe the coupon offer..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="input-field"
                    placeholder="SAVE20"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty if no code needed</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Discount Display *</label>
                  <input
                    type="text"
                    required
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="input-field"
                    placeholder="20% OFF"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Link URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="input-field"
                    placeholder="https://store.com/deal"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <FiSave size={18} />
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

