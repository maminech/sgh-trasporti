@echo off
echo ================================
echo SGH Trasporti - Docker Deployment
echo ================================
echo.

echo Pulling latest changes...
git pull origin main
echo.

echo Building Docker images...
docker-compose build --no-cache
echo.

echo Starting containers...
docker-compose up -d
echo.

echo Waiting for services to start...
timeout /t 10
echo.

echo Seeding database (if first time)...
docker-compose exec -T backend node src/scripts/seed.js
echo.

echo ================================
echo Deployment Complete!
echo ================================
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo - MongoDB:  localhost:27017
echo.
echo Check status: docker-compose ps
echo View logs:    docker-compose logs -f
echo.
pause
