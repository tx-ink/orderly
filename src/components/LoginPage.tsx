import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      
      // Provide more specific error messages based on Firebase error codes
      if (error.code) {
        switch (error.code) {
          case 'auth/unauthorized-domain':
            errorMessage = 'This domain is not authorized. Please contact support.';
            break;
          case 'auth/popup-blocked':
            errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in was cancelled. Please try again.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          default:
            errorMessage = `Sign-in failed: ${error.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-logo">Orderly</h1>
            <p className="login-subtitle">Professional Invoice Management</p>
          </div>
          
          <div className="login-form">
            <h2>Welcome Back</h2>
            <p className="login-description">
              Sign in to access your invoice management system
            </p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <button 
              className="google-sign-in-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <div className="google-icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            
            <div className="login-footer">
              <p>
                Secure authentication powered by Google
              </p>
            </div>
          </div>
        </div>
        
        <div className="login-features">
          <h3>Why Choose Orderly?</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">📄</span>
              <div>
                <h4>Professional Invoices</h4>
                <p>Generate branded PDF invoices instantly</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Business Analytics</h4>
                <p>Track revenue, customers, and trends</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <h4>Secure & Private</h4>
                <p>Your business data is protected</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h4>Works Everywhere</h4>
                <p>Access from any device, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
