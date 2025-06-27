# Orderly - Professional Invoice Generator

A modern, secure web application for transforming order data into professional PDF invoices with Google Authentication.

## ✨ Features

- **🔐 Secure Authentication**: Google Sign-in with Firebase
- **📄 PDF Invoice Generation**: Professional, customizable invoices
- **📊 Business Dashboard**: Analytics and insights
- **📦 Product Management**: Automated pricing and product database
- **👥 Customer Database**: Auto-complete and history tracking
- **🧾 Invoice History**: Payment tracking and re-download capability
- **💾 Data Backup/Restore**: Export and import your business data
- **🎨 Modern UI**: Clean, responsive design with dark theme

## 🚀 Quick Start

1. **Clone and Install**:
   ```bash
   git clone <your-repo>
   cd orderly
   npm install
   ```

2. **Firebase Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Google Authentication
   - Copy your Firebase config to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Authentication**: Firebase Auth (Google)
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Vite
- **Deployment**: Vercel Ready

## 📋 Usage

1. **Sign In**: Use your Google account to authenticate
2. **Configure Business**: Set up your company details in Settings
3. **Process Orders**: Paste order data and let the parser extract items
4. **Set Pricing**: Auto-suggested prices from your product database
5. **Generate Invoices**: Create professional PDF invoices instantly
6. **Track Business**: Monitor revenue and customer data in Dashboard

## 🔒 Security

- Environment variables for sensitive Firebase config
- Authenticated routes protection
- Secure Google OAuth flow
- Local data storage with export/import capabilities

## 📄 License

MIT License - feel free to use for your business needs.

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
