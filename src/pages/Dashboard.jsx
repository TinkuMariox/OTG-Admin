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
import {
  dummyDashboardStats,
  dummyVendors,
  dummyMaterials,
} from "../data/dummyData";

export default function Dashboard() {
  /* ---------------- KPIs ---------------- */

  const statCards = [
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Users,
      label: "Active Vendors",
      value: dummyDashboardStats.activeVendors,
      change: "+8.2%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Package,
      label: "Materials in Stock",
      value: dummyDashboardStats.totalMaterials,
      change: "-2.3%",
      trend: "down",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: BarChart3,
      label: "Monthly Revenue",
      value: "₹2.4L",
      change: "+24.5%",
      trend: "up",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  /* ---------------- BUSINESS LOGIC ---------------- */

  const lowStockMaterials = dummyMaterials.filter(
    (m) => m.stock && m.stock < 20
  );

  const pendingOrders = 18;
  const completedOrders = 216;

  const topVendors = dummyVendors.slice(0, 5);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
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

              <p className="text-gray-600 text-sm font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* MIDDLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card title="Weekly Revenue Trend" icon={BarChart3} className="lg:col-span-2">
          <div className="flex items-end justify-between h-48 gap-2">
            {[65, 45, 78, 55, 82, 60, 70].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Admin Actions */}
        <Card title="Admin Actions" icon={AlertTriangle}>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Pending Orders</span>
              <span className="text-yellow-600 font-bold">
                {pendingOrders}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Completed Orders</span>
              <span className="text-green-600 font-bold">
                {completedOrders}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium">Low Stock Items</span>
              <span className="text-red-600 font-bold">
                {lowStockMaterials.length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card title="Top Performing Vendors" icon={Users}>
          <div className="space-y-3">
            {topVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{vendor.name}</p>
                    <p className="text-xs text-gray-500">Reliable Supplier</p>
                  </div>
                </div>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card title="Low Stock Materials" icon={Package}>
          {lowStockMaterials.length > 0 ? (
            <div className="space-y-2">
              {lowStockMaterials.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {m.stock} units
                    </p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={18} />
              <span className="text-sm">All materials sufficiently stocked</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
