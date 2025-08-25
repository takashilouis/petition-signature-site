import type { PetitionData, StatsData, ConfigData, SignPayload } from './api';

export const mockPetition: PetitionData = {
  title: 'Protect Our Local Environment',
  version: '1.2',
  bodyMarkdown: `# Protect Our Local Environment

We, the undersigned, call upon our local government to take immediate action to protect our environment and ensure a sustainable future for our community.

## Why This Matters

Our local environment faces unprecedented challenges:

- **Air Quality**: Increasing pollution from industrial sources
- **Water Safety**: Contamination threats to our drinking water supply  
- **Green Spaces**: Loss of parks and natural areas to development
- **Wildlife Protection**: Habitat destruction affecting local ecosystems

## Our Demands

We demand that our representatives:

1. **Implement stricter environmental regulations** for industrial activities
2. **Invest in renewable energy infrastructure** for our community
3. **Preserve existing green spaces** and create new parks
4. **Establish wildlife corridors** to protect local ecosystems
5. **Mandate environmental impact assessments** for all new developments

## The Time Is Now

Every signature counts. Join thousands of your neighbors in demanding action on the environmental crisis affecting our community.

Together, we can create lasting change and ensure a healthy, sustainable future for generations to come.`,
  heroImages: [
    'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/414102/pexels-photo-414102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ],
  isLive: true,
  goal: 10000,
};

export const mockStats: StatsData = {
  count: 7834,
  goal: 10000,
  recent: [
    { first: 'Sarah', lastInitial: 'M', state: 'CA' },
    { first: 'Michael', lastInitial: 'R', state: 'NY' },
    { first: 'Jennifer', lastInitial: 'L', state: 'TX' },
    { first: 'David', lastInitial: 'K', state: 'FL' },
    { first: 'Emily', lastInitial: 'S', state: 'WA' },
  ],
  byState: {
    'CA': 1543,
    'NY': 1234,
    'TX': 987,
    'FL': 876,
    'WA': 654,
    'IL': 543,
    'PA': 432,
    'OH': 321,
    'GA': 298,
    'NC': 267,
  },
};

export const mockConfig: ConfigData = {
  commentsEnabled: true,
  showRecent: true,
};

export const mockApi = {
  async requestOtp(email: string): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return { ok: true };
  },

  async verifyOtp(email: string, code: string): Promise<{ ok: boolean; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === '123456') {
      return { ok: true, token: 'mock-jwt-token-12345' };
    }
    return { ok: false, token: '' };
  },

  async signPetition(token: string, payload: SignPayload): Promise<{ ok: boolean; receiptUrl: string; auditHash: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      ok: true,
      receiptUrl: 'https://example.com/receipt/abc123',
      auditHash: 'hash-' + Math.random().toString(36).substr(2, 9),
    };
  },

  async getStats(): Promise<StatsData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStats;
  },

  async getPetition(): Promise<PetitionData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPetition;
  },

  async getConfig(): Promise<ConfigData> {
    return mockConfig;
  },

  async verifySignature(auditHash: string): Promise<{ valid: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      valid: auditHash.startsWith('hash-'),
      message: auditHash.startsWith('hash-') ? 'Signature verified successfully' : 'Invalid or not found',
    };
  },
};

export const mockAdminApi = {
  async getSession(): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true };
  },

  async login(body: { email: string; password: string }): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simple mock - accept any email/password for development
    return { ok: true };
  },

  async logout(): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ok: true };
  },

  async getDashboard(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalSignatures: 7834,
      past24h: 156,
      goalProgress: 78.34,
      sliderImagesCount: 3,
    };
  },

  async getBranding(): Promise<any> {
    return {
      siteTitleLine1: 'Protect Our',
      siteTitleLine2: 'Local Environment',
    };
  },

  async putBranding(data: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ok: true };
  },

  async getSlider(): Promise<any> {
    return {
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg', alt: 'Environment protection', order: 1 },
        { id: '2', url: 'https://images.pexels.com/photos/414102/pexels-photo-414102.jpeg', alt: 'Clean water', order: 2 },
        { id: '3', url: 'https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg', alt: 'Green spaces', order: 3 },
      ],
    };
  },

  async postSlider(file: File, alt: string): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { ok: true };
  },

  async putSliderOrder(order: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ok: true };
  },

  async deleteSlider(id: string): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ok: true };
  },

  async listArticles(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: '1',
        title: 'Why Environmental Protection Matters',
        slug: 'why-environmental-protection-matters',
        excerpt: 'Understanding the importance of protecting our local environment.',
        bodyMarkdown: '# Why Environmental Protection Matters\n\nOur environment needs protection...',
        status: 'published',
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  async getArticle(id: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      title: 'Why Environmental Protection Matters',
      slug: 'why-environmental-protection-matters',
      excerpt: 'Understanding the importance of protecting our local environment.',
      bodyMarkdown: '# Why Environmental Protection Matters\n\nOur environment needs protection...',
      status: 'published',
      updatedAt: new Date().toISOString(),
    };
  },

  async postArticle(article: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ok: true };
  },

  async putArticle(id: string, article: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ok: true };
  },

  async deleteArticle(id: string): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ok: true };
  },

  async getContact(): Promise<any> {
    return {
      contactEmail: 'contact@petition.org',
      contactPhone: '(555) 123-4567',
      address: '123 Main St, City, State 12345',
      socialLinks: {
        x: 'https://x.com/petition',
        facebook: 'https://facebook.com/petition',
        instagram: 'https://instagram.com/petition',
      },
    };
  },

  async putContact(contact: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { ok: true };
  },

  async getFormHelp(): Promise<any> {
    return {
      whyLine1: 'Your signature makes a difference in protecting our environment',
      whyLine2: 'Join thousands of community members taking action',
      whyLine3: 'Together we can create lasting change for future generations',
    };
  },

  async putFormHelp(formHelp: any): Promise<{ ok: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ok: true };
  },

  async listSignatures(query: URLSearchParams): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      items: [
        {
          id: '1',
          firstName: 'John',
          lastInitial: 'D',
          emailMasked: 'j***@example.com',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastInitial: 'M',
          emailMasked: 's***@example.com',
          city: 'Los Angeles',
          state: 'CA',
          country: 'US',
          createdAt: new Date().toISOString(),
        },
      ],
      total: 7834,
    };
  },

  async getAggregates(query: URLSearchParams): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      byCity: [
        { key: 'San Francisco', count: 1543 },
        { key: 'Los Angeles', count: 1234 },
        { key: 'New York', count: 987 },
      ],
      byState: [
        { key: 'CA', count: 2777 },
        { key: 'NY', count: 1543 },
        { key: 'TX', count: 1234 },
      ],
      byCountry: [
        { key: 'US', count: 7500 },
        { key: 'CA', count: 200 },
        { key: 'UK', count: 134 },
      ],
    };
  },

  exportCsvUrl(query: URLSearchParams): string {
    return `/api/admin/signatures/export.csv?${query}`;
  },
};