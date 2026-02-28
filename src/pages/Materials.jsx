import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  RotateCcw,
  Image,
  X,
  Trash,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getMaterials,
  getDeletedMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  restoreMaterial,
  permanentDeleteMaterial,
  toggleMaterialStatus,
  getUnits,
  clearMessage,
  clearError,
} from "../store/slices/materialSlice";
import { getCategories } from "../store/slices/categorySlice";
import { getSubCategories } from "../store/slices/subCategorySlice";

export default function Materials() {
  const dispatch = useDispatch();
  const {
    materials,
    deletedMaterials,
    units,
    loading,
    error,
    message,
    pagination,
  } = useSelector((state) => state.materials);
  const { categories } = useSelector((state) => state.categories);
  const { subCategories } = useSelector((state) => state.subCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specs: "",
    brand: "",
    category: "",
    subCategory: "",
    unit: "",
    mrp: "",
    sellingPrice: "",
    gst: "",
    transportation: {
      type: "free",
      charge: "",
    },
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subCategory: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSubCategories());
    dispatch(getUnits());
  }, [dispatch]);

  // Fetch materials with filters
  useEffect(() => {
    const params = { page: 1, limit: 20 };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.subCategory) params.subCategory = filters.subCategory;
    if (filters.status) params.status = filters.status;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    dispatch(getMaterials(params));
  }, [dispatch, filters]);

  // Filter sub-categories when category changes in form
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(
        (sub) =>
          (sub.category?._id || sub.category) === formData.category &&
          sub.status === "active",
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.category, subCategories]);

  // Handle success/error messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [message, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!formData.unit) {
      toast.error("Please select a unit.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("unit", formData.unit);
    formDataToSend.append("status", formData.status);

    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }

    if (formData.specs) {
      formDataToSend.append("specs", formData.specs);
    }

    if (formData.brand) {
      formDataToSend.append("brand", formData.brand);
    }

    if (formData.mrp) {
      formDataToSend.append("mrp", formData.mrp);
    }

    if (formData.sellingPrice) {
      formDataToSend.append("sellingPrice", formData.sellingPrice);
    }

    if (formData.gst) {
      formDataToSend.append("gst", formData.gst);
    }

    if (formData.transportation.type) {
      formDataToSend.append(
        "transportation[type]",
        formData.transportation.type,
      );
      if (
        formData.transportation.type !== "free" &&
        formData.transportation.charge
      ) {
        formDataToSend.append(
          "transportation[charge]",
          formData.transportation.charge,
        );
      }
    }

    if (formData.subCategory) {
      formDataToSend.append("subCategory", formData.subCategory);
    }

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    } else if (!editingId) {
      toast.error("Please select an image for the material.");
      return;
    }

    try {
      if (editingId) {
        await dispatch(
          updateMaterial({ id: editingId, formData: formDataToSend }),
        ).unwrap();
      } else {
        await dispatch(createMaterial(formDataToSend)).unwrap();
      }
      closeModal();
    } catch (err) {
      // Error handled by redux
    }
  };

  const openModal = (material = null) => {
    if (material) {
      setEditingId(material._id);
      setFormData({
        name: material.name,
        description: material.description || "",
        specs: material.specs || "",
        brand: material.brand || "",
        category: material.category?._id || material.category,
        subCategory: material.subCategory?._id || material.subCategory || "",
        unit: material.unit,
        mrp: material.mrp || "",
        sellingPrice: material.sellingPrice || "",
        gst: material.gst || "",
        transportation: {
          type: material.transportation?.type || "free",
          charge: material.transportation?.charge || "",
        },
        status: material.status,
      });
      setImagePreview(material.image);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        specs: "",
        brand: "",
        category: "",
        subCategory: "",
        unit: "",
        mrp: "",
        sellingPrice: "",
        gst: "",
        transportation: {
          type: "free",
          charge: "",
        },
        status: "active",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      specs: "",
      brand: "",
      category: "",
      subCategory: "",
      unit: "",
      mrp: "",
      sellingPrice: "",
      gst: "",
      transportation: {
        type: "free",
        charge: "",
      },
      status: "active",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this material?")) {
      await dispatch(deleteMaterial(id));
    }
  };

  const handleToggleStatus = async (id) => {
    await dispatch(toggleMaterialStatus(id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Deleted materials modal handlers
  const openDeletedModal = () => {
    dispatch(getDeletedMaterials());
    setIsDeletedModalOpen(true);
  };

  const handleRestore = async (id) => {
    await dispatch(restoreMaterial(id));
  };

  const handlePermanentDelete = async (id) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this material? This action cannot be undone.",
      )
    ) {
      await dispatch(permanentDeleteMaterial(id));
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      subCategory: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
  };

  const getCategoryName = (material) => {
    if (material.category?.name) {
      return material.category.name;
    }
    const cat = categories.find((c) => c._id === material.category);
    return cat?.name || "-";
  };

  const getSubCategoryName = (material) => {
    if (!material.subCategory) return "-";
    if (material.subCategory?.name) {
      return material.subCategory.name;
    }
    const sub = subCategories.find((s) => s._id === material.subCategory);
    return sub?.name || "-";
  };

  // Get filtered sub-categories for filter dropdown
  const filterSubCategories = filters.category
    ? subCategories.filter(
        (sub) => (sub.category?._id || sub.category) === filters.category,
      )
    : subCategories;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="text-sm text-gray-500">Manage construction materials</p>
        </div>

        <div className="flex gap-3">
          <button onClick={openDeletedModal} className="btn-secondary">
            <Trash size={18} /> Deleted
          </button>
          <button onClick={() => openModal()} className="btn-primary">
            <Plus size={18} /> Add Material
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 text-gray-700 font-medium"
        >
          <Filter size={18} />
          Filters
          {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input-field pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                  subCategory: "",
                })
              }
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sub-Category Filter */}
            <select
              value={filters.subCategory}
              onChange={(e) =>
                setFilters({ ...filters, subCategory: e.target.value })
              }
              className="input-field"
              disabled={!filters.category}
            >
              <option value="">All Sub-Categories</option>
              {filterSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* From Date */}
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
              className="input-field"
              placeholder="From Date"
            />
          </div>
        )}

        {isFilterOpen && (
          <div className="mt-4 flex justify-between items-center">
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
              className="input-field w-48"
              placeholder="To Date"
            />
            <button onClick={clearFilters} className="btn-secondary text-sm">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && materials.length === 0 && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Image</th>
              <th className="text-left p-4 font-medium text-gray-600">
                Material
              </th>
              <th className="text-left p-4 font-medium text-gray-600">
                Category
              </th>
              <th className="text-left p-4 font-medium text-gray-600">Brand</th>
              <th className="text-left p-4 font-medium text-gray-600">Unit</th>
              <th className="text-left p-4 font-medium text-gray-600">
                MRP / Price
              </th>
              <th className="text-left p-4 font-medium text-gray-600">
                Status
              </th>
              <th className="text-right p-4 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr
                key={material._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {material.image ? (
                      <img
                        src={material.image}
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {material.name}
                  </div>
                  {material.specs && (
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {material.specs}
                    </div>
                  )}
                </td>
                <td className="p-4 text-gray-600">
                  {getCategoryName(material)}
                </td>
                <td className="p-4 text-gray-600">{material.brand || "-"}</td>
                <td className="p-4 text-gray-600">{material.unit}</td>
                <td className="p-4">
                  {material.mrp ? (
                    <div>
                      <div className="text-xs text-gray-400 line-through">
                        ₹{material.mrp}
                      </div>
                      <div className="text-sm font-medium text-green-700">
                        ₹{material.sellingPrice || material.mrp}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(material._id)}
                    className={`text-xs px-3 py-1 rounded-full cursor-pointer transition ${
                      material.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {material.status === "active" ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(material)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && materials.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-20">
                  No materials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Material" : "Add Material"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {!editingId && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition"
                    >
                      <Image size={40} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max 5MB (JPEG, PNG, GIF, WebP)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subCategory: "",
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Select (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    className="input-field"
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategory: e.target.value })
                    }
                    disabled={!formData.category}
                  >
                    <option value="">None</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="input-field"
                    placeholder="Enter material name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Unit Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specs <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Enter material specifications"
                    value={formData.specs}
                    onChange={(e) =>
                      setFormData({ ...formData, specs: e.target.value })
                    }
                  ></textarea>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    className="input-field"
                    placeholder="Enter brand name"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </div>

                {/* GST */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST % <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="input-field"
                    placeholder="e.g., 18"
                    value={formData.gst}
                    onChange={(e) =>
                      setFormData({ ...formData, gst: e.target.value })
                    }
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP (₹) <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="Enter MRP"
                    value={formData.mrp}
                    onChange={(e) =>
                      setFormData({ ...formData, mrp: e.target.value })
                    }
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (₹){" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="Enter selling price"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, sellingPrice: e.target.value })
                    }
                  />
                </div>

                {/* Transportation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transportation
                  </label>
                  <select
                    className="input-field"
                    value={formData.transportation.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transportation: {
                          ...formData.transportation,
                          type: e.target.value,
                          charge:
                            e.target.value === "free"
                              ? ""
                              : formData.transportation.charge,
                        },
                      })
                    }
                  >
                    <option value="free">Free</option>
                    <option value="per_km">Per KM</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                {/* Transportation Charge */}
                {formData.transportation.type !== "free" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transport Charge (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder={
                        formData.transportation.type === "per_km"
                          ? "₹ per km"
                          : "Fixed amount"
                      }
                      value={formData.transportation.charge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transportation: {
                            ...formData.transportation,
                            charge: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETED MATERIALS MODAL */}
      {isDeletedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Deleted Materials</h2>
              <button
                onClick={() => setIsDeletedModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {loading && deletedMaterials.length === 0 ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : deletedMaterials.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No deleted materials
              </div>
            ) : (
              <div className="space-y-4">
                {deletedMaterials.map((material) => (
                  <div
                    key={material._id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {material.image ? (
                          <img
                            src={material.image}
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {material.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Category: {getCategoryName(material)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Deleted on:{" "}
                          {new Date(material.deletedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(material._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                        title="Restore"
                      >
                        <RotateCcw size={16} />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(material._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
