import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const brandingSchema = z.object({
  siteTitleLine1: z.string().min(1, "First line is required").max(60, "Must be 60 characters or less"),
  siteTitleLine2: z.string().min(1, "Second line is required").max(60, "Must be 60 characters or less"),
});

export const sliderUploadSchema = z.object({
  alt: z.string().min(1, "Alt text is required").max(100, "Must be 100 characters or less"),
});

export const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title must be 120 characters or less"),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(120, "Slug must be 120 characters or less"),
  excerpt: z.string().max(240, "Excerpt must be 240 characters or less").optional(),
  bodyMarkdown: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
});

export const contactSchema = z.object({
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().max(40, "Phone must be 40 characters or less").optional(),
  address: z.string().max(200, "Address must be 200 characters or less").optional(),
  socialLinks: z.object({
    x: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    facebook: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    instagram: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  }).optional(),
});

export const formHelpTextSchema = z.object({
  whyLine1: z.string().min(1, "Line 1 is required").max(120, "Must be 120 characters or less"),
  whyLine2: z.string().min(1, "Line 2 is required").max(120, "Must be 120 characters or less"),
  whyLine3: z.string().min(1, "Line 3 is required").max(120, "Must be 120 characters or less"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type BrandingForm = z.infer<typeof brandingSchema>;
export type SliderUploadForm = z.infer<typeof sliderUploadSchema>;
export type ArticleForm = z.infer<typeof articleSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type FormHelpTextForm = z.infer<typeof formHelpTextSchema>;