"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";


function Login ({ formData, handleInputChange, onLogin, isLoading }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  
  return (
    <div className="w-full">
      <h2 className="text-white font-bold text-2xl sm:text-[28px] md:text-[32px] mb-6 sm:mb-8 md:mb-10">Log in To Your Portal</h2>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-white text-sm block mb-1">Email</label>
          <input
            className="w-full px-3 py-2 bg-transparent border border-black rounded-md text-black text-sm placeholder-black focus:border-blue-500 focus:outline-none transition-colors"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
        <div>
        <label className="text-white text-sm block mb-1">Password</label>
        <div className="relative">
          <input
            className="w-full px-3 py-2 bg-transparent border border-black rounded-md text-black text-sm placeholder-black focus:border-blue-500 focus:outline-none transition-colors pr-10"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
          />
          
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
        
      </form>

      <button
        type="button"
        onClick={onLogin}
        disabled={isLoading}
        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 mt-6 sm:mt-[30px] text-white rounded-full font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}


const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    setIsLoading(true);
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (formData.email === adminEmail && formData.password === adminPassword) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid Credentials");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 md:px-8 bg-black/90"
      style={{ backgroundImage: `url('/main-bg.webp')` }}
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row overflow-hidden rounded-2xl">
        
        <div className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-xl border-[1.5px] border-white/20 w-full flex items-center justify-center">
        
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-[530px] bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col justify-between mx-auto min-h-[500px] sm:min-h-[450px]">
          
          <div className="flex justify-center flex-shrink-0 mb-4 sm:mb-3 mt-2">
            <img
              src="/logo.webp"
              alt="CAP Logo"
              className="w-20 sm:w-24 md:w-28 lg:w-20 h-auto object-contain"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex-1 overflow-y-auto px-1 flex flex-col justify-center">
                <Login
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onLogin={handleLogin}
                  isLoading={isLoading}
                />
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-[55%] items-center justify-center p-6 md:p-8 lg:p-10">
          <h1 className="text-white font-bold text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-snug text-left text-yellow-400">
            <span className="block">Craft Your</span>
            <span className="block">Perfect</span>
            <span className="block">Pair of</span>
            <span className="block">Kicks</span>
          </h1>
        </div>

      </div>
    
      </div>
    </div>
    );
};


export default Home;