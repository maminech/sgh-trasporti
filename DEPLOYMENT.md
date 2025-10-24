# SGH Trasporti - Deployment Guide

## 🚀 Complete Setup & Deployment Guide

### 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Testing the Application](#testing-the-application)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Default Credentials](#default-credentials)

---

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Running locally or MongoDB Atlas
- **npm** or **yarn**
- **Git**

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SGH-Trasporti
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration (see Environment Variables section)

# Seed the database with admin user and sample data
node src/scripts/seed.js

# Start the backend server
node src/server.js
# or
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your configuration

# Start the development server
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

---

## Testing the Application

### 1. Access the Website
Open your browser and navigate to:
```
http://localhost:3000
```

Available languages:
- Italian: `http://localhost:3000/it`
- English: `http://localhost:3000/en`
- French: `http://localhost:3000/fr`

### 2. Test Admin Dashboard

**Login as Admin:**
```
URL: http://localhost:3000/it/auth/login
Email: admin@sghtrasporti.com
Password: Admin123!
```

After login, you'll be redirected to the admin dashboard at:
```
http://localhost:3000/it/admin/dashboard
```

**Admin Features:**
- View dashboard statistics
- Manage bookings and quotes
- Manage fleet vehicles
- View client list
- Review job applications
- Check contact messages

### 3. Test Customer Portal

**Register a new customer:**
1. Go to: `http://localhost:3000/it/auth/register`
2. Fill in the registration form
3. Submit the form
4. Login with your new credentials

**Customer Portal Features:**
- View dashboard with booking statistics
- View active and completed bookings
- View and download invoices
- Create new bookings
- Request quotes
- Track shipments

### 4. Test Public Features

**Without Login:**
- ✅ Browse all pages (Home, About, Services, Fleet, Careers, Contact)
- ✅ Switch languages (IT/EN/FR)
- ✅ Submit quote requests
- ✅ Submit booking requests
- ✅ Track shipments with tracking code
- ✅ Submit career applications
- ✅ Send contact messages

---

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Render/Railway (Backend)

#### Backend (Render.com or Railway.app)

1. **Create a new Web Service**
2. **Connect your Git repository**
3. **Configure Build & Start Commands:**
   ```
   Build Command: npm install
   Start Command: node src/server.js
   ```
4. **Add Environment Variables** (see Environment Variables section)
5. **Deploy**

#### Frontend (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard
4. **Update NEXT_PUBLIC_API_URL** to your backend URL

### Option 2: Deploy to AWS/DigitalOcean/Azure

1. **Set up a VPS** (Ubuntu 22.04 recommended)
2. **Install Node.js and MongoDB**
3. **Clone the repository**
4. **Set up PM2 for process management:**
   ```bash
   npm install -g pm2
   
   # Backend
   cd backend
   pm2 start src/server.js --name sgh-backend
   
   # Frontend
   cd frontend
   npm run build
   pm2 start npm --name sgh-frontend -- start
   ```

5. **Set up Nginx as reverse proxy**
6. **Configure SSL with Let's Encrypt**

### Option 3: Docker Deployment

```bash
# Backend
cd backend
docker build -t sgh-backend .
docker run -p 5000:5000 --env-file .env sgh-backend

# Frontend
cd frontend
docker build -t sgh-frontend .
docker run -p 3000:3000 --env-file .env.local sgh-frontend
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/sgh-trasporti
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sgh-trasporti

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (for password reset, notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@sghtrasporti.com

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@sghtrasporti.com
ADMIN_PASSWORD=Admin123!

# File Upload
MAX_FILE_SIZE=10485760
FILE_UPLOAD_PATH=./uploads

# API Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=SGH Trasporti
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Maps API (optional - for tracking maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## Default Credentials

### Admin Account
After running the seed script, you can login with:

```
Email: admin@sghtrasporti.com
Password: Admin123!
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

### Test Customer Account
You can register a new customer account through:
```
http://localhost:3000/it/auth/register
```

Or create one manually in MongoDB:
```javascript
{
  name: "Test Customer",
  email: "customer@test.com",
  password: "Test@123456", // Will be hashed automatically
  phone: "+39 123 456 7890",
  role: "client",
  emailVerified: true
}
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `PUT /auth/updatedetails` - Update profile
- `PUT /auth/updatepassword` - Change password

### Bookings
- `GET /bookings` - Get all bookings (admin)
- `GET /bookings/my-bookings` - Get user's bookings
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking by ID
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Delete booking

### Quotes
- `GET /quotes` - Get all quotes
- `POST /quotes` - Create quote
- `GET /quotes/:id` - Get quote by ID
- `PUT /quotes/:id` - Update quote
- `DELETE /quotes/:id` - Delete quote

### Fleet
- `GET /fleet` - Get all vehicles
- `POST /fleet` - Create vehicle (admin)
- `GET /fleet/:id` - Get vehicle by ID
- `PUT /fleet/:id` - Update vehicle
- `DELETE /fleet/:id` - Delete vehicle

### Tracking
- `GET /tracking/:code` - Track shipment by code

### Contact & Applications
- `POST /contact` - Submit contact message
- `POST /applications` - Submit job application

### Invoices
- `GET /invoices` - Get all invoices
- `POST /invoices` - Create invoice
- `GET /invoices/:id` - Get invoice by ID
- `GET /invoices/:id/pdf` - Download invoice PDF

---

## Troubleshooting

### Backend Won't Start

**Error: Port 5000 already in use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check MongoDB URI in `.env`
- For MongoDB Atlas, whitelist your IP address

### Frontend Issues

**Module not found errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Build fails**
- Check all environment variables are set
- Ensure backend is accessible from frontend

### Authentication Issues

**Login redirects to homepage**
- Check API is running on correct port
- Verify CORS settings in backend
- Check browser console for errors
- Verify JWT_SECRET is set in backend .env

---

## Performance Optimization

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm start

# This serves optimized production build
```

### Database Indexing

Ensure MongoDB indexes are created for:
- User email (unique)
- Booking tracking code (unique)
- Vehicle license plate (unique)

### Caching

Consider implementing:
- Redis for session management
- CDN for static assets
- API response caching

---

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Backup strategy in place

---

## Support & Maintenance

### Logs

**Backend logs:**
```bash
pm2 logs sgh-backend
```

**Frontend logs:**
```bash
pm2 logs sgh-frontend
```

### Database Backup

```bash
# Backup
mongodump --db sgh-trasporti --out ./backup

# Restore
mongorestore --db sgh-trasporti ./backup/sgh-trasporti
```

### Monitoring

Consider setting up:
- PM2 monitoring dashboard
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic)

---

## Contact

For issues or questions:
- Create an issue in the repository
- Email: dev@sghtrasporti.com

---

**🎉 Your SGH Trasporti application is now ready for deployment!**
