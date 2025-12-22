"use client";
import { useState, useEffect } from "react";
import { Search, Eye, EyeOff } from "lucide-react";
import Shoecard from "./Shoecard";

const ProductCatalog = ({ shoes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShoes, setFilteredShoes] = useState(shoes);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!searchQuery) setFilteredShoes(shoes);
    else {
      const q = searchQuery.toLowerCase();
      setFilteredShoes(
        shoes.filter(
          s =>
            s.name.toLowerCase().includes(q) ||
            s.brand.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, shoes]);

  const displayedShoes = showAll ? filteredShoes : filteredShoes.slice(0, 8);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Product Catalog</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          className="w-full pl-10 py-2 border rounded"
          placeholder="Search shoes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {displayedShoes.map(shoe => (
          <Shoecard key={shoe._id} shoe={shoe} />
        ))}
      </div>

      {/* Toggle */}
      {filteredShoes.length > 8 && !searchQuery && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 flex items-center gap-2 text-blue-600"
        >
          {showAll ? <EyeOff /> : <Eye />}
          {showAll ? "Show Less" : "View All"}
        </button>
      )}
    </div>
  );
};

export default ProductCatalog;
