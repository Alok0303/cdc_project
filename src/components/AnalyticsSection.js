"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { TrendingUp, Package, DollarSign, Tag } from "lucide-react";

const AnalyticsSection = ({ shoes }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [type, setType] = useState("bar");

  const totalSales = shoes.reduce((s, i) => s + (i.sales || 0), 0);
  const totalStock = shoes.reduce((s, i) => s + (i.stock || 0), 0);
  const totalRevenue = shoes.reduce(
    (s, i) => s + (i.price - i.price * i.discount / 100) * (i.sales || 0),
    0
  );

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type,
      data: {
        labels: ["Sales", "Stock", "Products"],
        datasets: [{
          data: [totalSales, totalStock, shoes.length],
          backgroundColor: ["#6366f1", "#22c55e", "#f97316"]
        }]
      }
    });
  }, [type, shoes]);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <Stat icon={<TrendingUp />} label="Sales" value={totalSales} />
        <Stat icon={<Package />} label="Stock" value={totalStock} />
        <Stat icon={<DollarSign />} label="Revenue" value={`₹${totalRevenue}`} />
        <Stat icon={<Tag />} label="Products" value={shoes.length} />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex gap-2 mb-4">
          {["bar", "line", "pie", "doughnut"].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              {t}
            </button>
          ))}
        </div>
        <canvas ref={chartRef} height={300} />
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded text-white">
    {icon}
    <p className="text-2xl font-bold">{value}</p>
    <p>{label}</p>
  </div>
);

export default AnalyticsSection;
