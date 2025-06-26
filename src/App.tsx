import { useState, useEffect } from 'react';
import { parseOrderData } from './utils/parsing';
import type { PricedOrderItem } from './utils/types';
import { generateInvoice } from './utils/pdf';
import Settings from './components/Settings';

interface BusinessSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  logo: string | null;
  invoiceNote: string;
}

interface SavedProduct {
  name: string;
  price: number;
  lastUsed: string;
}

interface SavedInvoice {
  id: number;
  customerName: string;
  customerAddress: string;
  items: PricedOrderItem[];
  subtotal: number;
  shippingCost: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  date: string;
  isPaid: boolean;
  createdAt: string;
}

function App() {
  const [rawText, setRawText] = useState('');
  const [pricedItems, setPricedItems] = useState<PricedOrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1188);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [customers, setCustomers] = useState<Array<{name: string, address: string}>>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [showInvoiceHistory, setShowInvoiceHistory] = useState(false);
  const [showProductManagement, setShowProductManagement] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    logo: null,
    invoiceNote: 'Thank you for your business!'
  });

  useEffect(() => {
    // Load business settings from localStorage on app start
    const savedSettings = localStorage.getItem('orderly-business-settings');
    if (savedSettings) {
      setBusinessSettings(JSON.parse(savedSettings));
    }
    
    // Load invoice number from localStorage
    const savedInvoiceNumber = localStorage.getItem('orderly-invoice-number');
    if (savedInvoiceNumber) {
      setInvoiceNumber(parseInt(savedInvoiceNumber));
    }

    // Load customers from localStorage
    const savedCustomers = localStorage.getItem('orderly-customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    // Load saved products from localStorage
    const savedProductsData = localStorage.getItem('orderly-products');
    if (savedProductsData) {
      setSavedProducts(JSON.parse(savedProductsData));
    }

    // Load saved invoices from localStorage
    const savedInvoicesData = localStorage.getItem('orderly-invoices');
    if (savedInvoicesData) {
      setSavedInvoices(JSON.parse(savedInvoicesData));
    }
  }, []);

  // Save customer when invoice is generated
  const saveCustomer = () => {
    if (customerName.trim() && customerAddress.trim()) {
      const existingCustomer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
      if (!existingCustomer) {
        const newCustomers = [...customers, { name: customerName, address: customerAddress }];
        setCustomers(newCustomers);
        localStorage.setItem('orderly-customers', JSON.stringify(newCustomers));
      }
    }
  };

  // Filter customers based on name input
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerName.toLowerCase()) && 
    customerName.length > 0
  );

  // Handle customer selection from dropdown
  const selectCustomer = (customer: {name: string, address: string}) => {
    setCustomerName(customer.name);
    setCustomerAddress(customer.address);
    setShowCustomerDropdown(false);
  };

  // Handle customer name input change
  const handleCustomerNameChange = (value: string) => {
    setCustomerName(value);
    setShowCustomerDropdown(value.length > 0 && filteredCustomers.length > 0);
  };

  // Save products when invoice is generated
  const saveProducts = () => {
    const newProducts = [...savedProducts];
    let hasChanges = false;

    pricedItems.forEach(item => {
      if (item.productName && item.price > 0) {
        const existingProductIndex = newProducts.findIndex(p => 
          p.name.toLowerCase() === item.productName.toLowerCase()
        );
        
        if (existingProductIndex >= 0) {
          // Update existing product price and last used date
          newProducts[existingProductIndex] = {
            name: item.productName,
            price: item.price,
            lastUsed: new Date().toISOString()
          };
        } else {
          // Add new product
          newProducts.push({
            name: item.productName,
            price: item.price,
            lastUsed: new Date().toISOString()
          });
        }
        hasChanges = true;
      }
    });

    if (hasChanges) {
      // Sort by most recently used
      newProducts.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
      setSavedProducts(newProducts);
      localStorage.setItem('orderly-products', JSON.stringify(newProducts));
    }
  };

  // Save invoice when generated
  const saveInvoice = () => {
    const newInvoice: SavedInvoice = {
      id: invoiceNumber,
      customerName,
      customerAddress,
      items: pricedItems,
      subtotal,
      shippingCost,
      taxRate,
      taxAmount,
      total: grandTotal,
      date: invoiceDate,
      isPaid: false,
      createdAt: new Date().toISOString()
    };

    const newInvoices = [newInvoice, ...savedInvoices];
    setSavedInvoices(newInvoices);
    localStorage.setItem('orderly-invoices', JSON.stringify(newInvoices));
  };

  // Toggle invoice payment status
  const toggleInvoicePayment = (invoiceId: number) => {
    const updatedInvoices = savedInvoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, isPaid: !invoice.isPaid }
        : invoice
    );
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('orderly-invoices', JSON.stringify(updatedInvoices));
  };

  // Re-download an existing invoice
  const redownloadInvoice = (invoice: SavedInvoice) => {
    generateInvoice(
      invoice.customerName, 
      invoice.customerAddress, 
      invoice.items, 
      invoice.subtotal,
      invoice.shippingCost,
      invoice.taxRate,
      invoice.taxAmount,
      invoice.total, 
      businessSettings, 
      invoice.id, 
      invoice.date
    );
  };

  // Product management functions
  const updateProductPrice = (productName: string, newPrice: number) => {
    const updatedProducts = savedProducts.map(product => 
      product.name === productName 
        ? { ...product, price: newPrice, lastUsed: new Date().toISOString() }
        : product
    );
    setSavedProducts(updatedProducts);
    localStorage.setItem('orderly-products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productName: string) => {
    const updatedProducts = savedProducts.filter(product => product.name !== productName);
    setSavedProducts(updatedProducts);
    localStorage.setItem('orderly-products', JSON.stringify(updatedProducts));
  };

  const addNewProduct = (name: string, price: number) => {
    const newProduct: SavedProduct = {
      name,
      price,
      lastUsed: new Date().toISOString()
    };
    const updatedProducts = [newProduct, ...savedProducts];
    setSavedProducts(updatedProducts);
    localStorage.setItem('orderly-products', JSON.stringify(updatedProducts));
  };

  // Product form component
  const ProductForm = ({ onAddProduct }: { onAddProduct: (name: string, price: number) => void }) => {
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newProductName.trim() && newProductPrice) {
        const price = parseFloat(newProductPrice);
        if (price > 0) {
          onAddProduct(newProductName.trim(), price);
          setNewProductName('');
          setNewProductPrice('');
        }
      }
    };

    return (
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="0.00"
              step="0.01"
              min="0"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <span>➕</span>
              Add Product
            </button>
          </div>
        </div>
      </form>
    );
  };

  // Product item component
  const ProductItem = ({ 
    product, 
    onUpdatePrice, 
    onDelete 
  }: { 
    product: SavedProduct, 
    onUpdatePrice: (name: string, price: number) => void,
    onDelete: (name: string) => void 
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editPrice, setEditPrice] = useState(product.price.toString());

    const handleSave = () => {
      const newPrice = parseFloat(editPrice);
      if (newPrice > 0) {
        onUpdatePrice(product.name, newPrice);
        setIsEditing(false);
      }
    };

    const handleCancel = () => {
      setEditPrice(product.price.toString());
      setIsEditing(false);
    };

    return (
      <div className="product-item">
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-meta">
            Last used: {new Date(product.lastUsed).toLocaleDateString()}
          </div>
        </div>
        <div className="product-price">
          {isEditing ? (
            <div className="price-edit">
              <input 
                type="number"
                className="price-input"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                step="0.01"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <button onClick={handleSave} className="btn-small btn-success">✓</button>
              <button onClick={handleCancel} className="btn-small btn-secondary">✗</button>
            </div>
          ) : (
            <div className="price-display">
              <span className="price">${product.price.toFixed(2)}</span>
              <button onClick={() => setIsEditing(true)} className="btn-small btn-primary">Edit</button>
              <button onClick={() => onDelete(product.name)} className="btn-small btn-danger">Delete</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Unified Header Component
  const AppHeader = ({ 
    showBackButton = false, 
    onBack, 
    pageTitle, 
    pageSubtitle 
  }: { 
    showBackButton?: boolean, 
    onBack?: () => void,
    pageTitle?: string,
    pageSubtitle?: string 
  }) => (
    <header className="app-header fade-in">
      <div className="header-top">
        <div className="header-left">
          <button 
            className="hamburger-btn"
            onClick={() => setShowNavigation(true)}
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="logo-area">
            <h1 className="app-logo">Orderly</h1>
          </div>
        </div>
        {showBackButton && onBack && (
          <div className="header-right">
            <button 
              className="btn btn-secondary"
              onClick={onBack}
            >
              ← Back to Orders
            </button>
          </div>
        )}
      </div>
      {pageTitle && (
        <div className="page-header">
          <h2 className="page-title">{pageTitle}</h2>
          {pageSubtitle && <p className="page-subtitle">{pageSubtitle}</p>}
        </div>
      )}
    </header>
  );

  // Get suggested price for a product
  const getSuggestedPrice = (productName: string): number => {
    const product = savedProducts.find(p => 
      p.name.toLowerCase() === productName.toLowerCase()
    );
    return product ? product.price : 0;
  };

  // Clear form after invoice generation
  const clearForm = () => {
    setRawText('');
    setPricedItems([]);
    setCustomerName('');
    setCustomerAddress('');
    setShippingCost(0);
    setTaxRate(0);
    setShowCustomerDropdown(false);
    // Keep invoice date as current date for next invoice
    setInvoiceDate(new Date().toISOString().split('T')[0]);
  };

  const handleParse = () => {
    const data = parseOrderData(rawText);
    const initialPricedItems = data.map(item => {
      const productName = item.category; // Use category as initial product name
      const suggestedPrice = getSuggestedPrice(productName);
      const price = suggestedPrice > 0 ? suggestedPrice : 0;
      
      return { 
        ...item, 
        productName,
        price,
        subtotal: item.quantity * price
      };
    });
    setPricedItems(initialPricedItems);
  };

  const handleItemChange = (index: number, field: keyof PricedOrderItem, value: string | number) => {
    const updatedItems = [...pricedItems];
    const item = updatedItems[index];
    (item[field] as any) = value;

    // Auto-suggest price when product name changes
    if (field === 'productName' && typeof value === 'string') {
      const suggestedPrice = getSuggestedPrice(value);
      if (suggestedPrice > 0) {
        item.price = suggestedPrice;
      }
    }

    // Always recalculate subtotal when quantity or price changes, or when productName changes with auto-price
    if (field === 'quantity' || field === 'price' || (field === 'productName' && item.price > 0)) {
        item.subtotal = item.quantity * item.price;
    }

    setPricedItems(updatedItems);
  };

  // Group items by product name for better display
  const groupedItems = pricedItems.reduce((groups, item, index) => {
    const key = item.productName || item.category;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push({ ...item, originalIndex: index });
    return groups;
  }, {} as Record<string, (PricedOrderItem & { originalIndex: number })[]>);

  const handleGenerateInvoice = () => {
    saveCustomer(); // Save customer before generating invoice
    saveProducts(); // Save products with their prices
    saveInvoice(); // Save the invoice record
    generateInvoice(customerName, customerAddress, pricedItems, subtotal, shippingCost, taxRate, taxAmount, grandTotal, businessSettings, invoiceNumber, invoiceDate);
    const newInvoiceNumber = invoiceNumber + 1;
    setInvoiceNumber(newInvoiceNumber);
    localStorage.setItem('orderly-invoice-number', newInvoiceNumber.toString());
    
    // Clear form for next invoice
    clearForm();
  };

  const handleSettingsChange = (settings: BusinessSettings) => {
    setBusinessSettings(settings);
  };

  const subtotal = pricedItems.reduce((total, item) => total + item.subtotal, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + shippingCost + taxAmount;

  // Data backup and restore functions
  const exportData = () => {
    const data = {
      invoices: savedInvoices,
      products: savedProducts,
      customers: customers,
      businessSettings: businessSettings,
      invoiceNumber: invoiceNumber,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orderly-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.invoices) {
          setSavedInvoices(data.invoices);
          localStorage.setItem('orderly-invoices', JSON.stringify(data.invoices));
        }
        
        if (data.products) {
          setSavedProducts(data.products);
          localStorage.setItem('orderly-products', JSON.stringify(data.products));
        }
        
        if (data.customers) {
          setCustomers(data.customers);
          localStorage.setItem('orderly-customers', JSON.stringify(data.customers));
        }
        
        if (data.businessSettings) {
          setBusinessSettings(data.businessSettings);
          localStorage.setItem('orderly-business-settings', JSON.stringify(data.businessSettings));
        }
        
        if (data.invoiceNumber) {
          setInvoiceNumber(data.invoiceNumber);
          localStorage.setItem('orderly-invoice-number', data.invoiceNumber.toString());
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  if (showSettings) {
    return (
      <div className="container">
        {/* Navigation Overlay - available on Settings page */}
        {showNavigation && (
          <div 
            className="nav-overlay"
            onClick={() => setShowNavigation(false)}
          >
            <div 
              className="nav-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-header">
                <h3>Navigation</h3>
                <button 
                  className="nav-close"
                  onClick={() => setShowNavigation(false)}
                >
                  ×
                </button>
              </div>
              <nav className="nav-menu">
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(true);
                    setShowNavigation(false);
                  }}
                >
                  <span>⚙️</span>
                  Business Settings
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowProductManagement(true);
                    setShowSettings(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>📦</span>
                  Product Management
                  <small>{savedProducts.length} products</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowInvoiceHistory(true);
                    setShowSettings(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>📋</span>
                  Invoice History
                  <small>{savedInvoices.length} invoices</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(false);
                    setShowProductManagement(false);
                    setShowInvoiceHistory(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>🏠</span>
                  Order Processing
                </button>
                <div className="nav-divider"></div>
                <button 
                  className="nav-item"
                  onClick={() => {
                    exportData();
                    setShowNavigation(false);
                  }}
                >
                  <span>💾</span>
                  Export Data
                  <small>Backup your data</small>
                </button>
                <button className="nav-item" style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  <span>📥</span>
                  Import Data
                  <small>Restore from backup</small>
                </button>
              </nav>
            </div>
          </div>
        )}

        <Settings 
          onBack={() => setShowSettings(false)} 
          onSettingsChange={handleSettingsChange}
        />
      </div>
    );
  }

  if (showProductManagement) {
    return (
      <div className="container">
        {/* Navigation Overlay - available on Product Management page */}
        {showNavigation && (
          <div 
            className="nav-overlay"
            onClick={() => setShowNavigation(false)}
          >
            <div 
              className="nav-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-header">
                <h3>Navigation</h3>
                <button 
                  className="nav-close"
                  onClick={() => setShowNavigation(false)}
                >
                  ×
                </button>
              </div>
              <nav className="nav-menu">
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(true);
                    setShowProductManagement(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>⚙️</span>
                  Business Settings
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowProductManagement(true);
                    setShowNavigation(false);
                  }}
                >
                  <span>📦</span>
                  Product Management
                  <small>{savedProducts.length} products</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowInvoiceHistory(true);
                    setShowProductManagement(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>📋</span>
                  Invoice History
                  <small>{savedInvoices.length} invoices</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(false);
                    setShowProductManagement(false);
                    setShowInvoiceHistory(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>🏠</span>
                  Order Processing
                </button>
                <div className="nav-divider"></div>
                <button 
                  className="nav-item"
                  onClick={() => {
                    exportData();
                    setShowNavigation(false);
                  }}
                >
                  <span>💾</span>
                  Export Data
                  <small>Backup your data</small>
                </button>
                <button className="nav-item" style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  <span>📥</span>
                  Import Data
                  <small>Restore from backup</small>
                </button>
              </nav>
            </div>
          </div>
        )}

        <AppHeader 
          showBackButton={true}
          onBack={() => setShowProductManagement(false)}
          pageTitle="Product Management"
          pageSubtitle="Manage your product database and pricing"
        />
        
        <main>
          <div className="card">
            <h2 className="section-title">Add New Product</h2>
            <ProductForm onAddProduct={addNewProduct} />
          </div>

          <div className="card">
            <h2 className="section-title">Saved Products ({savedProducts.length})</h2>
            {savedProducts.length > 0 ? (
              <div className="product-list">
                {savedProducts.map((product, index) => (
                  <ProductItem 
                    key={`${product.name}-${index}`}
                    product={product}
                    onUpdatePrice={updateProductPrice}
                    onDelete={deleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center" style={{color: 'var(--text-quaternary)', padding: '3rem 2rem'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <p>No products saved yet. Generate some invoices to build your product database!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (showInvoiceHistory) {
    return (
      <div className="container">
        {/* Navigation Overlay - available on Invoice History page */}
        {showNavigation && (
          <div 
            className="nav-overlay"
            onClick={() => setShowNavigation(false)}
          >
            <div 
              className="nav-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-header">
                <h3>Navigation</h3>
                <button 
                  className="nav-close"
                  onClick={() => setShowNavigation(false)}
                >
                  ×
                </button>
              </div>
              <nav className="nav-menu">
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(true);
                    setShowInvoiceHistory(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>⚙️</span>
                  Business Settings
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowProductManagement(true);
                    setShowInvoiceHistory(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>📦</span>
                  Product Management
                  <small>{savedProducts.length} products</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowInvoiceHistory(true);
                    setShowNavigation(false);
                  }}
                >
                  <span>📋</span>
                  Invoice History
                  <small>{savedInvoices.length} invoices</small>
                </button>
                <button 
                  className="nav-item"
                  onClick={() => {
                    setShowSettings(false);
                    setShowProductManagement(false);
                    setShowInvoiceHistory(false);
                    setShowNavigation(false);
                  }}
                >
                  <span>🏠</span>
                  Order Processing
                </button>
                <div className="nav-divider"></div>
                <button 
                  className="nav-item"
                  onClick={() => {
                    exportData();
                    setShowNavigation(false);
                  }}
                >
                  <span>💾</span>
                  Export Data
                  <small>Backup your data</small>
                </button>
                <button className="nav-item" style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  <span>📥</span>
                  Import Data
                  <small>Restore from backup</small>
                </button>
              </nav>
            </div>
          </div>
        )}

        <AppHeader 
          showBackButton={true}
          onBack={() => setShowInvoiceHistory(false)}
          pageTitle="Invoice History"
          pageSubtitle="Manage your invoices and track payments"
        />
        
        <main>
          <div className="card">
            <div className="invoice-stats">
              <div className="stat">
                <div className="stat-number">{savedInvoices.length}</div>
                <div className="stat-label">Total Invoices</div>
              </div>
              <div className="stat">
                <div className="stat-number">{savedInvoices.filter(i => i.isPaid).length}</div>
                <div className="stat-label">Paid</div>
              </div>
              <div className="stat">
                <div className="stat-number">{savedInvoices.filter(i => !i.isPaid).length}</div>
                <div className="stat-label">Unpaid</div>
              </div>
              <div className="stat">
                <div className="stat-number">
                  ${savedInvoices.filter(i => i.isPaid).reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                </div>
                <div className="stat-label">Revenue</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Recent Invoices</h2>
            {savedInvoices.length > 0 ? (
              <div className="invoice-list">
                {savedInvoices.map((invoice) => (
                  <div key={invoice.id} className={`invoice-item ${invoice.isPaid ? 'paid' : 'unpaid'}`}>
                    <div className="invoice-main">
                      <div className="invoice-details">
                        <div className="invoice-number">Invoice #{invoice.id}</div>
                        <div className="invoice-customer">{invoice.customerName}</div>
                        <div className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</div>
                      </div>
                      <div className="invoice-amount">${invoice.total.toFixed(2)}</div>
                      <div className="invoice-status">
                        <span className={`status-badge ${invoice.isPaid ? 'paid' : 'unpaid'}`}>
                          {invoice.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <div className="invoice-actions">
                        <button 
                          className={`btn ${invoice.isPaid ? 'btn-secondary' : 'btn-success'}`}
                          onClick={() => toggleInvoicePayment(invoice.id)}
                        >
                          {invoice.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => redownloadInvoice(invoice)}
                        >
                          <span>📄</span>
                          Download PDF
                        </button>
                      </div>
                    </div>
                    <div className="invoice-items">
                      {invoice.items.map((item, idx) => (
                        <span key={idx} className="item-tag">
                          {item.quantity}x {item.productName} ({item.size})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{color: 'var(--text-quaternary)', padding: '3rem 2rem'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <p>No invoices generated yet</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Navigation Overlay */}
      {showNavigation && (
        <div 
          className="nav-overlay"
          onClick={() => setShowNavigation(false)}
        >
          <div 
            className="nav-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nav-header">
              <h3>Navigation</h3>
              <button 
                className="nav-close"
                onClick={() => setShowNavigation(false)}
              >
                ×
              </button>
            </div>
            <nav className="nav-menu">
              <button 
                className="nav-item"
                onClick={() => {
                  setShowSettings(true);
                  setShowNavigation(false);
                }}
              >
                <span>⚙️</span>
                Business Settings
              </button>
              <button 
                className="nav-item"
                onClick={() => setShowNavigation(false)}
              >
                <span>📊</span>
                Dashboard
                <small>Coming Soon</small>
              </button>
              <button 
                className="nav-item"
                onClick={() => {
                  setShowProductManagement(true);
                  setShowNavigation(false);
                }}
              >
                <span>📦</span>
                Product Management
                <small>{savedProducts.length} products</small>
              </button>
              <button 
                className="nav-item"
                onClick={() => {
                  setShowInvoiceHistory(true);
                  setShowNavigation(false);
                }}
              >
                <span>📋</span>
                Invoice History
                <small>{savedInvoices.length} invoices</small>
              </button>
              <button 
                className="nav-item"
                onClick={() => setShowNavigation(false)}
              >
                <span>👥</span>
                Customer Database
                <small>{customers.length} customers</small>
              </button>
              <div className="nav-divider"></div>
              <button 
                className="nav-item"
                onClick={() => {
                  exportData();
                  setShowNavigation(false);
                }}
              >
                <span>💾</span>
                Export Data
                <small>Backup your data</small>
              </button>
              <button className="nav-item" style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                />
                <span>📥</span>
                Import Data
                <small>Restore from backup</small>
              </button>
              <div className="nav-divider"></div>
              <button 
                className="nav-item"
                onClick={() => setShowNavigation(false)}
              >
                <span>❓</span>
                Help & Support
              </button>
            </nav>
          </div>
        </div>
      )}

      <AppHeader 
        pageTitle="Order Processing"
        pageSubtitle="Transform your order data into professional invoices with modern efficiency"
      />
      
      <main className="grid grid-cols-2">
        {/* Left Column - Order Input & Customer Details */}
        <div className="slide-in-left">
          <div className="card">
            <h2 className="section-title">Order Data</h2>
            <label className="form-label">Paste your raw order data below</label>
            <textarea
              className="form-input"
              placeholder="Paste your order details here...&#10;&#10;Example:&#10;Ladies    Mens&#10;XS-4      0&#10;S-0       5&#10;M-4       5"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            ></textarea>
            <button
              className="btn btn-primary mt-6 w-full"
              onClick={handleParse}
              disabled={!rawText.trim()}
            >
              <span>🔍</span>
              Parse Order Data
            </button>
          </div>

          <div className="card">
            <h2 className="section-title">Customer Details</h2>
            <div className="mb-6" style={{ position: 'relative' }}>
              <label className="form-label">Customer Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter customer name"
                value={customerName} 
                onChange={(e) => handleCustomerNameChange(e.target.value)}
                onFocus={() => customerName.length > 0 && filteredCustomers.length > 0 && setShowCustomerDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
              />
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="customer-dropdown">
                  {filteredCustomers.slice(0, 5).map((customer, index) => (
                    <div 
                      key={index}
                      className="customer-option"
                      onClick={() => selectCustomer(customer)}
                    >
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-address">{customer.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="form-label">Customer Address</label>
              <textarea 
                className="form-input"
                placeholder="Enter customer address"
                value={customerAddress} 
                onChange={(e) => setCustomerAddress(e.target.value)}
                style={{ minHeight: '100px' }}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div>
                <label className="form-label">Invoice Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={invoiceDate} 
                  onChange={(e) => setInvoiceDate(e.target.value)} 
                />
              </div>
              <div>
                <label className="form-label">Invoice Number</label>
                <div className="form-input" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'var(--surface-accent)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--primary-500)'
                }}>
                  #{invoiceNumber}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              <div>
                <label className="form-label">Shipping Cost ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={shippingCost || ''} 
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div>
                <label className="form-label">Tax Rate (%)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="100"
                  value={taxRate || ''} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
          </div>

          {/* Business Settings Summary */}
          {businessSettings.companyName && (
            <div className="card">
              <h2 className="section-title">Business Info</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                background: 'var(--surface-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}>
                {businessSettings.logo && (
                  <img 
                    src={businessSettings.logo} 
                    alt="Company Logo" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      objectFit: 'contain',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px'
                    }} 
                  />
                )}
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {businessSettings.companyName}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    Click Business Settings to edit
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show setup prompt if no business settings */}
          {!businessSettings.companyName && (
            <div className="card">
              <h2 className="section-title">Setup Required</h2>
              <div style={{ 
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-tertiary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <p style={{ marginBottom: '1.5rem' }}>Configure your business information to get started</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowSettings(true)}
                >
                  <span>🏢</span>
                  Setup Business Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Product & Pricing */}
        <div className="slide-in-right">
          <div className="card">
            <h2 className="section-title">Product & Pricing</h2>
            {Object.entries(groupedItems).length > 0 ? (
              <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {Object.entries(groupedItems).map(([productName, items]) => (
                  <div key={productName} className="product-group">
                    <h3>{productName}</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Qty</th>
                          <th>Product Name</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, itemIndex) => (
                          <tr key={`${productName}-${item.originalIndex}-${itemIndex}`}>
                            <td>{item.size}</td>
                            <td>{item.quantity}</td>
                            <td>
                              <input 
                                type="text" 
                                className="table-input"
                                value={item.productName || ''} 
                                onChange={(e) => handleItemChange(item.originalIndex, 'productName', e.target.value)}
                                list={`products-${productName}-${item.originalIndex}`}
                                placeholder="Enter product name"
                                autoComplete="off"
                              />
                              <datalist id={`products-${productName}-${item.originalIndex}`}>
                                {savedProducts.map((product, idx) => (
                                  <option key={`${product.name}-${idx}`} value={product.name} />
                                ))}
                              </datalist>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="table-input"
                                value={item.price || ''} 
                                onChange={(e) => handleItemChange(item.originalIndex, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </td>
                            <td>${item.subtotal.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{color: 'var(--text-quaternary)', padding: '3rem 2rem'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <p>Parse your order data to see products here</p>
              </div>
            )}
            
            <div className="totals mt-6">
              <div className="invoice-info">
                Invoice #{invoiceNumber} • {new Date(invoiceDate).toLocaleDateString()}
              </div>
              
              <div className="totals-breakdown">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="total-line">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                )}
                {taxRate > 0 && (
                  <div className="total-line">
                    <span>Tax ({taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-line grand-total">
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-success w-full mt-4"
                onClick={handleGenerateInvoice}
                disabled={Object.entries(groupedItems).length === 0 || !customerName.trim()}
              >
                <span>📄</span>
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer with some additional info */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'var(--text-quaternary)', 
        fontSize: '0.875rem',
        marginTop: '2rem'
      }}>
        <p>Built with modern web technologies for efficient order processing</p>
      </footer>
    </div>
  );
}

export default App;
