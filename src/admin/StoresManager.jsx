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
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiImage, FiAlertCircle } from 'react-icons/fi';

export default function StoresManager() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    } else {
      setFilteredStores(stores);
    }
  }, [searchTerm, stores]);

  const fetchStores = async () => {
    try {
      const q = query(collection(db, 'stores'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const storesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStores(storesData);
      setFilteredStores(storesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      alert('Failed to load stores. Please refresh the page.');
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    
    if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
      newErrors.logoUrl = 'Please enter a valid URL';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
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
      if (editingStore) {
        await updateDoc(doc(db, 'stores', editingStore.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        alert('Store updated successfully!');
      } else {
        await addDoc(collection(db, 'stores'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        alert('Store added successfully!');
      }
      
      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Error saving store. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      description: store.description || '',
      logoUrl: store.logoUrl || '',
      website: store.website || ''
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'stores', id));
        alert('Store deleted successfully!');
        fetchStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        alert('Error deleting store. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
      website: ''
    });
    setEditingStore(null);
    setErrors({});
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
          <h2 className="text-3xl font-bold text-secondary">Manage Stores</h2>
          <p className="text-gray-600 mt-1">Total: {stores.length} stores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus size={20} />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stores by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white shadow-md overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden divide-y divide-gray-200">
          {filteredStores.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              {searchTerm ? 'No stores found matching your search.' : 'No stores yet. Add your first store!'}
            </div>
          ) : (
            filteredStores.map((store) => (
              <div key={store.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center border border-gray-200 p-2">
                    {store.logoUrl ? (
                      <img 
                        src={store.logoUrl} 
                        alt={store.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-2xl text-gray-400">' + store.name.charAt(0) + '</span>';
                        }}
                      />
                    ) : (
                      <span className="text-2xl text-gray-400">{store.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
                    {store.description && (
                      <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                    )}
                    {store.website && (
                      <a 
                        href={store.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(store)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(store.id, store.name)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No stores found matching your search.' : 'No stores yet. Add your first store!'}
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 flex items-center justify-center border border-gray-200 p-2">
                        {store.logoUrl ? (
                          <img 
                            src={store.logoUrl} 
                            alt={store.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span class="text-2xl text-gray-400">' + store.name.charAt(0) + '</span>';
                            }}
                          />
                        ) : (
                          <span className="text-2xl text-gray-400">{store.name.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{store.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {store.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {store.website ? (
                        <a 
                          href={store.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(store)}
                        className="text-primary hover:text-primary-dark mr-4 inline-flex items-center gap-1"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(store.id, store.name)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white w-full h-full md:max-w-2xl md:w-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl md:rounded-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-secondary">
                {editingStore ? 'Edit Store' : 'Add New Store'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="e.g., Amazon, Nike, Target"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Brief description of the store..."
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.logoUrl ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="https://example.com/logo.png"
                    />
                    {errors.logoUrl && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={14} />
                        {errors.logoUrl}
                      </p>
                    )}
                  </div>
                  {formData.logoUrl && !errors.logoUrl && (
                    <div className="w-20 h-20 border border-gray-300 flex items-center justify-center p-2">
                      <img 
                        src={formData.logoUrl} 
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<FiImage class="text-gray-400" />';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Paste the direct URL to the store's logo image</p>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.website ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.website}
                  </p>
                )}
              </div>

              {/* Form Actions */}
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
                      <span>{editingStore ? 'Update Store' : 'Add Store'}</span>
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
