# Quick start script for VRS Specialists dev server
Write-Host "Starting VRS Specialists development server..." -ForegroundColor Cyan
Write-Host ""

cd "C:\Users\aaron\OneDrive\Desktop\Websites\VRS Specialists"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: node_modules not found. Run 'npm install' first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Next.js dev server..." -ForegroundColor Green
Write-Host ""

npm run dev

