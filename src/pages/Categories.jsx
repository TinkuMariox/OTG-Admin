import { useState } from "react";
import { useData } from "../components/DataContext";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  Box,
} from "lucide-react";

/* Icon mapper */
const iconMap = {
  Cement: Package,
  Steel: Layers,
  Sand: Box,
  Bricks: Box,
};

export default function Categories() {
  const { categories, setCategories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", status: "Active" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setCategories(
        categories.map((c) =>
          c.id === editingId ? { ...formData, id: editingId } : c
        )
      );
    } else {
      setCategories([...categories, { ...formData, id: Date.now() }]);
    }

    closeModal();
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData(category);
    } else {
      setEditingId(null);
      setFormData({ name: "", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">
            {/* Construction material classification */}
          </p>
        </div>

        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || Package;

          return (
            <div
              key={category.id}
              className="group bg-white border rounded-xl p-6 hover:shadow-md transition relative"
            >
              {/* STATUS */}
              <span
                className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full ${
                  category.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {category.status}
              </span>

              {/* ICON */}
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                <Icon size={24} className="text-orange-600" />
              </div>

              {/* NAME */}
              <h3 className="font-semibold text-gray-900 text-lg">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Construction material
              </p>

              {/* ACTIONS */}
              <div className="absolute inset-x-0 bottom-4 px-6 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openModal(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-20">
            No categories added yet
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                className="input-field"
                placeholder="Category name (Cement, Steel...)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <select
                className="input-field"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
