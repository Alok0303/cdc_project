// src/components/Dashboard.js
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Package, DollarSign, Tag } from "lucide-react";
import Shoecard from "./Shoecard";
import Charts from "./Chartsindashboard";
import DashboardHeader from "./DashboardHeader";

// API function
const fetchShoes = async () => {
  const response = await fetch("/api/shoes");
  if (!response.ok) {
    throw new Error("Failed to fetch shoes");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch shoes");
  }
  return result.data;
};

const Dashboard = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // React Query
  const { data: shoes = [], isLoading, error } = useQuery({
    queryKey: ["shoes"],
    queryFn: fetchShoes,
  });

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) router.push("/");
      } catch {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  // ✅ Derived state (NO useEffect, NO setState)
  const filteredShoes = useMemo(() => {
    if (searchQuery.trim() === "") return shoes;

    const query = searchQuery.toLowerCase();
    return shoes.filter(
      (shoe) =>
        shoe.name.toLowerCase().includes(query) ||
        shoe.brand.toLowerCase().includes(query) ||
        shoe.category.toLowerCase().includes(query)
    );
  }, [searchQuery, shoes]);

  const getTotalSales = (shoe) => {
    return shoe.salesHistory && shoe.salesHistory.length > 0
      ? shoe.salesHistory.reduce((sum, entry) => sum + entry.sales, 0)
      : shoe.sales || 0;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const displayedShoes = useMemo(() => {
    const sorted = [...filteredShoes].sort(
      (a, b) => getTotalSales(b) - getTotalSales(a)
    );

    return showAll ? sorted : sorted.slice(0, 8);
  }, [filteredShoes, showAll]);

  const totalSales = shoes.reduce((sum, shoe) => sum + getTotalSales(shoe), 0);
  const totalStock = shoes.reduce((sum, shoe) => sum + (shoe.stock || 0), 0);
  const totalRevenue = shoes.reduce((sum, shoe) => {
    const finalPrice = shoe.price - (shoe.price * shoe.discount) / 100;
    return sum + finalPrice * getTotalSales(shoe);
  }, 0);

  const LOW_STOCK_LIMIT = 15;

  const lowStockShoes = shoes
    .filter((shoe) => (shoe.stock || 0) < LOW_STOCK_LIMIT)
    .sort((a, b) => (a.stock || 0) - (b.stock || 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 bg-[linear-gradient(143.42deg,#79DEFC_2.34%,#DFA3D9_85.26%)]">
      <DashboardHeader />

      {/* Search Bar */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border-2 rounded-lg border-blue-500 focus:border-orange-500 focus:outline-none placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mt-3 text-sm text-gray-600">
            {filteredShoes.length === 0
              ? `No shoes found for "${searchQuery}"`
              : `Found ${filteredShoes.length} shoes matching "${searchQuery}"`}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
          {error.message}
        </div>
      )}

      {/* Shoes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
        {displayedShoes.map((shoe) => (
          <Shoecard key={shoe._id} shoe={shoe} />
        ))}
      </div>

      {!searchQuery && filteredShoes.length > 8 && (
        <div className="text-center py-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-blue-600 font-semibold text-2xl bg-yellow-600 px-5 py-2 rounded-2xl"
          >
            {showAll ? "Show Less" : `View All (${filteredShoes.length - 8})`}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 lg:grid-cols-4 gap-6 px-4 mt-10">
        <div className="bg-blue-600 p-6 rounded-xl text-white">
          <TrendingUp size={28} />
          <p className="text-3xl font-bold">{totalSales}</p>
          <p>Total Sales</p>
        </div>
        <div className="bg-green-600 p-6 rounded-xl text-white">
          <Package size={28} />
          <p className="text-3xl font-bold">{totalStock}</p>
          <p>Total Stock</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl text-white">
          <DollarSign size={28} />
          <p className="text-3xl font-bold">₹ {totalRevenue.toFixed(0)}</p>
          <p>Total Revenue</p>
        </div>
        <div className="bg-orange-600 p-6 rounded-xl text-white">
          <Tag size={28} />
          <p className="text-3xl font-bold">{shoes.length}</p>
          <p>Total Products</p>
        </div>
      </div>

      <Charts shoes={shoes} getTotalSales={getTotalSales} />
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 mt-16 mb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600">
            ⚠️ Low Stock Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lowStockShoes.map((shoe) => (
            <Shoecard key={shoe._id} shoe={shoe} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
