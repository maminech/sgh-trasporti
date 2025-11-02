# Production Environment Variables

## 🔴 RENDER BACKEND ENVIRONMENT VARIABLES

Copy these to Render.com when deploying the backend:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://aminech990000:<db_password>@sgh-trasporti-user.uuomrix.mongodb.net/sgh-trasporti?retryWrites=true&w=majority
JWT_SECRET=8943c68cb6d95d7174f168622cf7f1d40ba3a36ec69e0c509ea9fefc38836631157fb0ae019c05baf53faafb0636d08e4ec07cd2fa2673a14ca6f30771c33a52
JWT_REFRESH_SECRET=154583f2f35cd57c155653ff4caf0c09d11e0f1eb5bd0aa7348cfbd6ca21319c3725ed9a26cec49dc155e68ac31f210415d548c2c3ed805a722e5efcc4d44f9c
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
EMAIL_SERVICE=hotmail
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=service.sgh.trasporti@hotmail.com
EMAIL_PASSWORD=YOUR_HOTMAIL_APP_PASSWORD_HERE
EMAIL_FROM=SGH Trasporti <service.sgh.trasporti@hotmail.com>
FRONTEND_URL=https://sgh-trasporti.vercel.app
BACKEND_URL=https://sgh-trasporti-backend.onrender.com
ADMIN_EMAIL=service.sgh.trasporti@hotmail.com
ADMIN_PASSWORD=CHANGE_TO_STRONG_PASSWORD_HERE
COMPANY_NAME=SGH Trasporti
COMPANY_OWNER=Sghaier Bacem
COMPANY_VAT=04488120231
COMPANY_PHONE=+39 345 054 4226
COMPANY_EMAIL=service.sgh.trasporti@hotmail.com
COMPANY_ADDRESS=Via Fratelli Rosselli, 32
COMPANY_CITY=43017 San Secondo Parmense (PR), Italia
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://sgh-trasporti.vercel.app
```

### 🔑 IMPORTANT - Replace These Values:

1. **MONGODB_URI**: Replace `<db_password>` with your actual Atlas database password
2. **EMAIL_PASSWORD**: Get app password from Hotmail:
   - Go to https://account.microsoft.com/security
   - Security → Advanced security options → App passwords
   - Generate new password for "SGH Trasporti Backend"
3. **ADMIN_PASSWORD**: Create a strong password (min 12 characters, mix of letters, numbers, symbols)
4. **BACKEND_URL**: After Render deployment, update with your actual backend URL

---

## 🔵 VERCEL FRONTEND ENVIRONMENT VARIABLES

Copy these to Vercel when deploying the frontend:

```bash
NEXT_PUBLIC_API_URL=https://sgh-trasporti-backend.onrender.com
NEXT_PUBLIC_APP_NAME=SGH Trasporti
NEXT_PUBLIC_APP_URL=https://sgh-trasporti.vercel.app
```

### 🔑 IMPORTANT - Replace These Values:

1. **NEXT_PUBLIC_API_URL**: After deploying backend to Render, replace with actual backend URL

---

## 📝 Deployment Steps

### Step 1: Deploy Backend to Render (Do This First!)

1. Go to https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `maminech/sgh-trasporti`
4. Settings:
   - **Name**: `sgh-trasporti-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free
5. Add all environment variables from above (after replacing the placeholders)
6. Click **"Create Web Service"**
7. **COPY YOUR BACKEND URL** (e.g., https://sgh-trasporti-backend-xxxx.onrender.com)

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import repository: `maminech/sgh-trasporti`
4. Settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Add environment variables (use the backend URL from Step 1)
6. Click **"Deploy"**

### Step 3: Update CORS in Render

1. Go back to Render backend service
2. After Vercel gives you the frontend URL, update:
   - **ALLOWED_ORIGINS**: Add your Vercel URL
   - **FRONTEND_URL**: Update with your Vercel URL

---

## ✅ Post-Deployment Verification

Once both are deployed:

1. **Check Backend Health**:
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status": "OK", "timestamp": "..."}`

2. **Check Frontend**:
   - Visit your Vercel URL
   - Test language switching (IT/EN/FR)
   - Try logging in with admin credentials

3. **Test API Connection**:
   - Go to Contact page
   - Submit a test message
   - Check if it works

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string (password correct?)
- Check logs in Render dashboard

**Frontend can't connect to backend?**
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Check Network tab in browser DevTools

**Email not sending?**
- Verify Hotmail app password
- Check if 2FA is enabled on Hotmail account

---

## 🔒 Security Checklist

- [ ] MongoDB password is strong and unique
- [ ] JWT secrets are the generated 128-character strings (don't change them)
- [ ] Admin password changed from default
- [ ] Hotmail app password configured
- [ ] CORS restricted to your Vercel domain only
- [ ] Email credentials secured

