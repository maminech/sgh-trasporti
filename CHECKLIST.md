# ✅ SGH Trasporti - Setup Checklist

Use this checklist to ensure proper setup and deployment of your SGH Trasporti platform.

## 📋 Pre-Installation Checklist

- [ ] Node.js v18+ installed and verified (`node --version`)
- [ ] npm installed and verified (`npm --version`)
- [ ] MongoDB installed locally OR MongoDB Atlas account created
- [ ] Git installed (optional, for version control)
- [ ] Code editor installed (VS Code recommended)
- [ ] Terminal/Command Prompt access

## 🔧 Initial Setup Checklist

### Backend Setup
- [ ] Navigated to `backend` directory
- [ ] Ran `npm install` successfully
- [ ] Copied `.env.example` to `.env`
- [ ] Updated `MONGODB_URI` in `.env`
- [ ] Set strong `JWT_SECRET` (64+ characters)
- [ ] Set strong `JWT_REFRESH_SECRET`
- [ ] Configured email settings (Gmail or SMTP)
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `EMAIL_FROM`
- [ ] Set admin credentials
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD`
- [ ] Updated `FRONTEND_URL` if different from default
- [ ] Updated `BACKEND_URL` if different from default

### Frontend Setup
- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install` successfully
- [ ] Copied `.env.example` to `.env.local`
- [ ] Updated `NEXT_PUBLIC_API_URL` to match backend URL
- [ ] Added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if available)
- [ ] Added `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (if available)

### Database Setup
- [ ] MongoDB server is running
- [ ] Database connection tested
- [ ] Ran database seed script: `cd backend && npm run seed`
- [ ] Verified admin user was created
- [ ] Verified sample vehicles were created
- [ ] Noted admin credentials for first login

## 🚀 First Run Checklist

- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] Backend accessible at http://localhost:5000
- [ ] Backend health check responds: http://localhost:5000/api/health
- [ ] Frontend starts without errors: `cd frontend && npm run dev`
- [ ] Frontend accessible at http://localhost:3000
- [ ] Homepage loads correctly
- [ ] Language switcher works (IT, EN, FR)
- [ ] Navigation links work
- [ ] No console errors in browser

## 🔐 Authentication Testing

- [ ] Can access login page: http://localhost:3000/it/auth/login
- [ ] Can login with admin credentials
- [ ] Redirects to admin dashboard after login
- [ ] Admin dashboard loads correctly
- [ ] Can view bookings page
- [ ] Can logout successfully
- [ ] Cannot access admin routes when logged out

## 🧪 Feature Testing Checklist

### Public Website
- [ ] Homepage displays correctly
- [ ] Hero section animates properly
- [ ] Statistics counters work
- [ ] Services section displays
- [ ] Contact form submits
- [ ] Quote form submits
- [ ] Tracking page accessible
- [ ] Footer links work
- [ ] Mobile responsive (test on small screen)

### Admin Dashboard
- [ ] Dashboard shows statistics
- [ ] Bookings list displays
- [ ] Can filter bookings by status
- [ ] Quotes page loads
- [ ] Fleet page loads
- [ ] Clients page loads
- [ ] Applications page loads
- [ ] Messages/Contacts page loads

### API Testing
- [ ] POST `/api/auth/login` works
- [ ] POST `/api/auth/register` works
- [ ] GET `/api/bookings` requires auth
- [ ] POST `/api/bookings` works
- [ ] GET `/api/tracking/:code` works
- [ ] POST `/api/quotes` works
- [ ] GET `/api/fleet` works

### 🆕 Extended Features Testing

#### GPS Tracking
- [ ] Can access tracking page with tracking code
- [ ] GPS simulation starts for a booking (admin)
- [ ] Real-time location updates display
- [ ] Progress bar shows correctly
- [ ] Speed and ETA calculations work
- [ ] Fleet tracking admin page shows active vehicles
- [ ] Map placeholder renders correctly

#### Customer Portal
- [ ] Can access customer portal at `/portal`
- [ ] Dashboard shows booking statistics
- [ ] My Bookings page lists user bookings
- [ ] Can filter bookings by status
- [ ] Invoice page displays invoices
- [ ] Can download invoice PDF
- [ ] Invoice summary cards calculate correctly

#### Chatbot
- [ ] Chatbot button appears on all pages
- [ ] Chat window opens and closes
- [ ] Quick reply buttons work
- [ ] FAQ responses trigger correctly
- [ ] User messages display properly
- [ ] Typing indicator shows
- [ ] Chat is mobile responsive
- [ ] POST `/api/contact` works

## 📧 Email Testing

- [ ] Email service configured
- [ ] Test email sends successfully
- [ ] Booking confirmation emails work
- [ ] Quote request emails work
- [ ] Contact form emails work
- [ ] Admin notification emails work
- [ ] Email templates display correctly

## 🌍 Internationalization Testing

- [ ] Can switch to Italian (IT)
- [ ] Can switch to English (EN)
- [ ] Can switch to French (FR)
- [ ] All pages translate correctly
- [ ] Navigation translates
- [ ] Forms translate
- [ ] Error messages translate

## 🔒 Security Checklist

- [ ] JWT tokens are secure (long secrets)
- [ ] Passwords are hashed (bcrypt)
- [ ] CORS is configured correctly
- [ ] Rate limiting is active
- [ ] Input validation works
- [ ] File uploads are restricted
- [ ] Admin routes are protected
- [ ] Environment variables are not committed
- [ ] `.env` files in `.gitignore`
- [ ] No sensitive data in console logs

## 📱 Responsive Design Testing

- [ ] Desktop view (1920px+)
- [ ] Laptop view (1366px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] Navigation menu on mobile
- [ ] Forms on mobile
- [ ] Tables on mobile (scroll/stack)
- [ ] Admin dashboard on tablet

## 🎨 UI/UX Testing

- [ ] Colors match brand (blue, white, gray)
- [ ] Typography is readable
- [ ] Buttons are clickable/hoverable
- [ ] Forms have proper validation
- [ ] Error messages are clear
- [ ] Success messages display
- [ ] Loading states show
- [ ] Icons display correctly
- [ ] Images load properly

## 🚀 Pre-Deployment Checklist

### Environment Configuration
- [ ] Production `.env` created
- [ ] Strong JWT secrets generated
- [ ] Production MongoDB URI configured
- [ ] Production email credentials set
- [ ] Production domain URLs updated
- [ ] CORS origins set for production
- [ ] Production admin password changed

### Build Testing
- [ ] Backend builds: `cd backend && npm run build`
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] No build errors
- [ ] Production mode tested locally

### Security Hardening
- [ ] Changed default admin password
- [ ] All secrets are environment variables
- [ ] HTTPS enabled (in production)
- [ ] Security headers configured (Helmet)
- [ ] Rate limiting tuned for production
- [ ] MongoDB has authentication enabled
- [ ] Backup strategy in place

### Performance
- [ ] Images optimized
- [ ] API responses cached where appropriate
- [ ] Database indexes created
- [ ] Static assets minified
- [ ] CDN configured (if applicable)

## 🌐 Deployment Checklist

### Frontend (Vercel)
- [ ] Vercel account created
- [ ] Project connected to Git
- [ ] Environment variables set in Vercel
- [ ] Build settings configured
- [ ] Domain configured (if custom)
- [ ] Deployment successful
- [ ] Production site accessible

### Backend (Railway/Render/AWS)
- [ ] Hosting account created
- [ ] Project deployed
- [ ] Environment variables set
- [ ] Database connected
- [ ] Health check passes
- [ ] API endpoints accessible
- [ ] Logs are accessible

### Database (MongoDB Atlas)
- [ ] Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string updated
- [ ] Backup configured
- [ ] Monitoring enabled

### Domain & SSL
- [ ] Domain purchased (if needed)
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] www redirect configured

## 📊 Post-Deployment Verification

- [ ] Production site loads
- [ ] All pages accessible
- [ ] API endpoints working
- [ ] Authentication works
- [ ] Forms submit correctly
- [ ] Emails send properly
- [ ] Database reads/writes work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Mobile version works

## 📝 Documentation Checklist

- [ ] README.md reviewed
- [ ] INSTALLATION.md followed
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Admin guide created (optional)
- [ ] User guide created (optional)

## 🔄 Maintenance Checklist

### Daily
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Verify email delivery

### Weekly
- [ ] Review user feedback
- [ ] Check database performance
- [ ] Update dependencies (if needed)
- [ ] Review security alerts

### Monthly
- [ ] Database backup verification
- [ ] Performance audit
- [ ] Security audit
- [ ] Update documentation
- [ ] Plan feature updates

## 🆘 Troubleshooting Reference

### Common Issues

**MongoDB Connection Error:**
- [ ] Verify MongoDB is running
- [ ] Check connection string format
- [ ] Verify network access (Atlas)
- [ ] Check database user permissions

**Port Already in Use:**
- [ ] Change PORT in backend/.env
- [ ] Update NEXT_PUBLIC_API_URL in frontend
- [ ] Kill process using port: `netstat -ano | findstr :5000`

**JWT Errors:**
- [ ] Verify JWT_SECRET is set
- [ ] Check token expiration
- [ ] Clear browser cookies
- [ ] Generate new strong secret

**Email Not Sending:**
- [ ] Verify email credentials
- [ ] Check SMTP settings
- [ ] Enable "Less secure apps" (Gmail)
- [ ] Use App Password (Gmail)
- [ ] Check firewall/antivirus

**Build Errors:**
- [ ] Clear node_modules: `rm -rf node_modules`
- [ ] Clear package-lock.json
- [ ] Reinstall: `npm install`
- [ ] Check Node.js version

**Frontend Not Loading:**
- [ ] Check console for errors
- [ ] Verify API_URL is correct
- [ ] Check CORS configuration
- [ ] Clear browser cache

## ✅ Final Checklist

- [ ] All features working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Security hardened
- [ ] Performance optimized
- [ ] Deployed successfully
- [ ] Monitoring enabled
- [ ] Team trained
- [ ] Backup strategy active
- [ ] **PROJECT COMPLETE! 🎉**

---

**Note:** This checklist should be completed in order. Check off items as you complete them. Keep this document for reference during setup, deployment, and maintenance.

**Need help?** Refer to:
- `INSTALLATION.md` for setup details
- `README.md` for feature documentation
- `PROJECT_STRUCTURE.md` for codebase navigation
