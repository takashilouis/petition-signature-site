export type Branding = { 
  siteTitleLine1: string; 
  siteTitleLine2: string; 
};

export type SliderImage = { 
  id: string; 
  url: string; 
  alt: string; 
  order: number; 
};

export type Article = {
  id: string; 
  title: string; 
  slug: string; 
  excerpt: string;
  bodyMarkdown: string; 
  status: "draft" | "published"; 
  updatedAt: string;
};

export type ContactInfo = {
  contactEmail: string; 
  contactPhone?: string; 
  address?: string;
  socialLinks?: { 
    x?: string; 
    facebook?: string; 
    instagram?: string; 
  };
};

export type FormHelpText = { 
  whyLine1: string; 
  whyLine2: string; 
  whyLine3: string; 
};

export type SignatureRow = {
  id: string;
  firstName: string;
  lastInitial: string;
  emailMasked: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: string;
};

export type SignatureAggregates = {
  byCity: Array<{ key: string; count: number }>;
  byState: Array<{ key: string; count: number }>;
  byCountry: Array<{ key: string; count: number }>;
};

export type DashboardStats = {
  totalSignatures: number;
  past24h: number;
  goalProgress: number;
  sliderImagesCount: number;
};