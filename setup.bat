@echo off
echo ========================================
echo SGH Trasporti - Quick Start Script
echo ========================================
echo.

echo Step 1: Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed!
echo.

echo Step 2: Installing dependencies...
echo Installing root dependencies...
call npm install
echo.

echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure environment variables:
echo    - Copy .env.example to backend\.env
echo    - Copy frontend\.env.example to frontend\.env.local
echo    - Edit both files with your configuration
echo.
echo 2. Set up MongoDB:
echo    - Make sure MongoDB is running
echo    - Or use MongoDB Atlas connection string
echo.
echo 3. Seed the database:
echo    cd backend
echo    npm run seed
echo.
echo 4. Start the application:
echo    npm run dev
echo.
echo See INSTALLATION.md for detailed instructions.
echo.
pause
