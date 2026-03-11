import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Check,
  Eye,
  Users,
  Lock,
  Unlock,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

const MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "User Management" },
  { key: "vendors", label: "Vendor Management" },
  { key: "materials", label: "Material Management" },
  { key: "categories", label: "Categories" },
  { key: "bookings", label: "Bookings" },
  { key: "transactions", label: "Transactions" },
  { key: "staff", label: "Staff Management" },
  { key: "roles", label: "Roles & Permissions" },
  { key: "cms", label: "CMS" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

const PERMISSIONS = ["view", "create", "edit", "delete", "export"];

const buildPerms = (defaults) => {
  const perms = {};
  MODULES.forEach((m) => {
    perms[m.key] = {};
    PERMISSIONS.forEach((p) => {
      perms[m.key][p] = defaults ? defaults[m.key]?.[p] ?? false : false;
    });
  });
  return perms;
};

const allTrue = () => {
  const perms = {};
  MODULES.forEach((m) => {
    perms[m.key] = {};
    PERMISSIONS.forEach((p) => { perms[m.key][p] = true; });
  });
  return perms;
};

const DUMMY_ROLES = [
  { id: "ROLE-001", name: "Super Admin", description: "Full access to all modules and features", staffCount: 1, isSystem: true, status: "active", createdAt: "2024-06-01", permissions: allTrue() },
  { id: "ROLE-002", name: "Operations Manager", description: "Manage bookings, vendors, and logistics", staffCount: 2, isSystem: false, status: "active", createdAt: "2024-08-01", permissions: buildPerms({ dashboard: { view: true }, users: { view: true }, vendors: { view: true, create: true, edit: true, delete: false, export: true }, materials: { view: true, create: true, edit: true, delete: false, export: true }, categories: { view: true, create: true, edit: true, delete: false, export: false }, bookings: { view: true, create: true, edit: true, delete: false, export: true }, transactions: { view: true, export: true }, staff: { view: true }, roles: {}, cms: {}, reports: { view: true, export: true }, settings: { view: true } }) },
  { id: "ROLE-003", name: "Sales Executive", description: "View and manage material bookings and customer interactions", staffCount: 2, isSystem: false, status: "active", createdAt: "2024-09-01", permissions: buildPerms({ dashboard: { view: true }, users: { view: true }, vendors: { view: true }, materials: { view: true }, bookings: { view: true, create: true, edit: true, export: true }, transactions: { view: true }, reports: { view: true } }) },
  { id: "ROLE-004", name: "Support Agent", description: "Handle customer queries and booking issues", staffCount: 1, isSystem: false, status: "active", createdAt: "2024-10-01", permissions: buildPerms({ dashboard: { view: true }, users: { view: true, edit: true }, bookings: { view: true, edit: true }, transactions: { view: true } }) },
  { id: "ROLE-005", name: "Finance Manager", description: "Manage transactions, settlements, and financial reports", staffCount: 1, isSystem: false, status: "active", createdAt: "2024-07-01", permissions: buildPerms({ dashboard: { view: true }, transactions: { view: true, create: true, edit: true, export: true }, bookings: { view: true, export: true }, reports: { view: true, export: true }, settings: { view: true, edit: true } }) },
  { id: "ROLE-006", name: "Logistics Head", description: "Track deliveries and manage vendor logistics", staffCount: 1, isSystem: false, status: "active", createdAt: "2024-11-01", permissions: buildPerms({ dashboard: { view: true }, vendors: { view: true, edit: true }, bookings: { view: true, create: true, edit: true, export: true }, materials: { view: true }, reports: { view: true, export: true } }) },
  { id: "ROLE-007", name: "Viewer", description: "Read-only access across all modules", staffCount: 0, isSystem: false, status: "inactive", createdAt: "2025-01-01", permissions: buildPerms({ dashboard: { view: true }, users: { view: true }, vendors: { view: true }, materials: { view: true }, categories: { view: true }, bookings: { view: true }, transactions: { view: true }, staff: { view: true }, roles: { view: true }, cms: { view: true }, reports: { view: true }, settings: { view: true } }) },
];

const emptyRoleForm = { name: "", description: "", status: "active", permissions: buildPerms() };

export default function Roles() {
  const [roles, setRoles] = useState(DUMMY_ROLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState(emptyRoleForm);

  const openAddModal = () => {
    setEditingRole(null);
    setFormData({ ...emptyRoleForm, permissions: buildPerms() });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description, status: role.status, permissions: JSON.parse(JSON.stringify(role.permissions)) });
    setIsModalOpen(true);
  };

  const openDuplicate = (role) => {
    setEditingRole(null);
    setFormData({ name: `${role.name} (Copy)`, description: role.description, status: "active", permissions: JSON.parse(JSON.stringify(role.permissions)) });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingRole(null); setFormData(emptyRoleForm); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Role name is required"); return; }
    if (editingRole) {
      setRoles((prev) => prev.map((r) => r.id === editingRole.id ? { ...r, name: formData.name, description: formData.description, status: formData.status, permissions: formData.permissions } : r));
      toast.success("Role updated successfully");
    } else {
      const newRole = {
        id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        permissions: formData.permissions,
        staffCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles((prev) => [...prev, newRole]);
      toast.success("Role created successfully");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setIsDeleteConfirm(null);
    toast.success("Role deleted successfully");
  };

  const togglePermission = (moduleKey, permKey) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: { ...prev.permissions[moduleKey], [permKey]: !prev.permissions[moduleKey][permKey] },
      },
    }));
  };

  const toggleModuleAll = (moduleKey) => {
    const allOn = PERMISSIONS.every((p) => formData.permissions[moduleKey][p]);
    const newPerms = { ...formData.permissions };
    newPerms[moduleKey] = {};
    PERMISSIONS.forEach((p) => { newPerms[moduleKey][p] = !allOn; });
    setFormData({ ...formData, permissions: newPerms });
  };

  const toggleAllPermissions = (grant) => {
    const newPerms = {};
    MODULES.forEach((m) => { newPerms[m.key] = {}; PERMISSIONS.forEach((p) => { newPerms[m.key][p] = grant; }); });
    setFormData({ ...formData, permissions: newPerms });
  };

  const countPermissions = (perms) => {
    let count = 0;
    Object.values(perms).forEach((mod) => { Object.values(mod).forEach((v) => { if (v) count++; }); });
    return count;
  };

  const totalPermissions = MODULES.length * PERMISSIONS.length;

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500">Define roles and assign granular permissions per module</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Role
        </button>
      </div>

      {/* ROLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const permCount = countPermissions(role.permissions);
          return (
            <div key={role.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.isSystem ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"}`}>
                    {role.isSystem ? <ShieldAlert size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.id}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {role.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{role.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Users size={12} /> {role.staffCount} staff</span>
                <span className="flex items-center gap-1"><Lock size={12} /> {permCount}/{totalPermissions} permissions</span>
              </div>

              {/* Permission progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${(permCount / totalPermissions) * 100}%` }} />
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setSelectedRole(role); setIsViewOpen(true); }} className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"><Eye size={14} /> View</button>
                {!role.isSystem && (
                  <button onClick={() => openEditModal(role)} className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"><Edit2 size={14} /> Edit</button>
                )}
                <button onClick={() => openDuplicate(role)} className="btn-secondary text-xs py-2 px-2" title="Duplicate"><Copy size={14} /></button>
                {!role.isSystem && (
                  <button onClick={() => setIsDeleteConfirm(role.id)} className="btn-secondary text-xs py-2 px-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE/EDIT ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingRole ? "Edit Role" : "Create Role"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g. Sales Manager" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={2} placeholder="Brief description of this role" />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => toggleAllPermissions(true)} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-1">
                      <Unlock size={12} /> Grant All
                    </button>
                    <button type="button" onClick={() => toggleAllPermissions(false)} className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-1">
                      <Lock size={12} /> Revoke All
                    </button>
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium text-gray-600 w-1/3">Module</th>
                        {PERMISSIONS.map((p) => (
                          <th key={p} className="p-3 text-center text-sm font-medium text-gray-600 capitalize">{p}</th>
                        ))}
                        <th className="p-3 text-center text-sm font-medium text-gray-600">All</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES.map((mod) => {
                        const allOn = PERMISSIONS.every((p) => formData.permissions[mod.key]?.[p]);
                        return (
                          <tr key={mod.key} className="border-t hover:bg-gray-50">
                            <td className="p-3 text-sm font-medium text-gray-800">{mod.label}</td>
                            {PERMISSIONS.map((p) => (
                              <td key={p} className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => togglePermission(mod.key, p)}
                                  className={`w-7 h-7 rounded-md flex items-center justify-center transition ${
                                    formData.permissions[mod.key]?.[p]
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                >
                                  <Check size={14} />
                                </button>
                              </td>
                            ))}
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleModuleAll(mod.key)}
                                className={`w-7 h-7 rounded-md flex items-center justify-center mx-auto transition ${
                                  allOn
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }`}
                              >
                                <ShieldCheck size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {countPermissions(formData.permissions)} of {totalPermissions} permissions granted
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingRole ? "Update Role" : "Create Role"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ROLE MODAL */}
      {isViewOpen && selectedRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedRole.isSystem ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"}`}>
                  {selectedRole.isSystem ? <ShieldAlert size={20} /> : <Shield size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedRole.name}</h2>
                  <p className="text-sm text-gray-500">{selectedRole.description}</p>
                </div>
              </div>
              <button onClick={() => { setIsViewOpen(false); setSelectedRole(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-6 text-sm">
                <span className="flex items-center gap-1 text-gray-600"><Users size={14} /> {selectedRole.staffCount} staff assigned</span>
                <span className="flex items-center gap-1 text-gray-600"><Lock size={14} /> {countPermissions(selectedRole.permissions)}/{totalPermissions} permissions</span>
                <span className="flex items-center gap-1 text-gray-600">Created: {formatDate(selectedRole.createdAt)}</span>
                {selectedRole.isSystem && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">System Role</span>}
              </div>

              <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Module</th>
                      {PERMISSIONS.map((p) => (
                        <th key={p} className="p-3 text-center text-sm font-medium text-gray-600 capitalize">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((mod) => (
                      <tr key={mod.key} className="border-t">
                        <td className="p-3 text-sm font-medium text-gray-800">{mod.label}</td>
                        {PERMISSIONS.map((p) => (
                          <td key={p} className="p-3 text-center">
                            {selectedRole.permissions[mod.key]?.[p] ? (
                              <span className="inline-flex w-6 h-6 bg-green-100 text-green-600 rounded-full items-center justify-center"><Check size={14} /></span>
                            ) : (
                              <span className="inline-flex w-6 h-6 bg-gray-50 text-gray-300 rounded-full items-center justify-center"><X size={14} /></span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                {!selectedRole.isSystem && (
                  <button onClick={() => { setIsViewOpen(false); openEditModal(selectedRole); }} className="btn-primary flex items-center gap-2"><Edit2 size={16} /> Edit Role</button>
                )}
                <button onClick={() => { setIsViewOpen(false); setSelectedRole(null); }} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {isDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
            <p className="text-sm text-gray-500 mb-6">This role will be permanently deleted. Staff assigned to this role will need reassignment.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(isDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
