import { z } from "zod";

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email({ message: "Невалиден имейл адрес" }),
  password: z.string().min(1, { message: "Паролата е задължителна" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Невалиден имейл адрес" }),
  password: z.string().min(6, { message: "Минимум 6 символа" }),
  name: z.string().min(2, { message: "Името е задължително" }),
});

// Product Schemas
export const ProductSchema = z.object({
  name: z.string().min(2, { message: "Името е задължително" }),
  slug: z.string().min(2, { message: "Slug е задължителен" }),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Цената трябва да е положителна" }),
  compareAtPrice: z.number().optional(),
  images: z.string(), // JSON string
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  sku: z.string().optional(),
  categoryId: z.string(),
});

// Category Schema
export const CategorySchema = z.object({
  name: z.string().min(2, { message: "Името е задължително" }),
  slug: z.string().min(2, { message: "Slug е задължителен" }),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

// Order Schema
export const OrderSchema = z.object({
  customerName: z.string().min(2, { message: "Името е задължително" }),
  customerEmail: z.string().email({ message: "Невалиден имейл" }),
  customerPhone: z.string().min(5, { message: "Телефонът е задължителен" }),
  courier: z.string(),
  deliveryMethod: z.string(),
  deliveryOffice: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  paymentMethod: z.string().default("cod"),
  deliveryFee: z.number().default(0),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
  })),
});

// Blog Post Schema
export const BlogPostSchema = z.object({
  title: z.string().min(2, { message: "Заглавието е задължително" }),
  slug: z.string().min(2, { message: "Slug е задължителен" }),
  excerpt: z.string().optional(),
  content: z.string().min(10, { message: "Съдържанието е задължително" }),
  image: z.string().optional(),
  published: z.boolean().default(false),
});

// Gallery Image Schema
export const GalleryImageSchema = z.object({
  title: z.string().min(2, { message: "Заглавието е задължително" }),
  description: z.string().optional(),
  image: z.string().min(1, { message: "Изображението е задължително" }),
  category: z.string().optional(),
  featured: z.boolean().default(false),
});

// Review Schema
export const ReviewSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(2, { message: "Името е задължително" }),
  email: z.string().email({ message: "Невалиден имейл" }),
  rating: z.number().min(1).max(5, { message: "Рейтингът трябва да е между 1 и 5" }),
  comment: z.string().min(10, { message: "Коментарът трябва да е поне 10 символа" }),
});

// Contact Message Schema
export const ContactMessageSchema = z.object({
  name: z.string().min(2, { message: "Името е задължително" }),
  email: z.string().email({ message: "Невалиден имейл" }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Съобщението трябва да е поне 10 символа" }),
});

// Page Schema
export const PageSchema = z.object({
  title: z.string().min(2, { message: "Заглавието е задължително" }),
  slug: z.string().min(2, { message: "Slug е задължителен" }),
  content: z.string().min(10, { message: "Съдържанието е задължително" }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(true),
  showInNavbar: z.boolean().default(false),
  showInFooter: z.boolean().default(true),
});
