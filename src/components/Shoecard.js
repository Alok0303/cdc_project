"use client";

const Shoecard = ({ shoe }) => {
  return (
    <div className=" bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      
      {/* Image */}
      <div className="relative h-72 bg-zinc-800 flex items-center justify-center">
        <img
          src={shoe.image}
          alt="Shoe"
          className="h-full w-full object-cover object-center"
        />

        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {shoe.discount}% OFF
        </span>
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
            ₹{(shoe.price * (1 - shoe.discount / 100)).toFixed(2)}
          </span>
          <span className="text-sm text-amber-300 line-through">
            ₹{shoe.price}
          </span>
        </div>

        <div className="inline-block py-2 px-5 bg-amber-400 rounded-md">
          <a className="text-black text-lg" href="">
            View More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shoecard;
