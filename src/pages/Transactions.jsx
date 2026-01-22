import { CreditCard } from "lucide-react";

const transactions = [
  {
    id: "TXN-784512",
    booking: "BK-10021",
    vendor: "Sharma Traders",
    amount: "₹2,50,000",
    mode: "UPI",
    status: "Settled",
    date: "15 Jan 2026",
  },
  {
    id: "TXN-784513",
    booking: "BK-10022",
    vendor: "Aggarwal Steel",
    amount: "₹7,80,000",
    mode: "Bank Transfer",
    status: "Pending",
    date: "14 Jan 2026",
  },
  {
    id: "TXN-784514",
    booking: "BK-10023",
    vendor: "Rajasthan Minerals",
    amount: "₹1,90,000",
    mode: "NEFT",
    status: "Settled",
    date: "18 Jan 2026",
  },
];

export default function Transactions() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500">
          Payment & vendor settlement records
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="w-1/4 p-4 text-left">Transaction</th>
              <th className="w-1/4 p-4 text-left">Vendor</th>
              <th className="w-1/4 p-4 text-left">Mode</th>
              <th className="w-1/6 p-4 text-right">Amount</th>
              <th className="w-1/6 p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-medium text-gray-900">{t.id}</p>
                  <p className="text-xs text-gray-500">
                    Booking: {t.booking}
                  </p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </td>

                <td className="p-4 text-sm">{t.vendor}</td>

                <td className="p-4 flex items-center gap-2 text-sm">
                  <CreditCard size={16} />
                  {t.mode}
                </td>

                <td className="p-4 text-right font-semibold">{t.amount}</td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      t.status === "Settled"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
