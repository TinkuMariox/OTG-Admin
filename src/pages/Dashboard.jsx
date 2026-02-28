import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Star,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import Card from "../components/ui/Card";
import api from "../services/api";

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [topMaterials, setTopMaterials] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, materialsRes, vendorsRes] = await Promise.all([
        api.get("/bookings/stats/dashboard"),
        api.get("/bookings/stats/top-materials"),
        api.get("/bookings/stats/top-vendors"),
      ]);

      setDashboardStats(statsRes.data.data);
      setTopMaterials(materialsRes.data.data);
      setTopVendors(vendorsRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardStats({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        today: {
          todayOrders: 0,
          todayPending: 0,
          todayCompleted: 0,
          todayRevenue: 0,
        },
      });
      setTopMaterials([]);
      setTopVendors([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- KPIs ---------------- */

  const statCards = [
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: dashboardStats?.totalOrders || 0,
      change: "",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Package,
      label: "Today's Pending",
      value: dashboardStats?.today?.todayPending || 0,
      change: `${dashboardStats?.today?.todayOrders || 0} today`,
      trend: "up",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: CheckCircle,
      label: "Completed Orders",
      value: dashboardStats?.deliveredOrders || 0,
      change: `${dashboardStats?.today?.todayCompleted || 0} today`,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      label: "Total Revenue",
      value: `₹${(dashboardStats?.totalRevenue || 0).toLocaleString()}`,
      change: `₹${(dashboardStats?.today?.todayRevenue || 0).toLocaleString()} today`,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const pendingOrders = dashboardStats?.pendingOrders || 0;
  const completedOrders = dashboardStats?.deliveredOrders || 0;

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          const trendColor =
            stat.trend === "up" ? "text-green-600" : "text-red-600";

          return (
            <Card key={idx} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}
                >
                  <TrendIcon size={16} />
                  {stat.change}
                </div>
              </div>

              <p className="mb-2 text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* MIDDLE GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card
          title="Weekly Revenue Trend"
          icon={BarChart3}
          className="lg:col-span-2"
        >
          <div className="flex items-end justify-between h-48 gap-2">
            {[65, 45, 78, 55, 82, 60, 70].map((height, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center flex-1 gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-orange-400"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Status */}
        <Card title="Order Status" icon={AlertTriangle}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
              <span className="text-sm font-medium">Pending Orders</span>
              <span className="font-bold text-yellow-600">{pendingOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span className="text-sm font-medium">Completed Orders</span>
              <span className="font-bold text-green-600">
                {completedOrders}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="font-bold text-orange-600">
                ₹{(dashboardStats?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top 5 Materials */}
        <Card title="Top 5 Materials" icon={Package}>
          {topMaterials && topMaterials.length > 0 ? (
            <div className="space-y-3">
              {topMaterials.map((material, idx) => (
                <div
                  key={material._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-orange-500 rounded-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {material.materialName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Orders: {material.count} | Qty: {material.totalQuantity}{" "}
                        {material.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">
                      ₹{(material.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <Package size={18} />
              <span className="text-sm">No materials data available</span>
            </div>
          )}
        </Card>

        {/* Top Vendors */}
        <Card title="Top Performing Vendors" icon={Users}>
          {topVendors && topVendors.length > 0 ? (
            <div className="space-y-3">
              {topVendors.map((vendor, idx) => (
                <div
                  key={vendor._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-orange-500 rounded-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vendor.vendorName}</p>
                      <p className="text-xs text-gray-500">
                        Orders: {vendor.count} | Revenue: ₹
                        {(vendor.totalRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={18} />
              <span className="text-sm">No vendor data available</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
