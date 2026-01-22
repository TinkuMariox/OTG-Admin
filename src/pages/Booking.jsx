import { MapPin } from "lucide-react";

const bookings = [
  {
    id: "BK-10021",
    site: "DLF Phase 3, Gurgaon",
    material: "Cement",
    quantity: "500 Bags",
    vendor: "Sharma Traders",
    amount: "₹2,50,000",
    status: "In Transit",
    payment: "Paid",
    date: "15 Jan 2026",
  },
  {
    id: "BK-10022",
    site: "Noida Extension – Tower B",
    material: "Steel",
    quantity: "10 Tons",
    vendor: "Aggarwal Steel",
    amount: "₹7,80,000",
    status: "Delivered",
    payment: "Pending",
    date: "13 Jan 2026",
  },
  {
    id: "BK-10023",
    site: "Dwarka Expressway",
    material: "Sand",
    quantity: "25 Truckloads",
    vendor: "Rajasthan Minerals",
    amount: "₹1,90,000",
    status: "Scheduled",
    payment: "Advance Paid",
    date: "18 Jan 2026",
  },
];

export default function Bookings() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="w-1/4 p-4 text-left">Booking</th>
            <th className="w-1/4 p-4 text-left">Material</th>
            <th className="w-1/4 p-4 text-left">Vendor</th>
            <th className="w-1/6 p-4 text-right">Amount</th>
            <th className="w-1/6 p-4 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t hover:bg-gray-50">
              <td className="p-4">
                <p className="font-medium text-gray-900">{b.id}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {b.site}
                </p>
                <p className="text-xs text-gray-400">{b.date}</p>
              </td>

              <td className="p-4 text-sm">
                <p>{b.material}</p>
                <p className="text-xs text-gray-500">{b.quantity}</p>
              </td>

              <td className="p-4 text-sm">{b.vendor}</td>

              <td className="p-4 text-right font-semibold">{b.amount}</td>

              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    b.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : b.status === "In Transit"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {b.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Payment: {b.payment}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
