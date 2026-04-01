# Backup Cloudinary Media - PowerShell Script
# Run: .\scripts\backup-media.ps1

$ErrorActionPreference = "Continue"

# Create backup directory
$backupDir = Join-Path $PSScriptRoot "..\cloudinary-backup"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "Starting Cloudinary media backup..." -ForegroundColor Green
Write-Host ""

# Read the exported URLs
$jsonPath = Join-Path $PSScriptRoot "..\media-urls-export.json"
if (!(Test-Path $jsonPath)) {
    Write-Host "ERROR: media-urls-export.json not found! Run extract-media-urls.ts first." -ForegroundColor Red
    exit 1
}

$mediaItems = Get-Content $jsonPath | ConvertFrom-Json
Write-Host "Found $($mediaItems.Count) media items" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0
$skippedCount = 0

foreach ($item in $mediaItems) {
    $filename = $item.filename
    $url = $item.url
    
    # Construct full URL if it's a relative path
    if ($url.StartsWith("/")) {
        $url = "https://mosque-al-falah.vercel.app$url"
    }
    
    $outputPath = Join-Path $backupDir $filename
    
    # Skip if already exists
    if (Test-Path $outputPath) {
        Write-Host "[SKIP] Already exists: $filename" -ForegroundColor DarkGray
        $skippedCount++
        continue
    }
    
    try {
        Write-Host "[DOWNLOAD] $filename ... " -ForegroundColor Yellow -NoNewline
        
        # Download with proper encoding
        $secureUrl = $url -replace " ", "%20"
        Invoke-WebRequest -Uri $secureUrl -OutFile $outputPath -UseBasicParsing -MaximumRedirection 5
        
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length
            $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
            Write-Host "OK ($fileSizeKB KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "FAILED (file not created)" -ForegroundColor Red
            $errorCount++
        }
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        $errorCount++
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Backup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Skipped: $skippedCount" -ForegroundColor DarkGray
Write-Host "Errors: $errorCount" -ForegroundColor Red
Write-Host ""
Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
