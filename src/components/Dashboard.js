"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Shoecard from "./Shoecard";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const shoes = [
    { id: 1, brand: "Nike", name: "Air Max Runner Pro", price: 5999, finalPrice: 4799, discount: 20, image: "/shoe.webp" },
    { id: 2, brand: "Adidas", name: "Ultraboost Light", price: 8999, finalPrice: 7199, discount: 20, image: "/shoe.webp" },
    { id: 3, brand: "Puma", name: "Velocity Nitro", price: 7499, finalPrice: 5999, discount: 20, image: "/shoe.webp" },
    { id: 4, brand: "New Balance", name: "Fresh Foam X", price: 8299, finalPrice: 6639, discount: 20, image: "/shoe.webp" },
    { id: 5, brand: "Reebok", name: "Nano X3", price: 6999, finalPrice: 5599, discount: 20, image: "/shoe.webp" },
    { id: 6, brand: "Asics", name: "Gel-Kayano 28", price: 8999, finalPrice: 7199, discount: 20, image: "/shoe.webp" },
  ];

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="flex flex-row justify-between px-10">
        <div className="">
          <h1 className="text-2xl font-bold text-black">Welcome Gentleman</h1>
          <p className="text-black">Welcome to your Kickkraft online portal.</p>
        </div>
        <a className="text-black my-4 bg-blue-300 px-5 py-2 rounded-md" href="/add">Add Shoe</a>
      </div>

      {/* ✅ Auto-grid container */}
      <div className="py-10 gap-6 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {shoes.map((shoe) => (
          <Shoecard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
