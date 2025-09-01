import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await axios.get("/analytics");
        setAnalyticsData(res.data.analyticsData);
        setDailySalesData(
          res.data.dailySalesData.map((item) => ({
            name: item.date,
            sales: item.sales,
            revenue: item.revenue,
          }))
        );
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.usersCount.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-600"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.productsCount?.toLocaleString()}
          icon={Package}
          color="from-indigo-500 to-purple-600"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-pink-500 to-rose-600"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-yellow-400 to-amber-500"
        />
      </div>

      <motion.div
        className="bg-gray-900 rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-white text-xl font-semibold mb-4">
          Daily Sales & Revenue
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#10B981" />
            <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", borderRadius: 8 }}
              labelStyle={{ color: "#F9FAFB" }}
            />
            <Legend wrapperStyle={{ color: "#F9FAFB" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={3}
              activeDot={{ r: 7 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              activeDot={{ r: 7 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`relative rounded-xl p-6 overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative z-10">
      <p className="text-gray-200 font-medium text-sm">{title}</p>
      <h3 className="text-white text-3xl font-bold mt-1">{value}</h3>
    </div>
    <div className="absolute -bottom-6 -right-6 opacity-20">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
