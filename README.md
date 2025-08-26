# Petition Signature Website - Backend

A **production-ready petition signature platform** with secure backend built using Next.js 15 App Router, TypeScript, Prisma, and PostgreSQL. Features complete OTP email verification, digital signature capture, PDF receipt generation, and comprehensive admin management.

## ✨ Backend Features

### 🔐 **Security & Authentication**
- **Email verification** via OTP (One-Time Password) system
- **Session-based admin authentication** with HttpOnly cookies
- **Rate limiting** with Redis or in-memory fallback
- **Input validation** with Zod schemas
- **CSRF protection** and secure headers

### ✍️ **Signature System**
- **Digital signature capture** (drawn or typed)
- **Audit trail** with cryptographic hashing
- **PDF receipt generation** with verification QR codes
- **File storage** in PostgreSQL (no S3 dependency)
- **Signature verification** endpoint for transparency

### 📊 **Admin Dashboard**
- **Complete signature management** with filtering and search
- **CSV export** for signature data
- **Real-time statistics** and analytics
- **Content management** for petitions and site settings
- **Image upload** for homepage carousel

### 🗄️ **Database & Storage**
- **PostgreSQL** with Prisma ORM
- **Binary storage** for signatures and PDFs in database
- **Optimized queries** with proper indexing
- **Migration system** for schema updates

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **PostgreSQL** database
- **Email provider** (Resend or Postmark)
- **Redis** (optional, for production rate limiting)

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd petition-signature-site
npm install
```

2. **Environment configuration:**
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/petition_db"

# Session Secret (generate random 32+ char string)
SESSION_SECRET="your-super-secret-session-key-here-make-it-long-and-random"

# Site Configuration
SITE_BASE_URL="http://localhost:3000"

# Email Provider (choose one)
RESEND_API_KEY="your-resend-api-key"
# OR
POSTMARK_SERVER_TOKEN="your-postmark-server-token"

# Optional: Rate Limiting
RATE_LIMIT_REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development"
```

3. **Database setup:**
```bash
# Generate Prisma client
npm run db:generate

# Apply schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

4. **Start development:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the petition site.

### Default Admin Access
- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@petition.com`
- **Password:** `admin123`
- **⚠️ Important:** Change credentials in production!

## 📁 Backend Architecture

```
petition-signature-site/
├── app/api/                    # Next.js API routes
│   ├── otp/                   # Email verification endpoints
│   │   ├── request/route.ts   # POST - Request OTP code
│   │   └── verify/route.ts    # POST - Verify OTP code
│   ├── sign/route.ts          # POST - Submit petition signature
│   ├── verify/route.ts        # GET - Verify signature by audit hash
│   ├── stats/route.ts         # GET - Public signature statistics
│   ├── petition/route.ts      # GET - Petition content
│   ├── config/route.ts        # GET - Site configuration
│   ├── admin/                 # Admin-only endpoints
│   │   ├── login/route.ts     # POST - Admin authentication
│   │   ├── logout/route.ts    # POST - Admin logout
│   │   ├── session/route.ts   # GET - Check admin session
│   │   ├── signatures/        # Signature management
│   │   ├── branding/route.ts  # Site branding settings
│   │   └── [other-admin]/     # Additional admin endpoints
│   └── files/                 # File streaming
│       ├── receipt/[id]/      # Stream PDF receipts
│       └── signature-image/[id]/ # Stream signature images (admin)
├── core/                      # Business logic layer
│   ├── services/              # Core business services
│   │   ├── otp.ts            # OTP generation/verification
│   │   ├── auth.ts           # Admin authentication
│   │   ├── signatures.ts     # Signature processing
│   │   ├── petition.ts       # Petition management
│   │   ├── pdf.ts            # PDF receipt generation
│   │   ├── hashing.ts        # Cryptographic operations
│   │   └── rateLimit.ts      # Rate limiting service
│   ├── repos/                # Data access layer
│   │   ├── signatureRepo.ts  # Signature data operations
│   │   ├── petitionRepo.ts   # Petition data operations
│   │   └── settingsRepo.ts   # Settings data operations
│   ├── types.ts              # TypeScript interfaces
│   └── validation.ts         # Zod schemas
├── lib/                      # Shared utilities
│   ├── prisma.ts             # Database client
│   ├── session.ts            # Session management
│   ├── email.ts              # Email service
│   ├── env.ts                # Environment validation
│   └── adminAuth.ts          # Admin auth middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── middleware.ts             # Next.js middleware
└── __tests__/                # Test files
```

## 🔧 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/otp/request` | Request email verification code |
| POST | `/api/otp/verify` | Verify OTP and get signing token |
| POST | `/api/sign` | Submit petition signature |
| GET | `/api/verify?audit=<hash>` | Verify signature by audit hash |
| GET | `/api/stats` | Get signature statistics |
| GET | `/api/petition` | Get petition content |
| GET | `/api/config` | Get site configuration |
| GET | `/api/files/receipt/<id>` | Download PDF receipt |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin authentication |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/session` | Check admin session |
| GET | `/api/admin/signatures` | List signatures with filters |
| GET | `/api/admin/signatures/aggregates` | Get signature aggregates |
| GET | `/api/admin/signatures/export.csv` | Export signatures as CSV |
| GET/PUT | `/api/admin/branding` | Manage site branding |

## 🗃️ Database Schema

### Core Models

**Petition** - Petition content and configuration
```typescript
{
  id: string
  slug: string (unique)
  title: string
  version: string
  bodyMarkdown: string
  goalCount: number
  isLive: boolean
  heroImages: JSON
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Signature** - Individual petition signatures
```typescript
{
  id: string
  petitionId: string
  firstName: string
  lastName: string
  email: string
  city?: string
  state?: string
  zip?: string
  country?: string
  comment?: string
  consent: boolean
  method: 'drawn' | 'typed'
  signatureImage?: Bytes
  typedSignature?: string
  petitionHash: string
  signatureImageHash?: string
  auditHash: string (unique)
  ip: string
  userAgent: string
  emailVerifiedAt: DateTime
  receiptPdf?: Bytes
  receiptPdfMime?: string
  createdAt: DateTime
}
```

**OtpRequest** - Email verification tracking
```typescript
{
  id: string
  email: string
  codeHash: string
  expiresAt: DateTime
  consumedAt?: DateTime
  ip: string
  createdAt: DateTime
}
```

## 🔒 Security Features

### Rate Limiting
- **OTP requests:** 5 per 15 minutes per email, 20 per 15 minutes per IP
- **Signature submissions:** 3 per hour per email, 10 per hour per IP
- **Admin login:** 5 per 15 minutes per IP

### Data Protection
- **Email masking** in admin interface
- **Password hashing** with bcrypt (12 rounds)
- **Session encryption** with JWT and secure cookies
- **Audit hashing** for signature verification
- **Input sanitization** with Zod validation

### Infrastructure Security
- **HttpOnly cookies** for session management
- **CSRF protection** via same-site cookies
- **SQL injection protection** via Prisma
- **XSS protection** via input validation

## 📊 Monitoring & Analytics

### Signature Analytics
- Real-time signature counts
- Geographic distribution (by state/country)
- Signature velocity tracking
- Goal progress monitoring

### Admin Dashboard
- Total signatures and progress to goal
- Recent signature activity
- Geographic breakdowns
- Exportable CSV reports

## 🧪 Testing

Run tests:
```bash
# Unit tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Database validation
npm run db:validate
```

## 🚀 Production Deployment

### Environment Setup
```env
NODE_ENV="production"
DATABASE_URL="your-production-postgres-url"
SESSION_SECRET="secure-production-secret-32-chars-minimum"
SITE_BASE_URL="https://your-domain.com"
RESEND_API_KEY="your-production-resend-key"
RATE_LIMIT_REDIS_URL="your-production-redis-url"
```

### Deployment Steps
```bash
# Build application
npm run build

# Run database migrations
npm run db:migrate

# Seed production data
npm run db:seed

# Start production server
npm start
```

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Railway** (includes PostgreSQL)
- **Render** (full-stack deployment)
- **Fly.io** (global deployment)

## 📧 Email Configuration

### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Get API key from dashboard
4. Set `RESEND_API_KEY` in environment

### Postmark Setup
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Add and verify your domain
3. Get server token from dashboard
4. Set `POSTMARK_SERVER_TOKEN` in environment

## 🔧 Maintenance

### Database Operations
```bash
# Generate new migration
npx prisma migrate dev --name "description"

# Reset database (development only)
npx prisma migrate reset

# Update Prisma client
npx prisma generate

# View database
npx prisma studio
```

### Cleanup Tasks
```bash
# Clean up expired OTP requests (run periodically)
npx tsx scripts/cleanup-otps.ts

# Generate signature analytics
npx tsx scripts/generate-analytics.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 📞 Support

- 📧 Email: admin@petition.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/petition-site/issues)
- 📖 Documentation: [Wiki](https://github.com/your-org/petition-site/wiki)

---

**Built for organizations creating positive change through digital advocacy.**
