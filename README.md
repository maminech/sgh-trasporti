# 🚚 SGH Trasporti Platform

Complete transport and logistics management platform with client portal, real-time tracking, and admin dashboard.

## 📋 Features

### Public Website
- 🏠 Modern homepage with dynamic visuals
- 📝 Smart quote & booking system
- 📦 Real-time package tracking
- 🚛 Fleet showcase and gallery
- 💼 Career application portal
- 🌍 Multilingual support (IT, EN, FR)
- 📱 Fully responsive design

### Admin Dashboard
- 📊 KPI dashboard with analytics
- 📦 Bookings & quotes management
- 🚛 Fleet management
- 👥 Client management
- 💼 Job applications review
- ✉️ Email notifications
- 📄 Export to PDF/Excel

### Advanced Features
- 🔐 JWT authentication
- 🗺️ Google Maps integration
- 📧 Automated email notifications
- 🔒 reCAPTCHA protection
- 📱 Mobile-responsive
- ⚡ Optimized performance

### 🆕 Extended Features (Future Expansion)
- 📍 **GPS Tracking Simulation** - Real-time vehicle location tracking with simulated GPS data
- 🏠 **Customer Portal** - Secure client dashboard with booking history and invoice management
- 💬 **AI Chatbot** - Interactive support bot with FAQ responses
- 📄 **Invoice System** - Automated invoice generation with PDF export
- 🗺️ **Fleet Map View** - Real-time fleet tracking with interactive maps
- 📊 **Advanced Analytics** - Route optimization and delivery time estimation

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (React)
- **Styling:** TailwindCSS
- **UI Components:** Shadcn/UI
- **Animations:** Framer Motion
- **i18n:** next-intl
- **Forms:** React Hook Form + Zod
- **Maps:** Google Maps API / Leaflet

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Validation:** express-validator
- **Security:** Helmet, cors, bcrypt

### DevOps
- **Version Control:** Git
- **Package Manager:** npm
- **Environment:** dotenv
- **Code Quality:** ESLint, Prettier

## 📁 Project Structure

```
sgh-trasporti/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── uploads/            # File uploads
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/               # Next.js 15 application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & config
│   │   ├── hooks/         # Custom React hooks
│   │   ├── styles/        # Global styles
│   │   └── i18n/          # Translations
│   ├── .env.local
│   └── package.json
│
├── .env.example           # Environment variables template
├── .gitignore
├── package.json           # Root package file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/sgh-trasporti.git
cd sgh-trasporti
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
# Copy .env.example to .env and configure
cp .env.example .env

# Edit .env with your configuration
# - MongoDB URI
# - JWT secrets
# - Email credentials
# - API keys (Google Maps, reCAPTCHA)
```

4. **Configure frontend environment**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your Next.js environment variables
```

### Running the Application

#### Development Mode

**Option 1: Run both frontend and backend together**
```bash
# From root directory
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

#### Production Mode

1. **Build the project**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

## 🗄️ Database Setup

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# The app will create the database automatically
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Seed Initial Data (Optional)
```bash
cd backend
npm run seed
```

## 🔑 Default Admin Credentials

After first run, access the admin dashboard with:
- **Email:** admin@sghtrasporti.com
- **Password:** Admin@123456

⚠️ **Important:** Change these credentials immediately in production!

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Update `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Other SMTP Services
Configure `EMAIL_HOST`, `EMAIL_PORT`, and credentials in `.env`

## 🗺️ Google Maps Setup

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Geocoding API
3. Add key to `.env`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

## 🔒 Security Setup

### reCAPTCHA
1. Register at https://www.google.com/recaptcha
2. Get site key and secret key
3. Add to `.env`:
```env
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

### JWT Secrets
Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📦 Available Scripts

### Root Directory
- `npm run dev` - Run both frontend and backend in development
- `npm run build` - Build both applications
- `npm run start` - Start both in production mode
- `npm run install:all` - Install all dependencies

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌍 Multilingual Support

The platform supports 3 languages:
- 🇮🇹 Italian (default)
- 🇬🇧 English
- 🇫🇷 French

Translation files are located in `frontend/src/i18n/locales/`

## 📱 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

#### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

#### Tracking
- `GET /api/tracking/:code` - Track shipment by code

#### Quotes
- `POST /api/quotes` - Request quote
- `GET /api/quotes` - Get all quotes (admin)

#### Fleet
- `GET /api/fleet` - Get all vehicles
- `POST /api/fleet` - Add vehicle (admin)
- `PUT /api/fleet/:id` - Update vehicle (admin)

#### Applications
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get all applications (admin)

#### Contact
- `POST /api/contact` - Send contact message

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway/Render/AWS)
1. Push to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Environment Variables for Production
Update all `.env` values with production credentials:
- Use strong JWT secrets
- Configure production MongoDB URI
- Set correct CORS origins
- Use production email service
- Add production API keys

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@sghtrasporti.com or contact the development team.

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Public website
  - Admin dashboard
  - Booking & tracking system
  - Multilingual support

## 🎯 Future Enhancements

- [ ] Real-time GPS tracking integration
- [ ] Customer portal with login
- [ ] AI Chatbot support
- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe)
- [ ] Advanced analytics & reporting
- [ ] Driver mobile app
- [ ] Push notifications
- [ ] Invoice generation

---

**Built with ❤️ by the SGH Trasporti Development Team**
