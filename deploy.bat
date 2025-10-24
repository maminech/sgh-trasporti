@echo off
echo ================================
echo SGH Trasporti - Quick Deploy
echo ================================
echo.

echo Step 1: Committing latest changes...
git add .
git commit -m "Deploy: %date% %time%"
echo.

echo Step 2: Pushing to GitHub...
git push origin main
echo.

echo ================================
echo Deployment pushed to GitHub!
echo ================================
echo.
echo Next steps:
echo 1. Backend will auto-deploy on Render (if connected)
echo 2. Frontend will auto-deploy on Vercel (if connected)
echo.
echo Or manually deploy:
echo - Render: Go to dashboard and click "Manual Deploy"
echo - Vercel: Run "vercel --prod" in frontend folder
echo.
pause
