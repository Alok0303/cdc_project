"use client";
import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Package, Tag, TrendingUp, Clock, History, TrendingDown, Trash2 } from "lucide-react";
import Chart from "chart.js/auto";

const ShoeDetail = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deletingSaleId, setDeletingSaleId] = useState(null);

  const salesDiscountChartRef = useRef(null);
  const salesDiscountChartInstance = useRef(null);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    fetchShoeDetails();
  }, [id, router]);

  useEffect(() => {
    if (shoe && shoe.salesHistory && shoe.salesHistory.length > 0) {
      createSalesDiscountChart();
    }

    return () => {
      if (salesDiscountChartInstance.current) {
        salesDiscountChartInstance.current.destroy();
      }
    };
  }, [shoe, chartType]);

  const fetchShoeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shoes/${id}`);
      const result = await response.json();

      if (result.success) {
        setShoe(result.data);
      } else {
        setError("Failed to load shoe details");
      }
    } catch (err) {
      console.error("Error fetching shoe details:", err);
      setError("Failed to load shoe details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSale = async (saleIndex) => {
    if (!confirm("Are you sure you want to delete this sale entry?")) {
      return;
    }

    setDeletingSaleId(saleIndex);

    try {
      const updatedSalesHistory = shoe.salesHistory.filter((_, idx) => idx !== saleIndex);
      const newTotalSales = updatedSalesHistory.reduce((sum, entry) => sum + entry.sales, 0);

      const response = await fetch(`/api/shoes/${id}/sales`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saleIndex,
          newTotalSales,
          updatedSalesHistory,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchShoeDetails();
        alert("Sale entry deleted successfully!");
      } else {
        alert(result.error || "Failed to delete sale entry");
      }
    } catch (err) {
      console.error("Error deleting sale:", err);
      alert("Failed to delete sale entry");
    } finally {
      setDeletingSaleId(null);
    }
  };

  const createSalesDiscountChart = () => {
    if (salesDiscountChartInstance.current) {
      salesDiscountChartInstance.current.destroy();
    }

    if (!salesDiscountChartRef.current || !shoe.salesHistory || shoe.salesHistory.length === 0) {
      return;
    }

    const discountRanges = {
      "0%": 0,
      "1-10%": 0,
      "11-20%": 0,
      "21-30%": 0,
      "31%+": 0,
    };

    shoe.salesHistory.forEach((entry) => {
      const discount = entry.discount || 0;
      const sales = entry.sales;
      
      if (discount === 0) discountRanges["0%"] += sales;
      else if (discount <= 10) discountRanges["1-10%"] += sales;
      else if (discount <= 20) discountRanges["11-20%"] += sales;
      else if (discount <= 30) discountRanges["21-30%"] += sales;
      else discountRanges["31%+"] += sales;
    });
    
    const labels = Object.keys(discountRanges);
    const salesData = Object.values(discountRanges);

    const colors = [
      "rgba(239, 68, 68, 0.8)",
      "rgba(249, 115, 22, 0.8)",
      "rgba(234, 179, 8, 0.8)",
      "rgba(34, 197, 94, 0.8)",
      "rgba(168, 85, 247, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(99, 102, 241, 0.8)",
    ];

    const borderColors = [
      "rgba(239, 68, 68, 1)",
      "rgba(249, 115, 22, 1)",
      "rgba(234, 179, 8, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(168, 85, 247, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(236, 72, 153, 1)",
      "rgba(99, 102, 241, 1)",
    ];

    salesDiscountChartInstance.current = new Chart(salesDiscountChartRef.current, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sales by Discount",
            data: salesData,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: borderColors.slice(0, labels.length),
            borderWidth: 2,
            borderRadius: chartType === "bar" ? 8 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType === "pie" || chartType === "doughnut",
            position: "bottom",
          },
          title: {
            display: true,
            text: "Sales by Discount",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: chartType === "pie" || chartType === "doughnut" ? {} : {
          x: {
            title: {
              display: true,
              text: "Discount",
              font: {
                weight: "bold",
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Sales",
              font: {
                weight: "bold",
              },
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shoe details...</p>
        </div>
      </div>
    );
  }

  if (error || !shoe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || "Shoe not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = shoe.price - (shoe.price * shoe.discount) / 100;
  const mainImage = shoe.images && shoe.images.length > 0 ? shoe.images[selectedImage] : "/shoe.webp";
  const totalSales = shoe.salesHistory && shoe.salesHistory.length > 0
    ? shoe.salesHistory.reduce((sum, entry) => sum + entry.sales, 0)
    : shoe.sales || 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(143.42deg,#79DEFC_2.34%,#DFA3D9_85.26%)] p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors cursor-pointer text-sm sm:text-base"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push(`/dashboard/${id}/edit`)}
            className="flex items-center gap-2 bg-[linear-gradient(90deg,#00C0FF_0%,#5558FF_100%)] text-white px-4 sm:px-6 py-2 rounded-lg transition-colors font-semibold cursor-pointer text-sm sm:text-base"
          >
            <Edit size={18} />
            Edit Shoe
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
          {/* Images Section */}
          <div>
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4 h-64 sm:h-80 md:h-96 flex items-center justify-center">
              <img
                src={mainImage}
                alt={shoe.name}
                className="w-full h-full object-cover"
              />
              {shoe.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                  {shoe.discount}% OFF
                </span>
              )}
              {shoe.stock === 0 && (
                <span className="absolute top-4 right-4 bg-gray-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {shoe.images && shoe.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {shoe.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative bg-gray-100 rounded-lg overflow-hidden h-16 sm:h-20 md:h-24 border-2 transition-all ${
                      selectedImage === idx
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${shoe.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand */}
              <p className="text-xs sm:text-sm text-blue-600 uppercase tracking-wide font-semibold mb-2">
                {shoe.brand}
              </p>

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {shoe.name}
              </h1>

              {/* Category */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mb-6">
                <Tag size={16} className="text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  {shoe.category}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {shoe.discount > 0 && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ₹{shoe.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="bg-blue-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={18} className="text-blue-600" />
                    <p className="text-xs sm:text-sm text-gray-600">Stock Available</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {shoe.stock} units
                  </p>
                </div>

                <div className="bg-green-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={18} className="text-green-600" />
                    <p className="text-xs sm:text-sm text-gray-600">Total Sales</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {totalSales}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 sm:pt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Added On</span>
                  <span className="text-gray-900">
                    {new Date(shoe.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">
                    {new Date(shoe.updatedAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales History Section */}
      {shoe.salesHistory && shoe.salesHistory.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <History size={24} className="text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sales History</h2>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                      Sales
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                      Discount
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                      Final
                    </th>
                    <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...shoe.salesHistory].reverse().map((entry, idx) => {
                    const actualIndex = shoe.salesHistory.length - 1 - idx;
                    const entryFinalPrice = entry.price - (entry.price * entry.discount) / 100;
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400 hidden sm:block" />
                            <div>
                              <p className="text-xs sm:text-sm text-gray-900 font-medium">
                                {new Date(entry.timestamp).toLocaleDateString("en-GB")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            <TrendingUp size={12} className="hidden sm:inline" />
                            {entry.sales}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-900 font-medium text-xs sm:text-sm">
                          ₹{entry.price.toFixed(2)}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          {entry.discount > 0 ? (
                            <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                              {entry.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No discount</span>
                          )}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span className="text-blue-600 font-bold text-sm sm:text-lg">
                            ₹{entryFinalPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                          <button
                            onClick={() => handleDeleteSale(actualIndex)}
                            disabled={deletingSaleId === actualIndex}
                            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={12} />
                            <span className="hidden sm:inline">{deletingSaleId === actualIndex ? "Deleting..." : "Delete"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {shoe.salesHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <History size={48} className="mx-auto mb-4 opacity-30" />
              <p>No sales history available yet</p>
            </div>
          )}
        </div>
      )}

      {/* Sales vs Discount Chart */}
      {shoe.salesHistory && shoe.salesHistory.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <TrendingDown size={24} className="text-purple-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sales vs Discount</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors ${
                  chartType === "bar"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors ${
                  chartType === "pie"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType("doughnut")}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-semibold transition-colors ${
                  chartType === "doughnut"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Doughnut
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-80 md:h-96">
            <canvas ref={salesDiscountChartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoeDetail;