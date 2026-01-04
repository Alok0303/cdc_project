// src/components/DashboardHeader.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, KeyRound } from "lucide-react";

const DashboardHeader = () => {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      setAdminData(JSON.parse(data));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("adminData");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminData");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 sm:px-6 md:px-8 lg:px-10 mb-6 gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome {adminData?.name || "Admin"}
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Welcome to your KickCraft online portal
        </p>
      </div>
      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
        <Link
          href="/dashboard/change-password"
          className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
        >
          <KeyRound size={18} />
          <span className="hidden sm:inline">Change Password</span>
          <span className="sm:hidden">Password</span>
        </Link>
        <Link
          href="/dashboard/admins"
          className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
        >
          <Users size={18} />
          <span className="hidden sm:inline">View Admins</span>
          <span className="sm:hidden">Admins</span>
        </Link>
        <Link
          className="text-white bg-[linear-gradient(90deg,#00C0FF_0%,#5558FF_100%)] px-4 py-2 rounded-md transition-colors text-center text-sm sm:text-base"
          href="/add"
        >
          Add Shoe
        </Link>
        <button
          onClick={handleLogout}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;