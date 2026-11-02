# Build & Package Script for Medi Waves Deployment
# Generates deploy/mediwaves_full_build.zip with www.medi-waves.com and api

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $rootDir) { $rootDir = Get-Location }

$deployDir = Join-Path $rootDir "deploy"
if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Path $deployDir | Out-Null
}

$zipPath = Join-Path $deployDir "mediwaves_full_build.zip"
$tempZipPath = Join-Path $deployDir "mediwaves_build_temp.zip"
if (Test-Path $tempZipPath) {
    Remove-Item $tempZipPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Creating deployment package at: $zipPath..." -ForegroundColor Cyan

# Use .NET ZipArchive for speed and exact file filtering
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($tempZipPath, [System.IO.Compression.ZipArchiveMode]::Create)

$excludeDirs = @('.git', '.claude', '__pycache__', '.vscode', '.idea', 'node_modules')
$excludeExts = @('.tmp', '.bak', '.save', '.swp')

$foldersToPack = @('www.medi-waves.com', 'api')
$fileCount = 0

foreach ($folder in $foldersToPack) {
    $folderPath = Join-Path $rootDir $folder
    if (-not (Test-Path $folderPath)) { continue }

    $allFiles = Get-ChildItem -Path $folderPath -Recurse -File -Force

    foreach ($file in $allFiles) {
        # Check excluded directories
        $relPath = $file.FullName.Substring($rootDir.Length).TrimStart('\', '/')
        $skip = $false
        foreach ($d in $excludeDirs) {
            if ($relPath -match "(^|[\\/])$([regex]::Escape($d))([\\/]|$)") {
                $skip = $true
                break
            }
        }
        if ($skip) { continue }

        # Check excluded extensions
        if ($excludeExts -contains $file.Extension.ToLower()) { continue }

        $entryName = $relPath.Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        $fileCount++

        if ($fileCount % 200 -eq 0) {
            Write-Host -NoNewline "`rArchived $fileCount files..."
        }
    }
}

$zip.Dispose()

# Safely replace destination zip file
for ($i = 0; $i -lt 5; $i++) {
    try {
        Move-Item -Path $tempZipPath -Destination $zipPath -Force
        break
    }
    catch {
        Start-Sleep -Milliseconds 800
    }
}
if (Test-Path $tempZipPath) {
    Copy-Item -Path $tempZipPath -Destination $zipPath -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempZipPath -Force -ErrorAction SilentlyContinue
}

$sizeMb = (Get-Item $zipPath).Length / 1MB
Write-Host ""
Write-Host "[SUCCESS] Build complete! Archived $fileCount files into '$zipPath' ($([math]::Round($sizeMb, 2)) MB)." -ForegroundColor Green

