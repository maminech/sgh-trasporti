# 🚀 SGH Trasporti - Production Deployment Guide

Complete step-by-step guide to deploy SGH Trasporti platform to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Git repository up to date
- [ ] All environment variables configured
- [ ] MongoDB database ready (Atlas or self-hosted)
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (automatic with Vercel/Render)
- [ ] Email service configured
- [ ] Admin password changed from default

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED FOR BEGINNERS**

This is the easiest and fastest deployment method with free tier available.

#### Step 1: Deploy Backend to Render.com

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create MongoDB Database**
   - Option A: Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
     - Create free cluster
     - Get connection string
   - Option B: Use Render's MongoDB (paid)

3. **Deploy Backend**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Configure:
     - **Name**: `sgh-trasporti-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node src/server.js`
     - **Plan**: Free

4. **Add Environment Variables** in Render Dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=generate-strong-64-char-secret
   JWT_REFRESH_SECRET=generate-another-strong-64-char-secret
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   EMAIL_USER=service.sgh.trasporti@hotmail.com
   EMAIL_PASSWORD=your-email-app-password
   EMAIL_FROM=SGH Trasporti <service.sgh.trasporti@hotmail.com>
   FRONTEND_URL=will-add-after-frontend-deployment
   ADMIN_EMAIL=service.sgh.trasporti@hotmail.com
   ADMIN_PASSWORD=your-strong-admin-password
   ```

5. **Deploy** and wait for build to complete
   - Copy the backend URL (e.g., `https://sgh-trasporti-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow Vercel prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name? `sgh-trasporti`
   - In which directory? `./` (current)
   - Override settings? `N`

4. **Add Environment Variables in Vercel Dashboard**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
     NEXT_PUBLIC_APP_NAME=SGH Trasporti
     NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
     ```

5. **Update Backend CORS**:
   - Go back to Render → Environment Variables
   - Update `FRONTEND_URL` with your Vercel URL

6. **Redeploy Both**:
   - Render: Click "Manual Deploy" → "Deploy latest commit"
   - Vercel: `vercel --prod`

---

### Option 2: Docker Deployment (VPS/Cloud)

Perfect for AWS, DigitalOcean, Azure, or any VPS.

#### Step 1: Prepare Your Server

1. **Get a VPS** (Ubuntu 22.04 recommended)
   - DigitalOcean Droplet ($6/month)
   - AWS EC2
   - Azure VM
   - Linode

2. **SSH into your server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Docker & Docker Compose**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Verify installations
   docker --version
   docker-compose --version
   ```

#### Step 2: Deploy with Docker

1. **Clone repository**
   ```bash
   git clone https://github.com/maminech/sgh-trasporti.git
   cd sgh-trasporti
   ```

2. **Create production environment file**
   ```bash
   cp .env.production.example .env
   nano .env
   ```

3. **Edit .env with your values**:
   ```env
   MONGO_PASSWORD=your-strong-mongodb-password
   JWT_SECRET=your-64-char-secret
   JWT_REFRESH_SECRET=your-64-char-refresh-secret
   EMAIL_PASSWORD=your-email-password
   ADMIN_PASSWORD=your-admin-password
   FRONTEND_URL=http://your-server-ip:3000
   NEXT_PUBLIC_API_URL=http://your-server-ip:5000/api
   NEXT_PUBLIC_APP_URL=http://your-server-ip:3000
   ```

4. **Generate Strong Secrets**:
   ```bash
   # Generate JWT_SECRET
   openssl rand -base64 64

   # Generate JWT_REFRESH_SECRET
   openssl rand -base64 64
   ```

5. **Start the application**
   ```bash
   docker-compose up -d
   ```

6. **Check status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

7. **Seed the database**
   ```bash
   docker-compose exec backend node src/scripts/seed.js
   ```

#### Step 3: Configure Nginx (Optional but Recommended)

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Create Nginx config**
   ```bash
   sudo nano /etc/nginx/sites-available/sgh-trasporti
   ```

3. **Add configuration**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sgh-trasporti /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Install SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

---

### Option 3: Railway.app (All-in-One)

Railway offers simple deployment with database included.

1. **Go to https://railway.app**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Add MongoDB**:
   - Click "New" → "Database" → "MongoDB"
   - Copy connection string
6. **Add Backend Service**:
   - Click "New" → "Service" → Select `backend` folder
   - Add environment variables
   - Deploy
7. **Add Frontend Service**:
   - Click "New" → "Service" → Select `frontend` folder
   - Add environment variables
   - Deploy

---

## 🔐 Security Setup

### 1. Generate Strong Secrets

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT Refresh Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Change Default Admin Password

After deployment:
1. Login to admin panel
2. Go to Profile Settings
3. Change password immediately

### 3. Configure Email Service

For Hotmail/Outlook:
1. Go to https://account.live.com/proofs/manage/additional
2. Create App Password
3. Use this password in `EMAIL_PASSWORD` env var

### 4. MongoDB Security

If using MongoDB Atlas:
1. Enable authentication
2. Whitelist only your server IP
3. Use strong password
4. Enable backup

---

## 📊 Post-Deployment

### 1. Verify Deployment

Test these URLs:
- [ ] Frontend: `https://your-domain.com`
- [ ] API Health: `https://your-domain.com/api/health`
- [ ] Admin Login: `https://your-domain.com/it/auth/login`
- [ ] Language switching works (IT/EN/FR)

### 2. Test Core Features

- [ ] User registration
- [ ] User login
- [ ] Admin login
- [ ] Create booking
- [ ] Request quote
- [ ] Track shipment
- [ ] Submit job application
- [ ] Contact form

### 3. Monitor Performance

```bash
# Check Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check resource usage
docker stats

# Database backup
docker-compose exec mongodb mongodump --out /backup
```

### 4. Setup Monitoring

Recommended tools:
- **Uptime**: UptimeRobot (free)
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Logs**: LogRocket, Datadog

---

## 🔄 Updating the Application

### Docker Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Vercel + Render

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

2. **Auto-deploy** (if enabled) or manual deploy from dashboard

---

## 🐛 Troubleshooting

### Backend not responding

```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database connection errors

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Test connection
docker-compose exec backend node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Frontend can't reach backend

1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify CORS settings in backend
3. Check network connectivity

---

## 📞 Support

For deployment issues:
- Create issue on GitHub
- Check documentation: `/DEPLOYMENT.md`
- Contact: service.sgh.trasporti@hotmail.com

---

## ✅ Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and seeded
- [ ] Environment variables configured
- [ ] Admin password changed
- [ ] Email service working
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Security hardened
- [ ] Performance optimized

**🎉 Congratulations! Your SGH Trasporti platform is now live!**
