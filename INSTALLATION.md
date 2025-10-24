# 🚀 SGH Trasporti - Installation & Setup Guide

## 📋 Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** - Local or MongoDB Atlas account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

## 🛠️ Step-by-Step Installation

### 1. Clone or Navigate to the Project

```bash
cd e:\SGH-Trasporti
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## ⚙️ Environment Configuration

### Backend Configuration

1. Create `.env` file in the `backend` directory:
```bash
cd backend
copy ..\\.env.example .env
```

2. Open `backend\.env` and configure the following:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sgh-trasporti
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sgh-trasporti

# JWT Secrets (generate secure keys)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-token-secret-here

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=SGH Trasporti <noreply@sghtrasporti.com>

# Admin Credentials
ADMIN_EMAIL=admin@sghtrasporti.com
ADMIN_PASSWORD=Admin@123456

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Frontend Configuration

1. Create `.env.local` file in the `frontend` directory:
```bash
cd frontend
copy .env.example .env.local
```

2. Open `frontend\.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## 🗄️ Database Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
```bash
mongod
```
3. The database will be created automatically when you run the seed script

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update `MONGODB_URI` in `backend\.env` with your connection string
6. Replace `<password>` with your database user password

### Seed Initial Data

```bash
cd backend
npm run seed
```

This will create:
- Admin user (credentials from .env)
- Sample vehicles
- Initial data

## 🚀 Running the Application

### Option 1: Run Everything Together (Recommended)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Public Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/it/admin/dashboard
- **API Documentation:** http://localhost:5000/api/health

### Default Admin Credentials

- **Email:** admin@sghtrasporti.com
- **Password:** Admin@123456

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

## 🔧 Additional Configuration

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Maps JavaScript API" and "Geocoding API"
4. Create API credentials
5. Add the API key to `frontend\.env.local`

### Google reCAPTCHA

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Get site key and secret key
4. Add to `.env` files

### Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use this password in `EMAIL_PASSWORD` in `backend\.env`

## 📦 Production Build

### Build Backend

```bash
cd backend
npm run build
npm start
```

### Build Frontend

```bash
cd frontend
npm run build
npm start
```

### Build Everything

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change `PORT` in `backend\.env`
2. Update `NEXT_PUBLIC_API_URL` in `frontend\.env.local`

### MongoDB Connection Error

- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- For Atlas: Check IP whitelist and database user permissions

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm run install:all
```

### Build Errors

```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

## 📚 Project Structure

```
SGH-Trasporti/
├── backend/                # Express.js API
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, errors
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Email, business logic
│   │   └── server.js      # Entry point
│   └── package.json
│
├── frontend/              # Next.js 15
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/   # React components
│   │   ├── lib/          # API client, utilities
│   │   └── i18n/         # Translations
│   └── package.json
│
├── .env.example          # Environment template
├── README.md             # Documentation
└── package.json          # Root package file
```

## 🔐 Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up MongoDB authentication
- [ ] Use environment-specific configs
- [ ] Enable security headers
- [ ] Set up backup strategy
- [ ] Configure logging and monitoring

## 📱 Available Scripts

### Root Directory

- `npm run dev` - Run both frontend and backend
- `npm run build` - Build both applications
- `npm start` - Start production servers
- `npm run install:all` - Install all dependencies

### Backend

- `npm run dev` - Development server with hot reload
- `npm start` - Production server
- `npm run seed` - Seed database with initial data

### Frontend

- `npm run dev` - Next.js development server
- `npm run build` - Build for production
- `npm start` - Production server
- `npm run lint` - Run ESLint

## 🌍 Multilingual Support

The platform supports 3 languages out of the box:
- 🇮🇹 Italian (default)
- 🇬🇧 English
- 🇫🇷 French

Translation files: `frontend/src/i18n/locales/`

## 📞 Support & Documentation

For more information, check:
- Main README.md in root directory
- API documentation at `/api` endpoints
- Component documentation in source files

## ✨ Next Steps

1. ✅ Complete the installation
2. ✅ Access the admin dashboard
3. ✅ Change default admin credentials
4. ✅ Configure email settings
5. ✅ Add Google Maps API key
6. ✅ Customize branding and content
7. ✅ Add your vehicles to the fleet
8. ✅ Test booking and tracking features

---

**Need help?** Check the troubleshooting section or review the main README.md

**Ready for production?** Review the Security Checklist above
