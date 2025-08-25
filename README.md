# Petition Signature Website

A modern, secure, and accessible petition signature platform built with Next.js 13, TypeScript, and Tailwind CSS. This full-featured application enables organizations to create, manage, and collect digital signatures for petitions with proper verification and administrative oversight.

## ✨ Features

### 🌟 **Public Features**
- **Responsive Homepage** with hero carousel, petition content, and real-time statistics
- **Secure Two-Step Signing Process** with email verification and digital signatures
- **Multiple Signature Methods** - drawn signatures on canvas or typed names
- **Progress Tracking** with animated progress bars and signature goals
- **Social Sharing** capabilities to amplify petition reach
- **Signature Verification** system for transparency and trust
- **Mobile-First Design** optimized for all devices

### 🔧 **Admin Dashboard**
- **Comprehensive Analytics** with signature tracking and goal monitoring
- **Content Management** for petition text, branding, and images
- **Signature Management** with filtering, searching, and CSV export
- **Homepage Carousel** management with drag-and-drop reordering
- **Site Configuration** for contact info, form settings, and features
- **Article System** for additional content and updates

### 🛡️ **Security & Reliability**
- **Email Verification** via OTP (One-Time Password) before signing
- **Form Validation** with comprehensive error handling
- **API Retry Logic** with exponential backoff
- **Admin Authentication** with session management
- **Audit Trail** with signature receipts and verification hashes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd petition-signature-site/frontend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_NAME=Your Petition Site
NEXT_PUBLIC_CONTACT_EMAIL=contact@yoursite.com
NEXT_PUBLIC_USE_MOCKS=true
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Development Mode

The application includes a complete **mock system** for local development without a backend:

### Mock Features:
- ✅ Realistic petition data with markdown content
- ✅ Simulated signature statistics and recent signers
- ✅ Working OTP flow (use code `123456` for verification)
- ✅ Complete admin dashboard with fake data
- ✅ Signature submission with generated receipts

### Admin Access (Mock Mode):
- Navigate to `/admin/login`
- Use any email/password combination
- Full dashboard functionality available

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js 13 App Router
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage with hero section
│   ├── petition/page.tsx        # Main signing flow
│   ├── thank-you/page.tsx       # Post-signature confirmation
│   ├── verify/page.tsx          # Signature verification
│   └── admin/                   # Admin dashboard
│       ├── layout.tsx           # Admin shell layout
│       ├── page.tsx             # Dashboard overview
│       ├── branding/            # Site branding management
│       ├── articles/            # Content management
│       ├── signatures/          # Signature viewer/export
│       └── [other-admin-pages]
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui component library
│   ├── admin/                  # Admin-specific components
│   ├── SignForm/               # Multi-step signing process
│   │   ├── DetailsStep.tsx     # User information form
│   │   ├── OtpDialog.tsx       # Email verification modal
│   │   └── SignatureStep.tsx   # Signature capture
│   ├── HeroCarousel.tsx        # Homepage image carousel
│   ├── ProgressBar.tsx         # Animated progress tracking
│   ├── StatsWidget.tsx         # Signature statistics
│   └── [other-components]
│
├── lib/                        # Core utilities
│   ├── api.ts                  # API client with retry logic
│   ├── schemas.ts              # Zod validation schemas
│   ├── mock.ts                 # Development mock system
│   ├── analytics.ts            # Event tracking
│   └── utils.ts                # Helper functions
│
├── types/                      # TypeScript definitions
│   └── admin.ts               # Admin interface types
│
└── hooks/                      # Custom React hooks
    └── use-toast.ts           # Toast notification system
```

## 🔌 API Integration

The frontend communicates with these backend endpoints:

### Public API
```
POST /api/otp/request     # Request email verification code
POST /api/otp/verify      # Verify OTP and get signing token
POST /api/sign            # Submit petition signature
GET  /api/stats           # Get signature statistics
GET  /api/petition        # Get petition content and settings
GET  /api/config          # Get site configuration
GET  /api/verify          # Verify signature by audit hash
```

### Admin API
```
GET  /api/admin/session       # Check admin authentication
POST /api/admin/login         # Admin login
POST /api/admin/logout        # Admin logout
GET  /api/admin/dashboard     # Dashboard statistics
GET  /api/admin/signatures    # List signatures with filters
GET  /api/admin/branding      # Site branding settings
PUT  /api/admin/branding      # Update branding
# ... additional admin endpoints
```

## 🎨 Tech Stack

### **Frontend Framework**
- **Next.js 13** with App Router for modern React development
- **TypeScript** for type safety and developer experience
- **React 18** with hooks and modern patterns

### **Styling & UI**
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible, customizable components
- **Radix UI** primitives for complex interactions
- **Lucide React** for consistent iconography

### **Forms & Validation**
- **React Hook Form** for performant form handling
- **Zod** for runtime type validation and schema definition
- **@hookform/resolvers** for seamless integration

### **Additional Libraries**
- **signature_pad** for canvas-based signature capture
- **react-markdown** for safe markdown rendering
- **embla-carousel** for touch-friendly carousels
- **recharts** for data visualization in admin
- **date-fns** for date manipulation

## ♿ Accessibility Features

This application is built with accessibility as a first-class concern:

- ✅ **Semantic HTML** with proper landmark roles
- ✅ **ARIA labels** and descriptions for screen readers
- ✅ **Keyboard navigation** throughout the application
- ✅ **Focus management** in modals and dialogs
- ✅ **Color contrast** compliance (WCAG AA)
- ✅ **Error messages** properly associated with form fields
- ✅ **Skip links** for keyboard users
- ✅ **Responsive text** that scales appropriately

## 🔒 Security Considerations

- **Email Verification**: All signatures require email verification via OTP
- **Input Validation**: All user inputs validated client and server-side
- **XSS Protection**: Markdown content sanitized before rendering
- **CSRF Protection**: Admin actions protected with proper tokens
- **Audit Trail**: All signatures include verification hashes
- **Rate Limiting**: API requests include retry logic with backoff

## 🌐 Production Deployment

### Build for Production

1. **Configure environment:**
```bash
# Set production environment variables
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_SITE_NAME=Your Production Site
NEXT_PUBLIC_CONTACT_EMAIL=contact@yoursite.com
```

2. **Build the application:**
```bash
npm run build
npm run start
```

### Deployment Options

- **Vercel** (recommended for Next.js)
- **Netlify** 
- **AWS Amplify**
- **Docker** container deployment
- **Static hosting** (after `npm run build`)

### Environment Variables for Production

```env
NEXT_PUBLIC_SITE_NAME=Your Petition Site
NEXT_PUBLIC_CONTACT_EMAIL=contact@yoursite.com
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- 📧 Email: support@yoursite.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourorg/petition-site/issues)
- 📖 Documentation: [Wiki](https://github.com/yourorg/petition-site/wiki)

---

**Built with ❤️ for organizations creating positive change**