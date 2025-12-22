"use client";
import { useState } from "react";
import { Trash2, Edit } from "lucide-react";

const Shoecard = ({ shoe, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const finalPrice = shoe.price - (shoe.price * shoe.discount) / 100;
  const mainImage = shoe.images && shoe.images.length > 0 ? shoe.images[0] : "/shoe.webp";

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${shoe.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/shoes/${shoe._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Shoe deleted successfully!");
        // Call parent component's onDelete callback to refresh the list
        if (onDelete) {
          onDelete(shoe._id);
        }
      } else {
        alert(result.error || "Failed to delete shoe");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete shoe");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      
      {/* Image */}
      <div className="relative h-72 bg-zinc-800 flex items-center justify-center">
        <img
          src={mainImage}
          alt={shoe.name}
          className="h-full w-full object-cover object-center"
        />

        {shoe.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {shoe.discount}% OFF
          </span>
        )}

        {shoe.stock === 0 && (
          <span className="absolute top-3 right-3 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {/* Delete Button - Top Right Corner */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete shoe"
        >
          {isDeleting ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      <div className="p-4 space-y-2">
        <p className="text-xs text-amber-300 uppercase tracking-wide">
          {shoe.brand}
        </p>

        <h3 className="text-amber-600 font-semibold text-base truncate">
          {shoe.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-amber-600">
            ₹{finalPrice.toFixed(2)}
          </span>
          {shoe.discount > 0 && (
            <span className="text-sm text-amber-300 line-through">
              ₹{shoe.price}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-amber-300">
          <span>Stock: {shoe.stock}</span>
          <span>Sales: {shoe.sales}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <a
            href={`/dashboard/shoe/${shoe._id}`}
            className="flex-1 py-2 px-4 bg-amber-400 rounded-md hover:bg-amber-500 transition-colors text-center"
          >
            <span className="text-black text-sm font-semibold flex items-center justify-center gap-2">
              <Edit size={16} />
              Edit
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shoecard;