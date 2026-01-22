import { useState } from "react";
import {
  Trash2,
  ShieldCheck,
  User as UserIcon,
  Power,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Super Admin",
      email: "admin@test.com",
      role: "Admin",
      status: "Active",
      lastActive: "10 mins ago",
      risk: "Trusted",
    },
    {
      id: 2,
      name: "Site Manager",
      email: "manager@test.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago",
      risk: "Trusted",
    },
    {
      id: 3,
      name: "Rajat Builder",
      email: "customer@test.com",
      role: "Customer",
      status: "Active",
      lastActive: "Yesterday",
      risk: "High Value",
    },
    {
      id: 4,
      name: "Blocked Contractor",
      email: "blocked@test.com",
      role: "Customer",
      status: "Blocked",
      lastActive: "7 days ago",
      risk: "Payment Issue",
    },
  ]);

  /* ---------------- LOGIC ---------------- */

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Blocked" : "Active",
            }
          : u
      )
    );
  };

  /* ---------------- STATS ---------------- */

  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const customers = users.filter((u) => u.role === "Customer").length;
  const blocked = users.filter((u) => u.status === "Blocked").length;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Users" value={totalUsers} />
        <SummaryCard label="Admins" value={admins} />
        <SummaryCard label="Customers" value={customers} />
        <SummaryCard label="Blocked Users" value={blocked} danger />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Last Activity</th>
              <th className="p-4 text-left">Risk</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  {u.role === "Admin" ? (
                    <ShieldCheck className="text-orange-500" size={18} />
                  ) : (
                    <UserIcon className="text-gray-400" size={18} />
                  )}
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                    {u.role}
                  </span>
                </td>

                <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                  <Clock size={14} />
                  {u.lastActive}
                </td>

                <td className="p-4">
                  <RiskBadge type={u.risk} />
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      u.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {u.status}
                  </button>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="text-gray-500 hover:text-orange-600"
                  >
                    <Power size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SummaryCard({ label, value, danger }) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        danger ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-bold ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function RiskBadge({ type }) {
  if (type === "Trusted")
    return (
      <span className="flex items-center gap-1 text-green-600 text-xs">
        <CheckCircle size={14} /> Trusted
      </span>
    );

  if (type === "High Value")
    return (
      <span className="flex items-center gap-1 text-orange-600 text-xs">
        <AlertTriangle size={14} /> High Value
      </span>
    );

  return (
    <span className="flex items-center gap-1 text-red-600 text-xs">
      <AlertTriangle size={14} /> Payment Issue
    </span>
  );
}
