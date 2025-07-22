"use client";

import React from "react";
import { useFetch } from "@/app/hooks/useFetch";
import DynamicChart from "../DynamicChart";

const Analytics = () => {
  const { data: analytics } = useFetch<any>({
    uri: "/api/admin/dashboard",
    service: "fetchAnalytics",
  });

  console.log({ analytics });

  const generateChartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title },
    },
  });

  const ordersLine = {
    labels: analytics.ordersByMonth,
    datasets: [
      {
        label: "Orders in a month",
        data: analytics.monthlyOrdersAmount,
        backgroundColor: Array(12).fill("rgba(255, 215, 0, 0.5)"), // Gold with transparency
        borderColor: Array(12).fill("rgba(255, 255, 255, 0.9)"), // White with transparency
        borderWidth: 1,
      },
    ],
  };

  const mostItemsBoughtbar = {
    labels: analytics.mostBoughtItemsTitle,
    datasets: [
      {
        label: "Most Bought Items",
        data: analytics.mostBoughtItemsQuantity,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
      },
    ],
  };


  const monthlyOrderOptions = generateChartOptions("Monthly Orders Graph");
  const mostBoughtItemsOptions = generateChartOptions("Most Bought Items Graph");

  return (
    <main className="min-h-screen mt-24 bg-black shadow-lg">
      {Object.keys(analytics).length > 0 ? (
        <>
          <DynamicChart
            options={monthlyOrderOptions}
            data={ordersLine}
            type="line"
          />
          <section className="flex flex-row gap-5 w-full mt-10">
            <DynamicChart
              options={mostBoughtItemsOptions}
              data={mostItemsBoughtbar}
              type="bar"
              className="w-full text-slate-50"
            />
            <DynamicChart
              options={monthlyOrderOptions}
              data={ordersLine}
              type="bar"
              className="w-full"
            />
          </section>
        </>
      ) : (
        ""
      )}
    </main>
  );
};

export default Analytics;
