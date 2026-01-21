import { useState } from 'react';
import { useData } from '../components/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const SubCategories = () => {
  const { subCategories, setSubCategories, categories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ categoryId: '', name: '', status: 'Active' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setSubCategories(subCategories.map(s => s.id === editingId ? { ...formData, id: editingId, categoryId: Number(formData.categoryId) } : s));
    } else {
      setSubCategories([...subCategories, { ...formData, id: Date.now(), categoryId: Number(formData.categoryId) }]);
    }
    closeModal();
  };

  const openModal = (sub = null) => {
    if (sub) {
      setEditingId(sub.id);
      setFormData(sub);
    } else {
      setEditingId(null);
      setFormData({ categoryId: categories[0]?.id || '', name: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    if (window.confirm('Delete this sub-category?')) {
      setSubCategories(subCategories.filter(s => s.id !== id));
    }
  };

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sub Categories</h1>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={18} /> Add Sub Category
        </button>
      </div>

      <div className="table-container">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Sub Category Name</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub) => (
              <tr key={sub.id} className="table-row">
                <td className="p-4 text-gray-600">{getCategoryName(sub.categoryId)}</td>
                <td className="p-4 font-medium">{sub.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(sub)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-800">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Sub Category' : 'Add Sub Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select required className="input-field" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
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

export default SubCategories;