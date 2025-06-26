@echo off
echo 🚀 Deploying Orderly to GitHub Pages...

echo 📦 Building application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 📁 Files ready in ./dist directory
    echo.
    echo Next steps:
    echo 1. Push your code to GitHub
    echo 2. Enable GitHub Pages in repository settings
    echo 3. Your app will be available at: https://yourusername.github.io/orderly/
    echo.
    echo Or deploy to Vercel:
    echo 1. Visit vercel.com
    echo 2. Import your GitHub repository
    echo 3. Deploy automatically
) else (
    echo ❌ Build failed. Please check the errors above.
)
