// src/app/dashboard/admins/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, UserCheck, UserX } from "lucide-react";
import AddAdminModal from "@/components/AddAdminModal";

const ViewAdmins = () => {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setCurrentAdminId(parsed.id);
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admins");
      const data = await response.json();

      if (data.success) {
        setAdmins(data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this admin?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        fetchAdmins();
        alert(data.message);
      } else {
        alert(data.error || "Failed to update admin status");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin status");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchAdmins();
        alert("Admin deleted successfully");
      } else {
        alert(data.error || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchAdmins();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(143.42deg,#79DEFC_2.34%,#DFA3D9_85.26%)] p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            <Plus size={20} />
            Add Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Admin Management
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">
                          {admin.name}
                        </span>
                        {admin._id === currentAdminId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {admin.email}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          admin.role === "super-admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          admin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {admin._id !== currentAdminId && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(admin._id, admin.isActive)
                            }
                            className={`p-2 rounded ${
                              admin.isActive
                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                : "bg-green-100 hover:bg-green-200 text-green-700"
                            } transition-colors`}
                            title={
                              admin.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {admin.isActive ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No admins found</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};

export default ViewAdmins;