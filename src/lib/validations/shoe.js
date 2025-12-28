// src/lib/validations/shoe.js
import { z } from "zod";

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Shoe name must be at least 3 characters")
    .max(100, "Shoe name must be less than 100 characters")
    .trim(),
  brand: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(50, "Brand name must be less than 50 characters")
    .trim(),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters")
    .trim(),
});

// Step 2: Pricing Info
export const pricingInfoSchema = z.object({
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(999999, "Price seems too high"),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(99999, "Stock value is too high"),
});

// Step 3: Images
export const imagesSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one image")
    .max(5, "You can upload maximum 5 images")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each image must be less than 5MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

// Complete shoe schema (all steps combined)
export const completeShoeSchema = basicInfoSchema
  .merge(pricingInfoSchema)
  .merge(imagesSchema);