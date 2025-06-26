import { useState, useEffect } from 'react';

interface BusinessSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  logo: string | null;
  invoiceNote: string;
}

interface SettingsProps {
  onBack: () => void;
  onSettingsChange: (settings: BusinessSettings) => void;
}

const defaultSettings: BusinessSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyWebsite: '',
  logo: null,
  invoiceNote: 'Thank you for your business!'
};

export default function Settings({ onBack, onSettingsChange }: SettingsProps) {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('orderly-business-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
    }
  }, []);

  const handleInputChange = (field: keyof BusinessSettings, value: string) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);
    setIsSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSettings = { ...settings, logo: reader.result as string };
        setSettings(updatedSettings);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('orderly-business-settings', JSON.stringify(settings));
    onSettingsChange(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide success message after 3 seconds
  };

  const handleRemoveLogo = () => {
    const updatedSettings = { ...settings, logo: null };
    setSettings(updatedSettings);    setIsSaved(false);
  };
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
              ← Back to Orders
            </button>
          </div>
        </div>
        <div className="page-header">
          <h2 className="page-title">Business Settings</h2>
          <p className="page-subtitle">Configure your company information for invoices</p>
        </div>
      </header>

      <div className="slide-in-left" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2 className="section-title">Company Information</h2>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your Company Name"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="company@example.com"
                value={settings.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="form-label">Company Address</label>
            <textarea
              className="form-input"
              placeholder="Street Address&#10;City, State ZIP&#10;Country"
              value={settings.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              style={{ minHeight: '100px' }}
            ></textarea>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 123-4567"
                value={settings.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://yourcompany.com"
                value={settings.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="form-label">Company Logo</label>
            {settings.logo ? (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--surface-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)'
                }}>
                  <img 
                    src={settings.logo} 
                    alt="Company Logo" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-sm)',
                      background: 'white',
                      padding: '4px'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <span className="status-badge success">✓ Logo uploaded</span>
                  </div>
                  <button 
                    className="btn" 
                    onClick={handleRemoveLogo}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '0.5rem 1rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}
            
            <div className="file-upload">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
              />
              <label className="file-upload-label">
                <span>{settings.logo ? 'Replace logo' : 'Click to upload logo or drag & drop'}</span>
                <small style={{ color: 'var(--text-quaternary)', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                  PNG, JPG up to 2MB
                </small>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="form-label">Invoice Note</label>
            <textarea
              className="form-input"
              placeholder="Message to appear at the bottom of invoices&#10;e.g., Thank you for your business!"
              value={settings.invoiceNote}
              onChange={(e) => handleInputChange('invoiceNote', e.target.value)}
              style={{ minHeight: '80px' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              className="btn btn-success"
              onClick={handleSave}
              disabled={!settings.companyName.trim()}
            >
              <span>💾</span>
              Save Settings
            </button>
            
            {isSaved && (
              <span className="status-badge success">
                ✓ Settings saved successfully!
              </span>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Preview</h2>
          <div style={{ 
            background: 'var(--surface-tertiary)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt="Logo Preview" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    objectFit: 'contain',
                    background: 'white',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px'
                  }} 
                />
              )}
              <div>
                <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>
                  {settings.companyName || 'Company Name'}
                </h3>
              </div>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {settings.companyAddress && (
                <div style={{ marginBottom: '0.5rem' }}>
                  {settings.companyAddress.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
              {settings.companyPhone && <div>📞 {settings.companyPhone}</div>}
              {settings.companyEmail && <div>✉️ {settings.companyEmail}</div>}              {settings.companyWebsite && <div>🌐 {settings.companyWebsite}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
