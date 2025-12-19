"use client";
import React, { useState } from "react";

const Addshoe = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    images: [], // will store File objects
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // convert FileList to array
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      const res = await fetch("/api/shoes", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Shoe added successfully!");
        setFormData({ name: "", brand: "", price: "", discount: "", stock: "", category: "", images: [] });
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Shoe</h1>
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
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="5999"
                required
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
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full text-gray-500 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-none file:cursor-pointer file:hover:bg-blue-700 border border-gray-300 rounded-md p-2"
              onChange={handleFileChange}
            />
            <p className="mt-2 text-sm text-gray-400">
              {formData.images.length > 0
                ? formData.images.map((file, idx) => file.name).join(", ")
                : "No files selected"}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md mt-4 transition-colors"
          >
            Add Shoe
          </button>

        </form>
      </div>
    </div>
  );
};

export default Addshoe;
