@echo off
echo ========================================
echo Starting SGH Trasporti Platform
echo ========================================
echo.
echo Starting backend on http://localhost:5000
echo Starting frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 2 >nul
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin: http://localhost:3000/it/admin/dashboard
echo.
