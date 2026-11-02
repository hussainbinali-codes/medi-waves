/**
 * Medi Waves Build & Packaging Script
 * Creates deploy/mediwaves_full_build.zip containing www.medi-waves.com and api.
 * Run with: node build_deploy.js
 */
const { execSync } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'build_deploy.ps1');
console.log('Running Medi Waves deployment packager...');

try {
  execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}

