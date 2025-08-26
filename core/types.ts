export interface PetitionData {
  id: string;
  slug: string;
  title: string;
  version: string;
  bodyMarkdown: string;
  goalCount: number;
  isLive: boolean;
  heroImages: HeroImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface SignatureData {
  id: string;
  petitionId: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  comment?: string;
  consent: boolean;
  method: 'drawn' | 'typed';
  signatureImage?: Buffer;
  typedSignature?: string;
  petitionHash: string;
  signatureImageHash?: string;
  auditHash: string;
  ip: string;
  userAgent: string;
  emailVerifiedAt: Date;
  createdAt: Date;
  receiptPdf?: Buffer;
  receiptPdfMime?: string;
}

export interface SignatureInput {
  petitionSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  comment?: string;
  consent: boolean;
  method: 'drawn' | 'typed';
  signatureImageBase64?: string;
  typedSignature?: string;
}

export interface OtpRequestData {
  id: string;
  email: string;
  codeHash: string;
  expiresAt: Date;
  consumedAt?: Date;
  ip: string;
  createdAt: Date;
}

export interface AdminUserData {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface BrandingData {
  id: number;
  siteTitleLine1: string;
  siteTitleLine2: string;
}

export interface ContactInfoData {
  id: number;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    x?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface FormHelpTextData {
  id: number;
  whyLine1: string;
  whyLine2: string;
  whyLine3: string;
}

export interface StatsData {
  count: number;
  goal: number;
  recent: Array<{
    first: string;
    lastInitial: string;
    state?: string;
  }>;
  byState: Record<string, number>;
}

export interface SignatureFilters {
  city?: string;
  state?: string;
  country?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  size?: number;
}

export interface SignatureAggregates {
  byCity: Array<{ key: string; count: number }>;
  byState: Array<{ key: string; count: number }>;
  byCountry: Array<{ key: string; count: number }>;
}

export interface VerificationResult {
  ok: boolean;
  petition?: {
    title: string;
    version: string;
  };
  signedAt?: Date;
  city?: string;
  state?: string;
  country?: string;
}
