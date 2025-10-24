# 📁 SGH Trasporti - Complete Project Structure

```
SGH-Trasporti/
│
├── 📄 package.json                     # Root package with dev/build scripts
├── 📄 .gitignore                       # Git ignore patterns
├── 📄 .env.example                     # Environment variables template
├── 📄 README.md                        # Main documentation
├── 📄 INSTALLATION.md                  # Setup guide
├── 📄 PROJECT_SUMMARY.md              # Project overview
├── 📄 setup.bat                        # Windows setup script
├── 📄 start.bat                        # Windows start script
├── 📄 cahier-de-charge.txt            # Original specifications
│
├── 📁 .vscode/                         # VS Code settings
│   ├── settings.json                   # Editor preferences
│   └── extensions.json                 # Recommended extensions
│
├── 📁 backend/                         # Express.js API Server
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 config/
│   │   │   └── database.js            # MongoDB connection
│   │   │
│   │   ├── 📁 controllers/            # Request handlers
│   │   │   ├── authController.js      # Authentication logic
│   │   │   ├── bookingController.js   # Booking CRUD operations
│   │   │   ├── trackingController.js  # Shipment tracking
│   │   │   ├── quoteController.js     # Quote management
│   │   │   ├── vehicleController.js   # Fleet management
│   │   │   ├── applicationController.js # Job applications
│   │   │   ├── contactController.js   # Contact form handler
│   │   │   └── dashboardController.js # Admin statistics
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── auth.js                # JWT authentication
│   │   │   ├── errorHandler.js        # Global error handling
│   │   │   └── validate.js            # Input validation
│   │   │
│   │   ├── 📁 models/                 # MongoDB schemas
│   │   │   ├── User.js                # User accounts
│   │   │   ├── Booking.js             # Transport bookings
│   │   │   ├── Quote.js               # Quote requests
│   │   │   ├── Vehicle.js             # Fleet vehicles
│   │   │   ├── Application.js         # Job applications
│   │   │   └── Contact.js             # Contact messages
│   │   │
│   │   ├── 📁 routes/                 # API endpoints
│   │   │   ├── authRoutes.js          # /api/auth/*
│   │   │   ├── bookingRoutes.js       # /api/bookings/*
│   │   │   ├── trackingRoutes.js      # /api/tracking/*
│   │   │   ├── quoteRoutes.js         # /api/quotes/*
│   │   │   ├── vehicleRoutes.js       # /api/fleet/*
│   │   │   ├── applicationRoutes.js   # /api/applications/*
│   │   │   ├── contactRoutes.js       # /api/contact/*
│   │   │   └── dashboardRoutes.js     # /api/dashboard/*
│   │   │
│   │   ├── 📁 services/
│   │   │   └── emailService.js        # Email notifications
│   │   │
│   │   ├── 📁 scripts/
│   │   │   └── seed.js                # Database seeding
│   │   │
│   │   └── 📄 server.js               # Express app entry point
│   │
│   ├── 📁 uploads/                    # File uploads directory
│   │   └── .gitkeep
│   │
│   ├── 📄 package.json                # Backend dependencies
│   └── 📄 .env                        # Backend environment (create from .env.example)
│
└── 📁 frontend/                        # Next.js 15 Application
    │
    ├── 📁 public/                      # Static assets
    │   └── index.html                  # HTML template
    │
    ├── 📁 src/
    │   │
    │   ├── 📁 app/                     # Next.js App Router
    │   │   │
    │   │   ├── 📄 page.tsx            # Root redirect to /it
    │   │   ├── 📄 globals.css         # Global styles + Tailwind
    │   │   │
    │   │   └── 📁 [locale]/           # Internationalized routes
    │   │       │
    │   │       ├── 📄 layout.tsx      # Root layout with i18n
    │   │       ├── 📄 page.tsx        # Homepage
    │   │       │
    │   │       ├── 📁 admin/          # Admin dashboard
    │   │       │   ├── 📁 dashboard/
    │   │       │   │   └── page.tsx   # Dashboard overview
    │   │       │   └── 📁 bookings/
    │   │       │       └── page.tsx   # Bookings management
    │   │       │
    │   │       └── 📁 auth/           # Authentication
    │   │           └── 📁 login/
    │   │               └── page.tsx   # Login page
    │   │
    │   ├── 📁 components/             # React components
    │   │   │
    │   │   ├── 📁 layout/
    │   │   │   ├── Header.tsx         # Main navigation
    │   │   │   └── Footer.tsx         # Site footer
    │   │   │
    │   │   ├── 📁 home/              # Homepage sections
    │   │   │   ├── HeroSection.tsx    # Hero with CTA
    │   │   │   ├── StatsSection.tsx   # Animated counters
    │   │   │   ├── ServicesSection.tsx # Services grid
    │   │   │   └── WhyUsSection.tsx   # Features
    │   │   │
    │   │   └── 📁 admin/
    │   │       └── AdminLayout.tsx    # Admin sidebar layout
    │   │
    │   ├── 📁 lib/                    # Utilities
    │   │   ├── api.ts                 # Axios API client
    │   │   └── utils.ts               # Helper functions
    │   │
    │   ├── 📁 i18n/                   # Internationalization
    │   │   ├── 📁 locales/
    │   │   │   ├── it.json           # Italian translations
    │   │   │   ├── en.json           # English translations
    │   │   │   └── fr.json           # French translations
    │   │   └── i18n.ts               # i18n config
    │   │
    │   └── 📄 middleware.ts          # Next.js middleware (i18n)
    │
    ├── 📄 package.json               # Frontend dependencies
    ├── 📄 .env.local                 # Frontend environment (create from .env.example)
    ├── 📄 .env.example               # Frontend env template
    ├── 📄 next.config.js             # Next.js configuration
    ├── 📄 tailwind.config.js         # TailwindCSS config
    ├── 📄 postcss.config.js          # PostCSS config
    └── 📄 tsconfig.json              # TypeScript config
```

## 📊 File Count Summary

### Backend
- **Controllers:** 8 files
- **Models:** 6 files
- **Routes:** 8 files
- **Middleware:** 3 files
- **Services:** 1 file
- **Scripts:** 1 file
- **Config:** 1 file
- **Total:** ~30 backend files

### Frontend
- **Pages:** 4+ pages (with locale variants)
- **Components:** 8+ components
- **Layouts:** 2 layouts
- **Translations:** 3 language files
- **Utilities:** 2+ utility files
- **Config:** 5 config files
- **Total:** ~25 frontend files

### Root & Documentation
- **Documentation:** 4 files (README, INSTALLATION, SUMMARY, STRUCTURE)
- **Configuration:** 3 files (.env.example, package.json, .gitignore)
- **Scripts:** 2 files (setup.bat, start.bat)
- **VS Code:** 2 files (settings, extensions)
- **Total:** ~12 root files

## 📈 Total Project Files: ~70+ files

## 🎯 Key Directories Explained

### `/backend/src/controllers/`
Contains business logic for each API endpoint. Each controller handles specific operations (CRUD, authentication, etc.)

### `/backend/src/models/`
MongoDB schemas using Mongoose. Defines data structure, validation, and relationships.

### `/backend/src/routes/`
API route definitions. Maps HTTP methods and paths to controller functions.

### `/frontend/src/app/[locale]/`
Next.js 15 App Router with internationalization. Each folder represents a route.

### `/frontend/src/components/`
Reusable React components organized by feature or layout type.

### `/frontend/src/lib/`
Shared utilities, API client, helper functions used across the application.

### `/frontend/src/i18n/locales/`
Translation files for each supported language (IT, EN, FR).

## 🔄 Data Flow

```
Client Request
    ↓
Frontend (Next.js)
    ↓
API Client (Axios)
    ↓
Backend Routes
    ↓
Middleware (Auth, Validation)
    ↓
Controllers (Business Logic)
    ↓
Models (Database)
    ↓
MongoDB
```

## 🚀 Quick Navigation

### Most Important Files to Start With:

1. **`README.md`** - Start here for overview
2. **`INSTALLATION.md`** - Follow for setup
3. **`backend/src/server.js`** - Backend entry point
4. **`frontend/src/app/[locale]/page.tsx`** - Homepage
5. **`.env.example`** - Configuration template

### Configuration Files:

- **Backend:** `backend/.env`
- **Frontend:** `frontend/.env.local`
- **Database:** MongoDB connection in backend/.env
- **API:** `frontend/src/lib/api.ts`

### Adding New Features:

1. **New API Endpoint:**
   - Add model in `/backend/src/models/`
   - Add controller in `/backend/src/controllers/`
   - Add route in `/backend/src/routes/`
   - Register route in `/backend/src/server.js`

2. **New Page:**
   - Add page in `/frontend/src/app/[locale]/`
   - Add translations in `/frontend/src/i18n/locales/`
   - Add navigation link in Header component

3. **New Component:**
   - Create in `/frontend/src/components/`
   - Import and use in pages
   - Style with Tailwind classes

## 📝 Notes

- All TypeScript files use `.tsx` for React components and `.ts` for utilities
- All React components use functional components with hooks
- API routes follow RESTful conventions
- Authentication uses JWT stored in HTTP-only cookies
- All timestamps are handled by Mongoose (createdAt, updatedAt)
- File uploads go to `/backend/uploads/`
- Environment variables are prefixed with `NEXT_PUBLIC_` for client-side access

---

**This structure follows industry best practices and is designed for scalability and maintainability.**
