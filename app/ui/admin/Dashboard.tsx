"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBox, FaUsers, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { useFetch } from "@/app/hooks/useFetch";
import { Dashboard as _Dashboard } from "@/app/lib/types/Dashboard";
import DashboardOrders from "@/app/components/admin/DashboardOrders";
import SkeletonDashboard from "@/app/components/Loaders/SkeletonDashboard";
const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

// good
export default function Dashboard() {
  const {
    data: dashboardValues,
   
  } = useFetch<_Dashboard>({
    uri: "/api/admin/dashboard",
    service: "fetchDashboardData",
  });

  console.log({ dashboardValues });
  const stats = [
    {
      label: "Total Orders",
      value: dashboardValues.totalOrders,
      icon: <FaShoppingCart size={30} className="text-yellow-400" />,
    },
    {
      label: "Products",
      value: dashboardValues.totalProducts,
      icon: <FaBox size={30} className="text-yellow-400" />,
    },
    {
      label: "Customers",
      value: dashboardValues.totalCustomers,
      icon: <FaUsers size={30} className="text-yellow-400" />,
    },
    {
      label: "Revenue",
      value: "GHS 82,400",
      icon: <FaChartBar size={30} className="text-yellow-400" />,
    },
  ];

  const actions = [
    { label: "Add Product", href: "/admin/add-product" },
    { label: "Manage Orders", href: "/admin/manage-orders" },
    { label: "Customers", href: "/admin/customers" },
    { label: "Analytics", href: "/admin/analytics" },
  ];

  return (
    <>
      {Object.keys(dashboardValues).length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#1a1a1a] text-yellow-400 mt-20 p-6"
        >
          <motion.h1
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CraftSpace Store Admin
          </motion.h1>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={cardVariants}
                className="bg-[#2a2a2a] rounded-lg shadow-xl p-4 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{item.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {item.value}
                    </p>
                  </div>
                  {item.icon}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-[#2a2a2a] rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={action.href}
                    replace
                    className="block w-full text-center py-3 rounded-md bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition duration-200"
                  >
                    {action.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="bg-[#2a2a2a] rounded-xl shadow-lg p-6 mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2>Today's Orders</h2>
            <div className="">
              <DashboardOrders orders={dashboardValues.todayOrders} page={1} onPageChange={() => {}} onUpdate={() => {}}/>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="mt-20">
          <SkeletonDashboard />

        </div>
      )}
    </>
  );
}
