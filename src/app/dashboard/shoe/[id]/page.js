// src/app/dashboard/shoe/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const EditShoePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    sales:"",
  });
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    fetchShoe();
  }, [id]);

  const fetchShoe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shoes/${id}`);
      const result = await response.json();

      if (result.success) {
        const shoe = result.data;
        setFormData({
          name: shoe.name,
          brand: shoe.brand,
          price: shoe.price,
          discount: shoe.discount,
          stock: shoe.stock,
          category: shoe.category,
          sales:shoe.sales,
        });
        setCurrentImages(shoe.images || []);
      } else {
        setError("Failed to load shoe details");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load shoe");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || 0);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("sales", formData.sales);

      const response = await fetch(`/api/shoes/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        alert("Shoe updated successfully!");
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to update shoe");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update shoe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading shoe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={24} />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Edit Shoe</h1>
            </div>
          </div>

          {/* Current Images */}
          {currentImages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Current Images
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {currentImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Shoe ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-semibold">Shoe Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                  readOnly
                  disabled={saving}
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                  readOnly
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block font-semibold">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                  min="0"
                  step="0.01"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  min="0"
                  max="100"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                  min="0"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block font-semibold">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        required
                        disabled={saving}
                    />
                </div>
                <div>
                    <label className="mb-1 block font-semibold">sales</label>
                    <input
                        type="text"
                        name="sales"
                        value={formData.sales}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        required
                        disabled={saving}
                    />
                </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-md transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShoePage;