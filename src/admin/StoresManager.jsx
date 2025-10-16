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

export default function StoresManager() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    website: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const q = query(collection(db, 'stores'), orderBy('name', 'asc'));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        // Update existing store
        await updateDoc(doc(db, 'stores', editingStore.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new store
        await addDoc(collection(db, 'stores'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      
      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Error saving store. Please try again.');
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
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store? This will not delete associated coupons.')) {
      try {
        await deleteDoc(doc(db, 'stores', id));
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
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Manage Stores</h2>
          <p className="text-gray-600 mt-1">Add, edit, or remove merchant stores</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus size={20} />
          <span>Add Store</span>
        </button>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No stores yet</p>
              <p className="text-gray-400">Click "Add Store" to create your first store</p>
            </div>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="card hover:shadow-xl transition-all">
                {/* Store Logo */}
                <div className="flex items-center justify-center h-32 mb-4 bg-gray-50 rounded-lg">
                  {store.logoUrl ? (
                    <img 
                      src={store.logoUrl} 
                      alt={store.name}
                      className="max-w-full max-h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">
                        {store.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-secondary mb-2 line-clamp-1">
                    {store.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {store.description || 'No description'}
                  </p>
                  {store.website && (
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(store)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    <FiEdit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(store.id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <FiTrash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-secondary">
                {editingStore ? 'Edit Store' : 'Add New Store'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Store Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Amazon, Nike, Target"
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
                  placeholder="Brief description of the store..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Logo URL *</label>
                <input
                  type="url"
                  required
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="input-field"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Direct link to the store logo image (PNG, JPG, SVG)
                </p>
                
                {/* Logo Preview */}
                {formData.logoUrl && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center justify-center h-24 bg-white rounded border">
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span style={{display: 'none'}} className="text-red-500 text-sm">
                        Invalid image URL
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="input-field"
                  placeholder="https://www.store.com"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <FiSave size={18} />
                  <span>{editingStore ? 'Update Store' : 'Create Store'}</span>
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

