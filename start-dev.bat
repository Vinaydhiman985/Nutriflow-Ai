@echo off
title Ai-Calorie Launchpad
color 0B
echo =============================================================
echo               🍏 WELCOME TO AI-CALORIE LAUNCHPAD 🍏
echo =============================================================
echo.
echo [1/2] Launching backend server on port 5000 (MongoDB or JSON)...
start "Ai-Calorie Backend Server" cmd /k "cd backend && npm start"

echo [2/2] Launching frontend developer server on port 3000...
start "Ai-Calorie Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo =============================================================
echo SUCCESS: BOTH INSTANCES LAUNCHED SUCCESSFULLY!
echo =============================================================
echo.
echo * Backend API:   http://localhost:5000
echo * Frontend App:  http://localhost:3000
echo.
echo Keep this window open while testing. Happy coding!
echo =============================================================
echo.
pause
