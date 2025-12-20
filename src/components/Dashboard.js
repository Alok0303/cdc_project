"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shoecard from "./Shoecard";

const Dashboard = () => {
  const router = useRouter();
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    // Fetch shoes from API
    fetchShoes();
  }, [router]);

  const fetchShoes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shoes");
      const result = await response.json();

      if (result.success) {
        setShoes(result.data);
      } else {
        setError("Failed to load shoes");
      }
    } catch (err) {
      console.error("Error fetching shoes:", err);
      setError("Failed to load shoes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shoes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="flex flex-row justify-between items-center px-10 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Welcome Gentleman</h1>
          <p className="text-black">Welcome to your Kickkraft online portal.</p>
        </div>
        <div className="flex gap-4">
          <a
            className="text-black bg-blue-300 hover:bg-blue-400 px-5 py-2 rounded-md transition-colors"
            href="/add"
          >
            Add Shoe
          </a>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-5 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 mx-10">
          {error}
        </div>
      )}

      {shoes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-xl">No shoes available</p>
          <p className="text-gray-400 mt-2">Add your first shoe to get started</p>
        </div>
      ) : (
        <div className="py-10 gap-6 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {shoes.map((shoe) => (
            <Shoecard key={shoe._id} shoe={shoe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;