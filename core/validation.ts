import { z } from 'zod';

export const otpRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const otpVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be numeric'),
});

export const signatureInputSchema = z.object({
  petitionSlug: z.string().min(1, 'Petition slug is required'),
  firstName: z.string().min(1, 'First name is required').max(60, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(60, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  city: z.string().max(100, 'City name too long').optional(),
  state: z.string().length(2, 'State must be 2 characters').optional(),
  zip: z.string().min(3, 'ZIP too short').max(10, 'ZIP too long').optional(),
  country: z.string().length(2, 'Country must be 2 characters').optional(),
  comment: z.string().max(500, 'Comment too long').optional(),
  consent: z.boolean().refine(val => val === true, 'Consent is required'),
  method: z.enum(['drawn', 'typed']),
  signatureImageBase64: z.string().optional(),
  typedSignature: z.string().optional(),
}).refine(data => {
  if (data.method === 'drawn' && !data.signatureImageBase64) {
    return false;
  }
  if (data.method === 'typed' && !data.typedSignature) {
    return false;
  }
  return true;
}, {
  message: 'Signature data is required based on method',
});

export const signRequestSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  payload: signatureInputSchema,
});

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const petitionUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  version: z.string().min(1, 'Version is required').max(20, 'Version too long').optional(),
  bodyMarkdown: z.string().min(1, 'Body is required').optional(),
  goalCount: z.number().int().min(1, 'Goal must be positive').optional(),
  isLive: z.boolean().optional(),
  heroImages: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    alt: z.string(),
    order: z.number().int().min(0),
  })).optional(),
});

export const brandingUpdateSchema = z.object({
  siteTitleLine1: z.string().min(1, 'Site title line 1 is required').max(100, 'Title too long').optional(),
  siteTitleLine2: z.string().min(1, 'Site title line 2 is required').max(100, 'Title too long').optional(),
});

export const contactInfoUpdateSchema = z.object({
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().max(20, 'Phone too long').optional(),
  address: z.string().max(200, 'Address too long').optional(),
  socialLinks: z.object({
    x: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
});

export const formHelpTextUpdateSchema = z.object({
  whyLine1: z.string().min(1, 'Line 1 is required').max(200, 'Line too long').optional(),
  whyLine2: z.string().min(1, 'Line 2 is required').max(200, 'Line too long').optional(),
  whyLine3: z.string().min(1, 'Line 3 is required').max(200, 'Line too long').optional(),
});

export const sliderImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().min(1, 'Alt text is required'),
  order: z.number().int().min(0),
});

export const sliderOrderSchema = z.object({
  order: z.array(z.object({
    id: z.string(),
    order: z.number().int().min(0),
  })),
});

export const signatureFiltersSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(25),
});

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type SignatureInput = z.infer<typeof signatureInputSchema>;
export type SignRequestInput = z.infer<typeof signRequestSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type PetitionUpdateInput = z.infer<typeof petitionUpdateSchema>;
export type BrandingUpdateInput = z.infer<typeof brandingUpdateSchema>;
export type ContactInfoUpdateInput = z.infer<typeof contactInfoUpdateSchema>;
export type FormHelpTextUpdateInput = z.infer<typeof formHelpTextUpdateSchema>;
export type SliderImageInput = z.infer<typeof sliderImageSchema>;
export type SliderOrderInput = z.infer<typeof sliderOrderSchema>;
export type SignatureFiltersInput = z.infer<typeof signatureFiltersSchema>;
