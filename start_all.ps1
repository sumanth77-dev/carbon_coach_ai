# Carbon Coach - Start All Services (Python ADK Agent + Express Backend + React Frontend)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "       Starting Carbon Coach Full Platform...            " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Python Google ADK Agent Service (Port 8080)
Write-Host "[1/3] Starting Python Google ADK Agent on http://localhost:8080..." -ForegroundColor Cyan
$PythonProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\carbon_coach_ai'; .\.venv\Scripts\python.exe main.py --port 8080" -PassThru

# Wait 2 seconds for Python service to bind
Start-Sleep -Seconds 2

# 2. Start Node.js Express Backend (Port 5000)
Write-Host "[2/3] Starting Express Backend on http://localhost:5000..." -ForegroundColor Cyan
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\backend'; node server.js" -PassThru

# Wait 2 seconds for Express to bind
Start-Sleep -Seconds 2

# 3. Start React Frontend with Vite (Port 5173/5174)
Write-Host "[3/3] Starting React Frontend on http://localhost:5173..." -ForegroundColor Cyan
$FrontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\frontend'; npm run dev" -PassThru

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  All 3 Carbon Coach services are running:" -ForegroundColor Green
Write-Host "    - Python AI Service : http://localhost:8080" -ForegroundColor White
Write-Host "    - Express API       : http://localhost:5000" -ForegroundColor White
Write-Host "    - React Frontend    : http://localhost:5173" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
