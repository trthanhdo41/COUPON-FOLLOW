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
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiAlertCircle, FiTag } from 'react-icons/fi';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    storeId: '',
    storeName: '',
    storeLogoUrl: '',
    title: '',
    description: '',
    code: '',
    discount: '',
    link: '',
    exclusive: false,
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = coupons;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(coupon =>
        coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStore) {
      filtered = filtered.filter(coupon => coupon.storeId === filterStore);
    }
    
    setFilteredCoupons(filtered);
  }, [searchTerm, filterStore, coupons]);

  const fetchData = async () => {
    try {
      const couponsQuery = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
      setFilteredCoupons(couponsData);

      const storesQuery = query(collection(db, 'stores'), orderBy('name', 'asc'));
      const storesSnapshot = await getDocs(storesQuery);
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStores(storesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please refresh the page.');
      setLoading(false);
    }
  };

  const handleStoreSelect = (storeId) => {
    const selectedStore = stores.find(s => s.id === storeId);
    if (selectedStore) {
      setFormData(prev => ({
        ...prev,
        storeId: storeId,
        storeName: selectedStore.name,
        storeLogoUrl: selectedStore.logoUrl || ''
      }));
      if (errors.storeId) {
        setErrors(prev => ({ ...prev, storeId: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.storeId) {
      newErrors.storeId = 'Please select a store';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.discount.trim()) {
      newErrors.discount = 'Discount is required';
    }
    
    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const couponData = {
        ...formData,
        exclusive: Boolean(formData.exclusive)
      };

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), {
          ...couponData,
          updatedAt: serverTimestamp()
        });
        alert('Coupon updated successfully!');
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...couponData,
          createdAt: serverTimestamp()
        });
        alert('Coupon added successfully!');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon. Please try again.');
    } finally {
      setSaving(false);
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
      exclusive: coupon.exclusive || false,
      expiryDate: coupon.expiryDate || ''
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        alert('Coupon deleted successfully!');
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
      exclusive: false,
      expiryDate: ''
    });
    setEditingCoupon(null);
    setErrors({});
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
          <h2 className="text-3xl font-bold text-secondary">Manage Coupons</h2>
          <p className="text-gray-600 mt-1">Total: {coupons.length} coupons</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus size={20} />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search coupons by title, description, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Stores</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterStore ? 'No coupons found matching your filters.' : 'No coupons yet. Add your first coupon!'}
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 p-1">
                          {coupon.storeLogoUrl ? (
                            <img 
                              src={coupon.storeLogoUrl} 
                              alt={coupon.storeName}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-xl text-gray-400">' + (coupon.storeName?.charAt(0) || '?') + '</span>';
                              }}
                            />
                          ) : (
                            <span className="text-xl text-gray-400">{coupon.storeName?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{coupon.storeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{coupon.title}</div>
                      {coupon.description && (
                        <div className="text-xs text-gray-500 max-w-xs truncate mt-1">{coupon.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.code ? (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 text-sm font-mono font-bold text-gray-800">
                          {coupon.code}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No code</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-primary">{coupon.discount}</span>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.exclusive && (
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold">
                          EXCLUSIVE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-primary hover:text-primary-dark mr-4 inline-flex items-center gap-1"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.title)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <FiTrash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-secondary">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Store Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Store <span className="text-red-500">*</span>
                </label>
                <select
                  name="storeId"
                  value={formData.storeId}
                  onChange={(e) => handleStoreSelect(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.storeId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                >
                  <option value="">Choose a store...</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
                {errors.storeId && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.storeId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="e.g., Get 50% Off Your Order"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of the coupon..."
                  />
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                    placeholder="e.g., SAVE50"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave empty if no code required</p>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.discount ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="e.g., 50% Off, $20 Off"
                  />
                  {errors.discount && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.discount}
                    </p>
                  )}
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.link ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="https://..."
                  />
                  {errors.link && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.link}
                    </p>
                  )}
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Exclusive */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="exclusive"
                      checked={formData.exclusive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as Exclusive Deal
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave size={20} />
                      <span>{editingCoupon ? 'Update Coupon' : 'Add Coupon'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
