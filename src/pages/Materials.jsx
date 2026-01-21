import { useState, useEffect } from 'react';
import { useData } from '../components/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';


const Materials = () => {
  const { materials, setMaterials, categories, subCategories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    categoryId: '', subCategoryId: '', name: '', unit: '', price: '', description: '', status: 'Active' 
  });
  const [filteredSubs, setFilteredSubs] = useState([]);

  useEffect(() => {
    if (formData.categoryId) {
      setFilteredSubs(subCategories.filter(s => s.categoryId === Number(formData.categoryId)));
    } else {
      setFilteredSubs([]);
    }
  }, [formData.categoryId, subCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      categoryId: Number(formData.categoryId),
      subCategoryId: Number(formData.subCategoryId),
      price: Number(formData.price)
    };

    if (editingId) {
      setMaterials(materials.map(m => m.id === editingId ? { ...payload, id: editingId } : m));
    } else {
      setMaterials([...materials, { ...payload, id: Date.now() }]);
    }
    closeModal();
  };

  const openModal = (material = null) => {
    if (material) {
      setEditingId(material.id);
      setFormData(material);
    } else {
      setEditingId(null);
      setFormData({ categoryId: '', subCategoryId: '', name: '', unit: '', price: '', description: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    if (window.confirm('Delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '-';
  const getSubCategoryName = (id) => subCategories.find(s => s.id === id)?.name || '-';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Materials</h1>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={18} /> Add Material
        </button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="p-4">Material</th>
              <th className="p-4">Category / Sub</th>
              <th className="p-4">Unit / Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} className="table-row">
                <td className="p-4">
                  <div className="font-medium">{material.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{material.description}</div>
                </td>
                <td className="p-4 text-sm">
                  <div className="text-gray-900">{getCategoryName(material.categoryId)}</div>
                  <div className="text-gray-500">{getSubCategoryName(material.subCategoryId)}</div>
                </td>
                <td className="p-4 text-sm">
                  <div>{material.unit}</div>
                  <div className="font-semibold">₹{material.price}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    material.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {material.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(material)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(material.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Material' : 'Add Material'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select required className="input-field" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value, subCategoryId: ''})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sub Category</label>
                <select required className="input-field" value={formData.subCategoryId} onChange={e => setFormData({...formData, subCategoryId: e.target.value})} disabled={!formData.categoryId}>
                  <option value="">Select Sub Category</option>
                  {filteredSubs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Material Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <input required type="text" className="input-field" placeholder="e.g. Bag, Kg" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input required type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input-field" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;