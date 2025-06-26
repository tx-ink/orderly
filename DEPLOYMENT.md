# Orderly - Modern Invoice Management

A modern, web-based order/invoice application for small apparel businesses to parse raw order data, assign product names/pricing, and generate branded PDF invoices.

## 🚀 Quick Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/orderly.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Git Repository"
   - Select your `orderly` repository
   - Click "Deploy"
   - Your app will be live at `https://your-app-name.vercel.app`

### Option 2: Deploy to Netlify

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

### Option 3: Deploy to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"
   - The workflow is already configured in `.github/workflows/deploy.yml`

2. **Push changes to trigger deployment:**
   ```bash
   git add .
   git commit -m "Add deployment workflow"
   git push
   ```

## 📱 Accessing Your Data

### Data Backup & Sync

Your app now includes backup functionality:

1. **Export Data:** Use the navigation menu → "Export Data" to download a backup file
2. **Import Data:** Use "Import Data" to restore from a backup file
3. **Regular Backups:** Export your data regularly to avoid data loss

### Cross-Device Access

Once deployed, you can access your app from:
- ✅ Your desktop computer
- ✅ Your phone/tablet
- ✅ Any device with internet access
- ✅ Multiple locations

**Important:** Since the app uses browser storage, data is device-specific. Use the export/import feature to sync data between devices.

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Features

- ✅ Modern order parsing (multiple formats)
- ✅ Product database with auto-suggestions
- ✅ Customer database with autocomplete
- ✅ Professional PDF invoice generation
- ✅ Invoice tracking and payment status
- ✅ Business settings with logo upload
- ✅ Data backup and restore
- ✅ Responsive dark theme UI
- ✅ Progressive Web App ready

## 🌟 Future Enhancements

- [ ] Cloud database integration
- [ ] Multi-user support
- [ ] Advanced reporting
- [ ] Email integration
- [ ] Payment gateway integration

## 📞 Support

For deployment help or feature requests, contact Chad at Chad@TXInk.co
