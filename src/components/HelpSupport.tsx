import React from 'react';

interface HelpSupportProps {
  onBack: () => void;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ onBack }) => {
  return (
    <div className="container">
      <header className="app-header fade-in">
        <div className="header-top">
          <div className="header-left">
            <div className="logo-area">
              <h1 className="app-logo">Orderly</h1>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="btn btn-secondary"
              onClick={onBack}
            >
              ← Back
            </button>
          </div>
        </div>
        <div className="page-header">
          <h2 className="page-title">Help & Support</h2>
          <p className="page-subtitle">Get the most out of your Orderly experience</p>
        </div>
      </header>

      <main>
        <div className="card">
          <h2 className="section-title">🚀 Quick Start Guide</h2>
          <div className="help-section">
            <div className="help-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Configure Business Settings</h3>
                <p>Set up your company name, address, logo, and invoice details in the Business Settings page.</p>
              </div>
            </div>
            <div className="help-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Process Your First Order</h3>
                <p>Paste your order data into the Order Data field and click "Parse Order Data" to extract items automatically.</p>
              </div>
            </div>
            <div className="help-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Set Prices & Generate Invoice</h3>
                <p>Fill in product names and prices. The app will remember them for future use. Generate professional PDF invoices instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">💡 Tips & Tricks</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h3>Auto-Pricing</h3>
              <p>Once you've used a product name, Orderly will automatically suggest the same price next time.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h3>Customer History</h3>
              <p>Start typing a customer name to see previous customers and auto-fill their addresses.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <h3>Dashboard Insights</h3>
              <p>Use the Dashboard to track your revenue, top products, and business growth over time.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💾</div>
              <h3>Data Backup</h3>
              <p>Regular backup your data using the Export function in the navigation menu.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">📋 Supported Order Formats</h2>
          <div className="format-examples">
            <div className="format-example">
              <h4>Size-Quantity Format</h4>
              <pre className="code-example">{`Ladies    Mens
XS-4      0
S-0       5
M-4       5
L-2       3`}</pre>
            </div>
            <div className="format-example">
              <h4>Simple List Format</h4>
              <pre className="code-example">{`T-Shirt Small: 5
T-Shirt Medium: 8
T-Shirt Large: 3
Hoodie Medium: 2`}</pre>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">🔧 Troubleshooting</h2>
          <div className="faq-section">
            <div className="faq-item">
              <h4>❓ PDF not downloading?</h4>
              <p>Check your browser's download settings and ensure pop-ups are allowed for this site.</p>
            </div>
            <div className="faq-item">
              <h4>❓ Lost data after refresh?</h4>
              <p>Your data is stored locally. If you cleared browser data, import from a backup file.</p>
            </div>
            <div className="faq-item">
              <h4>❓ Order data not parsing correctly?</h4>
              <p>Ensure your data follows the supported formats. Try cleaning up extra spaces or formatting.</p>
            </div>
            <div className="faq-item">
              <h4>❓ Can't sign in?</h4>
              <p>Make sure you're using a valid Google account and have allowed pop-ups for authentication.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">📞 Contact & Support</h2>
          <div className="contact-info">
            <p>Need additional help? Here are your options:</p>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email Support</h4>
                  <p>For technical issues or feature requests</p>
                  <a href="mailto:support@orderly-app.com" className="contact-link">support@orderly-app.com</a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">📚</div>
                <div>
                  <h4>Documentation</h4>
                  <p>Detailed guides and API references</p>
                  <a href="https://docs.orderly-app.com" className="contact-link" target="_blank" rel="noopener noreferrer">docs.orderly-app.com</a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">💬</div>
                <div>
                  <h4>Community</h4>
                  <p>Connect with other users and share tips</p>
                  <a href="https://community.orderly-app.com" className="contact-link" target="_blank" rel="noopener noreferrer">community.orderly-app.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">🆕 What's New</h2>
          <div className="changelog">
            <div className="changelog-item">
              <div className="version">v2.1.0</div>
              <div className="changelog-content">
                <h4>Enhanced Dashboard</h4>
                <ul>
                  <li>Added revenue analytics and trend charts</li>
                  <li>Customer growth tracking</li>
                  <li>Top products insights</li>
                </ul>
              </div>
            </div>
            <div className="changelog-item">
              <div className="version">v2.0.0</div>
              <div className="changelog-content">
                <h4>Authentication & Security</h4>
                <ul>
                  <li>Google sign-in authentication</li>
                  <li>Secure user sessions</li>
                  <li>Protected business data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
