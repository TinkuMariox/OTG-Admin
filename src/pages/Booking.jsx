import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  MapPin,
  Package,
  Truck,
  User,
  Store,
  Calendar,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getBookings,
  updateBookingStatus,
  clearMessage,
  clearError,
} from "../store/slices/bookingSlice";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "in_transit",
    label: "In Transit",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

const PAYMENT_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "partial",
    label: "Partial",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
];

const getStatusConfig = (status) =>
  STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

const getPaymentConfig = (status) =>
  PAYMENT_OPTIONS.find((s) => s.value === status) || PAYMENT_OPTIONS[0];

export default function Bookings() {
  const dispatch = useDispatch();
  const { bookings, loading, error, message, pagination } = useSelector(
    (state) => state.bookings,
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch bookings with filters
  useEffect(() => {
    const params = { page: 1, limit: 50 };
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    dispatch(getBookings(params));
  }, [dispatch, filters]);

  // Handle toast messages
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

  const handleStatusChange = async (bookingId, newStatus) => {
    await dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
  };

  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    await dispatch(
      updateBookingStatus({ id: bookingId, paymentStatus: newPaymentStatus }),
    );
  };

  const clearFilters = () => {
    setFilters({ status: "", paymentStatus: "", fromDate: "", toDate: "" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500">
            Manage orders and track deliveries
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-900">
            {pagination?.total || bookings.length}
          </span>{" "}
          bookings
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="input-field"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Payment Status Filter */}
            <select
              value={filters.paymentStatus}
              onChange={(e) =>
                setFilters({ ...filters, paymentStatus: e.target.value })
              }
              className="input-field"
            >
              <option value="">All Payment Status</option>
              {PAYMENT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* From Date */}
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
              className="input-field"
            />

            {/* To Date */}
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
              className="input-field"
            />
          </div>
        )}

        {isFilterOpen && (
          <div className="mt-3 flex justify-end">
            <button onClick={clearFilters} className="btn-secondary text-sm">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && bookings.length === 0 && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">
                Booking
              </th>
              <th className="text-left p-4 font-medium text-gray-600">
                Material
              </th>
              <th className="text-left p-4 font-medium text-gray-600">
                Vendor
              </th>
              <th className="text-left p-4 font-medium text-gray-600">User</th>
              <th className="text-right p-4 font-medium text-gray-600">
                Amount
              </th>
              <th className="text-center p-4 font-medium text-gray-600">
                Status
              </th>
              <th className="text-center p-4 font-medium text-gray-600">
                Payment
              </th>
              <th className="text-center p-4 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const statusCfg = getStatusConfig(booking.status);
              const paymentCfg = getPaymentConfig(booking.paymentStatus);

              return (
                <tr
                  key={booking._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Booking ID + Site */}
                  <td className="p-4">
                    <p className="font-medium text-gray-900">
                      {booking.bookingId}
                    </p>
                    {booking.site && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {booking.site}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(booking.createdAt)}
                    </p>
                  </td>

                  {/* Material */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {booking.material?.image ? (
                        <img
                          src={booking.material.image}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <Package size={18} className="text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {booking.material?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.quantity}{" "}
                          {booking.unit || booking.material?.unit}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Vendor */}
                  <td className="p-4">
                    <p className="text-sm">{booking.vendor?.name || "-"}</p>
                    {booking.vendor?.mobile && (
                      <p className="text-xs text-gray-500">
                        {booking.vendor.mobile}
                      </p>
                    )}
                  </td>

                  {/* User */}
                  <td className="p-4">
                    <p className="text-sm">{booking.user?.name || "-"}</p>
                    {booking.user?.mobile && (
                      <p className="text-xs text-gray-500">
                        {booking.user.mobile}
                      </p>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="p-4 text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      @ {formatCurrency(booking.price)}/
                      {booking.unit || booking.material?.unit}
                    </p>
                  </td>

                  {/* Order Status Dropdown */}
                  <td className="p-4 text-center">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer font-medium ${statusCfg.color}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Payment Status Dropdown */}
                  <td className="p-4 text-center">
                    <select
                      value={booking.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(booking._id, e.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer font-medium ${paymentCfg.color}`}
                    >
                      {PAYMENT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-20">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Booking: {selectedBooking.bookingId}
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Order Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedBooking.status).color}`}
                  >
                    {getStatusConfig(selectedBooking.status).label}
                  </span>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Payment Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentConfig(selectedBooking.paymentStatus).color}`}
                  >
                    {getPaymentConfig(selectedBooking.paymentStatus).label}
                  </span>
                </div>
              </div>

              {/* Material Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package size={16} /> Material Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Material:</span>{" "}
                    <span className="font-medium">
                      {selectedBooking.material?.name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity:</span>{" "}
                    <span className="font-medium">
                      {selectedBooking.quantity}{" "}
                      {selectedBooking.unit || selectedBooking.material?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Unit Price:</span>{" "}
                    <span className="font-medium">
                      {formatCurrency(selectedBooking.price)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Amount:</span>{" "}
                    <span className="font-bold text-green-700">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor & User */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Store size={16} /> Vendor
                  </h3>
                  <p className="text-sm font-medium">
                    {selectedBooking.vendor?.name || "-"}
                  </p>
                  {selectedBooking.vendor?.mobile && (
                    <p className="text-xs text-gray-500 mt-1">
                      📞 {selectedBooking.vendor.mobile}
                    </p>
                  )}
                  {selectedBooking.vendor?.email && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ✉️ {selectedBooking.vendor.email}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User size={16} /> Customer
                  </h3>
                  <p className="text-sm font-medium">
                    {selectedBooking.user?.name || "-"}
                  </p>
                  {selectedBooking.user?.mobile && (
                    <p className="text-xs text-gray-500 mt-1">
                      📞 {selectedBooking.user.mobile}
                    </p>
                  )}
                  {selectedBooking.user?.email && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ✉️ {selectedBooking.user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Extra Info */}
              {(selectedBooking.site || selectedBooking.notes) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedBooking.site && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Site: </span>
                      <span className="text-sm font-medium">
                        {selectedBooking.site}
                      </span>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <span className="text-sm text-gray-500">Notes: </span>
                      <span className="text-sm">{selectedBooking.notes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>Created: {formatDate(selectedBooking.createdAt)}</span>
                {selectedBooking.updatedAt &&
                  selectedBooking.updatedAt !== selectedBooking.createdAt && (
                    <span>
                      | Updated: {formatDate(selectedBooking.updatedAt)}
                    </span>
                  )}
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t">
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
