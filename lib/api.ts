export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PetitionData {
  title: string;
  version: string;
  bodyMarkdown: string;
  heroImages: string[];
  isLive: boolean;
  goal: number;
}

export interface StatsData {
  count: number;
  goal: number;
  recent: Array<{ first: string; lastInitial: string; state?: string }>;
  byState: Record<string, number>;
}

export interface ConfigData {
  commentsEnabled: boolean;
  showRecent: boolean;
}

export interface SignPayload {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state: string;
  zip: string;
  comment?: string;
  consent: boolean;
  method: 'drawn' | 'typed';
  signatureImageBase64?: string;
  typedSignature?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetchWithRetry(url, options);
  const data = await response.json();
  return data;
}

export const api = {
  async requestOtp(email: string): Promise<{ ok: boolean }> {
    return apiRequest('/api/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyOtp(email: string, code: string): Promise<{ ok: boolean; token: string }> {
    return apiRequest('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async signPetition(token: string, payload: SignPayload): Promise<{ ok: boolean; receiptUrl: string; auditHash: string }> {
    return apiRequest('/api/sign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async getStats(): Promise<StatsData> {
    return apiRequest('/api/stats');
  },

  async getPetition(): Promise<PetitionData> {
    return apiRequest('/api/petition');
  },

  async getConfig(): Promise<ConfigData> {
    return apiRequest('/api/config');
  },

  async verifySignature(auditHash: string): Promise<{ valid: boolean; message: string }> {
    return apiRequest(`/api/verify?audit=${encodeURIComponent(auditHash)}`);
  },
};

export function useApi() {
  return api;
}

export function useAdminApi() {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    return import('./mock').then(m => m.mockAdminApi);
  }
  return Promise.resolve(adminApi);
}

// Admin API methods
async function uploadMultipart(endpoint: string, data: Record<string, any>): Promise<any> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetchWithRetry(url, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}

async function putJson(endpoint: string, data: any): Promise<any> {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function deleteRequest(endpoint: string): Promise<any> {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
}

export const adminApi = {
  getSession: () => apiRequest<{ ok: boolean }>("/api/admin/session"),
  login: (body: { email: string; password: string }) => apiRequest<{ ok: boolean }>("/api/admin/login", {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  logout: () => apiRequest<{ ok: boolean }>("/api/admin/logout", {
    method: 'POST',
    body: JSON.stringify({}),
  }),
  getDashboard: () => apiRequest<import('../types/admin').DashboardStats>("/api/admin/dashboard"),
  getBranding: () => apiRequest<import('../types/admin').Branding>("/api/admin/branding"),
  putBranding: (b: import('../types/admin').Branding) => putJson("/api/admin/branding", b),
  getSlider: () => apiRequest<{ images: import('../types/admin').SliderImage[] }>("/api/admin/slider"),
  postSlider: (file: File, alt: string) => uploadMultipart("/api/admin/slider", { file, alt }),
  putSliderOrder: (order: Array<{ id: string; order: number }>) => putJson("/api/admin/slider/order", { order }),
  deleteSlider: (id: string) => deleteRequest(`/api/admin/slider/${id}`),
  listArticles: () => apiRequest<import('../types/admin').Article[]>("/api/admin/articles"),
  getArticle: (id: string) => apiRequest<import('../types/admin').Article>(`/api/admin/articles/${id}`),
  postArticle: (a: Omit<import('../types/admin').Article, "id" | "updatedAt">) => apiRequest("/api/admin/articles", {
    method: 'POST',
    body: JSON.stringify(a),
  }),
  putArticle: (id: string, a: Partial<import('../types/admin').Article>) => putJson(`/api/admin/articles/${id}`, a),
  deleteArticle: (id: string) => deleteRequest(`/api/admin/articles/${id}`),
  getContact: () => apiRequest<import('../types/admin').ContactInfo>("/api/admin/contact"),
  putContact: (c: import('../types/admin').ContactInfo) => putJson("/api/admin/contact", c),
  getFormHelp: () => apiRequest<import('../types/admin').FormHelpText>("/api/admin/form-helptext"),
  putFormHelp: (f: import('../types/admin').FormHelpText) => putJson("/api/admin/form-helptext", f),
  listSignatures: (q: URLSearchParams) => apiRequest<{ items: import('../types/admin').SignatureRow[]; total: number }>(`/api/admin/signatures?${q}`),
  getAggregates: (q: URLSearchParams) => apiRequest<import('../types/admin').SignatureAggregates>(`/api/admin/signatures/aggregates?${q}`),
  exportCsvUrl: (q: URLSearchParams) => {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
    return `${baseUrl}/api/admin/signatures/export.csv?${q}`;
  }
};