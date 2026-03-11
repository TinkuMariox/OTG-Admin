import { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Download,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const DUMMY_TRANSACTIONS = [
  { id: "TXN-784512", booking: "BK-10021", user: "Rajesh Kumar", vendor: "Sharma Traders", material: "TMT Steel Bars", amount: 250000, mode: "UPI", status: "settled", type: "payment", date: "2026-01-15T10:30:00Z", reference: "UPI-REF-98712345" },
  { id: "TXN-784513", booking: "BK-10022", user: "Amit Verma", vendor: "Aggarwal Steel", material: "MS Angle", amount: 780000, mode: "bank_transfer", status: "pending", type: "payment", date: "2026-01-14T14:00:00Z", reference: "NEFT-202601140012" },
  { id: "TXN-784514", booking: "BK-10023", user: "Suresh Patel", vendor: "Rajasthan Minerals", material: "River Sand", amount: 190000, mode: "neft", status: "settled", type: "payment", date: "2026-01-18T09:15:00Z", reference: "NEFT-202601180034" },
  { id: "TXN-784515", booking: "BK-10024", user: "Kapil Sharma", vendor: "Delhi Cement House", material: "OPC Cement 53 Grade", amount: 425000, mode: "rtgs", status: "settled", type: "payment", date: "2026-01-12T16:45:00Z", reference: "RTGS-202601120089" },
  { id: "TXN-784516", booking: "BK-10025", user: "Priya Singh", vendor: "National Pipes Ltd", material: "PVC Pipes 4 inch", amount: 135000, mode: "upi", status: "failed", type: "payment", date: "2026-01-11T11:20:00Z", reference: "UPI-REF-98712399" },
  { id: "TXN-784517", booking: "BK-10022", user: "Amit Verma", vendor: "Aggarwal Steel", material: "MS Angle", amount: 78000, mode: "upi", status: "settled", type: "refund", date: "2026-01-16T08:00:00Z", reference: "UPI-REF-REFUND-001" },
  { id: "TXN-784518", booking: "BK-10026", user: "Deepak Jain", vendor: "Sharma Traders", material: "Binding Wire", amount: 62000, mode: "cash", status: "settled", type: "payment", date: "2026-01-10T13:30:00Z", reference: "CASH-RCV-0010" },
  { id: "TXN-784519", booking: "BK-10027", user: "Mohit Gupta", vendor: "Rajasthan Minerals", material: "Crushed Stone", amount: 340000, mode: "bank_transfer", status: "processing", type: "payment", date: "2026-01-19T17:00:00Z", reference: "NEFT-202601190078" },
  { id: "TXN-784520", booking: "BK-10028", user: "Ankit Tiwari", vendor: "Delhi Cement House", material: "PPC Cement", amount: 580000, mode: "rtgs", status: "settled", type: "payment", date: "2026-01-09T10:00:00Z", reference: "RTGS-202601090021" },
  { id: "TXN-784521", booking: "BK-10029", user: "Vikas Yadav", vendor: "National Pipes Ltd", material: "CPVC Pipes", amount: 215000, mode: "upi", status: "pending", type: "payment", date: "2026-01-20T12:10:00Z", reference: "UPI-REF-98712410" },
];

const STATUS_CONFIG = {
  settled: { label: "Settled", color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: XCircle },
};

const MODE_LABELS = {
  upi: "UPI", bank_transfer: "Bank Transfer", neft: "NEFT", rtgs: "RTGS", cash: "Cash",
};

const formatCurrency = (amt) => `₹${Number(amt).toLocaleString("en-IN")}`;
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const formatDateTime = (d) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Transactions() {
  const [transactions] = useState(DUMMY_TRANSACTIONS);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "", mode: "", type: "", fromDate: "", toDate: "" });

  const filtered = transactions.filter((t) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (![t.id, t.booking, t.user, t.vendor, t.material, t.reference].some((v) => v?.toLowerCase().includes(q))) return false;
    }
    if (filters.status && t.status !== filters.status) return false;
    if (filters.mode && t.mode !== filters.mode) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.fromDate && new Date(t.date) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(t.date) > new Date(filters.toDate + "T23:59:59")) return false;
    return true;
  });

  const totalSettled = filtered.filter((t) => t.status === "settled" && t.type === "payment").reduce((s, t) => s + t.amount, 0);
  const totalPending = filtered.filter((t) => t.status === "pending" || t.status === "processing").reduce((s, t) => s + t.amount, 0);
  const totalRefunds = filtered.filter((t) => t.type === "refund").reduce((s, t) => s + t.amount, 0);
  const totalFailed = filtered.filter((t) => t.status === "failed").reduce((s, t) => s + t.amount, 0);

  const clearFilters = () => setFilters({ search: "", status: "", mode: "", type: "", fromDate: "", toDate: "" });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">Payment & vendor settlement records</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={18} /> Export
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Settled" value={formatCurrency(totalSettled)} icon={<ArrowUpRight size={20} />} color="green" />
        <StatCard label="Pending" value={formatCurrency(totalPending)} icon={<Clock size={20} />} color="yellow" />
        <StatCard label="Refunds" value={formatCurrency(totalRefunds)} icon={<ArrowDownRight size={20} />} color="blue" />
        <StatCard label="Failed" value={formatCurrency(totalFailed)} icon={<XCircle size={20} />} color="red" />
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter size={18} /> Filters
          {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by ID, booking, user, vendor..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="input-field pl-10" />
            </div>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input-field">
              <option value="">All Status</option>
              <option value="settled">Settled</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
            <select value={filters.mode} onChange={(e) => setFilters({ ...filters, mode: e.target.value })} className="input-field">
              <option value="">All Modes</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="neft">NEFT</option>
              <option value="rtgs">RTGS</option>
              <option value="cash">Cash</option>
            </select>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="input-field">
              <option value="">All Types</option>
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
            </select>
            <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="input-field" />
            <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="input-field" />
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-2"><X size={16} /> Clear</button>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Transaction</th>
                <th className="p-4 text-left">User / Vendor</th>
                <th className="p-4 text-left">Material</th>
                <th className="p-4 text-left">Mode</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">No transactions found</td></tr>
              ) : (
                filtered.map((t) => {
                  const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={t.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{t.id}</p>
                        <p className="text-xs text-gray-500">Booking: {t.booking}</p>
                        <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-gray-900">{t.user}</p>
                        <p className="text-xs text-gray-500">{t.vendor}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-700">{t.material}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CreditCard size={14} /> {MODE_LABELS[t.mode] || t.mode}
                        </div>
                      </td>
                      <td className="p-4 text-right font-semibold text-gray-900">{formatCurrency(t.amount)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.type === "refund" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {t.type === "refund" ? "Refund" : "Payment"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                          <StatusIcon size={12} /> {sc.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedTxn(t)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t text-sm text-gray-500">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button onClick={() => setSelectedTxn(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Amount + Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedTxn.amount)}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedTxn.type === "refund" ? "Refund" : "Payment"}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedTxn.status]?.color}`}>
                  {STATUS_CONFIG[selectedTxn.status]?.label}
                </span>
              </div>

              {/* Info Grid */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <InfoRow label="Transaction ID" value={selectedTxn.id} />
                <InfoRow label="Reference" value={selectedTxn.reference} />
                <InfoRow label="Booking" value={selectedTxn.booking} />
                <InfoRow label="Date & Time" value={formatDateTime(selectedTxn.date)} />
                <InfoRow label="Payment Mode" value={MODE_LABELS[selectedTxn.mode] || selectedTxn.mode} />
              </div>

              {/* User & Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="text-sm font-medium">{selectedTxn.user}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Vendor</p>
                  <p className="text-sm font-medium">{selectedTxn.vendor}</p>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Material</p>
                <p className="text-sm font-medium">{selectedTxn.material}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedTxn(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <div className="opacity-80">{icon}</div>
        <div>
          <p className="text-xs font-medium opacity-80">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
