"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { 
  basicInfoSchema, 
  pricingInfoSchema, 
  imagesSchema 
} from "@/lib/validations/shoe";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, name: "Basic Info", schema: basicInfoSchema },
  { id: 2, name: "Pricing", schema: pricingInfoSchema },
  { id: 3, name: "Images", schema: imagesSchema },
  { id: 4, name: "Review", schema: null },
];

const Addshoe = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Get current step schema
  const currentSchema = STEPS.find(s => s.id === currentStep)?.schema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm({
    resolver: currentSchema ? zodResolver(currentSchema) : undefined,
    mode: "onChange",
  });

  // Mutation for adding shoe
  const addShoeMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("brand", data.brand);
      formDataToSend.append("price", data.price);
      formDataToSend.append("discount", data.discount || 0);
      formDataToSend.append("stock", data.stock);
      formDataToSend.append("category", data.category);

      data.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const res = await fetch("/api/shoes", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add shoe");
      }

      return res.json();
    },
    onSuccess: () => {
      alert("Shoe added successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      alert(error.message || "Something went wrong! Please try again.");
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setValue("images", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const onSubmit = (data) => {
    // Store data from current step
    setFormData((prev) => ({ ...prev, ...data }));

    if (currentStep === STEPS.length) {
      // Final submission
      addShoeMutation.mutate(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-semibold text-sm">
                Shoe Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  onChange: (e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value })),
                })}
                defaultValue={formData.name}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="Air Max Runner Pro"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-semibold text-sm">Brand *</label>
              <input
                type="text"
                {...register("brand", {
                  onChange: (e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value })),
                })}
                defaultValue={formData.brand}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="Nike"
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-semibold text-sm">
                Category *
              </label>
              <input
                type="text"
                {...register("category", {
                  onChange: (e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    })),
                })}
                defaultValue={formData.category}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="Running"
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-semibold text-sm">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  valueAsNumber: true,
                  onChange: (e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    })),
                })}
                defaultValue={formData.price}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="5999"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-semibold text-sm">
                Discount (%)
              </label>
              <input
                type="number"
                {...register("discount", {
                  valueAsNumber: true,
                  onChange: (e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount: e.target.value,
                    })),
                })}
                defaultValue={formData.discount}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="20"
              />
              {errors.discount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discount.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-semibold text-sm">Stock *</label>
              <input
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                  onChange: (e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value })),
                })}
                defaultValue={formData.stock}
                className="w-full p-2 rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                placeholder="50"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-semibold text-gray-700 text-sm">
                Upload Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-500 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-none file:cursor-pointer file:hover:bg-blue-700 border border-gray-300 rounded-md p-2 text-sm"
              />
              <p className="mt-2 text-xs text-gray-400">
                Upload 1-5 images (Max 5MB each, JPEG/PNG/WebP)
              </p>
              {errors.images && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Review Your Shoe Details
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-semibold text-green-600">{formData.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Brand:</p>
                  <p className="font-semibold text-green-600">{formData.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category:</p>
                  <p className="font-semibold text-green-600">{formData.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price:</p>
                  <p className="font-semibold text-green-600">₹{formData.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Discount:</p>
                  <p className="font-semibold text-green-600">{formData.discount || 0}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Stock:</p>
                  <p className="font-semibold text-green-600">{formData.stock}</p>
                </div>
                <div>
                  <p className="text-gray-600">Final Price:</p>
                  <p className="font-semibold text-green-600">
                    ₹
                    {(
                      formData.price -
                      (formData.price * (formData.discount || 0)) / 100
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Images:</p>
                  <p className="font-semibold">{formData.images.length} uploaded</p>
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {previewImages.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(143.42deg,#79DEFC_2.34%,#DFA3D9_85.26%)] p-4 sm:p-6 md:p-8 lg:p-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Add New Shoe
          </h1>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 hidden sm:block ${
                      currentStep >= step.id
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={addShoeMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addShoeMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addshoe;