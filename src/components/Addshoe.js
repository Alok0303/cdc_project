"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Addshoe = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || 0);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category);

      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const res = await fetch("/api/shoes", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Shoe added successfully!");
        // Reset form
        setFormData({
          name: "",
          brand: "",
          price: "",
          discount: "",
          stock: "",
          category: "",
          images: [],
        });
        setPreviewImages([]);
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to add shoe");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Shoe</h1>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block font-semibold">Shoe Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Air Max Runner Pro"
              required
              disabled={loading}
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
              placeholder="Nike"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-semibold">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="5999"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-semibold">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="20"
                min="0"
                max="100"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="50"
              required
              min="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Running"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-gray-500 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-none file:cursor-pointer file:hover:bg-blue-700 border border-gray-300 rounded-md p-2"
              onChange={handleFileChange}
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">
              {formData.images.length > 0
                ? `${formData.images.length} file(s) selected`
                : "No files selected"}
            </p>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {previewImages.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Shoe..." : "Add Shoe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addshoe;