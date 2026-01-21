import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Star,
} from 'lucide-react';

import Card from '../components/ui/Card';
import { dummyDashboardStats, dummyVendors, dummyMaterials } from '../data/dummyData';

export default function Dashboard() {
  const statCards = [
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Users,
      label: 'Active Vendors',
      value: dummyDashboardStats.activeVendors,
      change: '+8.2%',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Package,
      label: 'Total Materials',
      value: dummyDashboardStats.totalMaterials,
      change: '-2.3%',
      trend: 'down',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: BarChart3,
      label: 'Revenue',
      value: '₹2.4L',
      change: '+24.5%',
      trend: 'up',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const topVendors = dummyVendors.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <Card key={idx} className="group relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                  <TrendIcon size={16} />
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card title="Revenue Trend" icon={BarChart3} className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-end justify-between h-48 gap-2">
              {[65, 45, 78, 55, 82, 60, 70].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Vendors */}
        <Card title="Top Vendors" icon={Users}>
          <div className="space-y-3">
            {topVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{vendor.name}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                </div>
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="Recent Orders" icon={ShoppingCart}>
        <div className="space-y-2">
          {dummyMaterials.slice(0, 5).map((material, idx) => (
            <div key={idx} className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{material.name}</p>
                <p className="text-xs text-gray-500">Order #{1001 + idx}</p>
              </div>
              <p className="font-bold">₹{(material.price * 10).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
