import { useState } from "react";
import { useData } from "../components/DataContext";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

const Vendors = () => {
  const { vendors, setVendors } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    status: "Active",
    material: "Cement",
  });

  /* ---------------- LOGIC ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setVendors(
        vendors.map((v) =>
          v.id === editingId ? { ...formData, id: editingId } : v
        )
      );
    } else {
      setVendors([...vendors, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const openModal = (vendor = null) => {
    if (vendor) {
      setEditingId(vendor.id);
      setFormData(vendor);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        mobile: "",
        email: "",
        address: "",
        status: "Active",
        material: "Cement",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500">
            Construction material suppliers management
          </p>
        </div>

        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={18} /> Add Vendor
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          className="input-field pl-10"
          placeholder="Search vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Material</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    {vendor.address}
                  </p>
                </td>

                <td className="p-4 text-sm">
                  <p>{vendor.email}</p>
                  <p className="text-xs text-gray-500">{vendor.mobile}</p>
                </td>

                <td className="p-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                    {vendor.material}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vendor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>

                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() => openModal(vendor)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Vendor" : "Add Vendor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input-field"
                placeholder="Vendor Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input-field"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  className="input-field"
                  placeholder="Mobile"
                  required
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>

              <textarea
                className="input-field"
                placeholder="Address"
                rows="2"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <select
                className="input-field"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
              >
                <option>Cement</option>
                <option>Steel</option>
                <option>Sand</option>
                <option>Bricks</option>
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
};

export default Vendors;
