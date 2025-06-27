// Google Analytics 4 setup
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    const gtag = (...args: any[]) => {
      (window as any).dataLayer.push(args);
    };
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: 'Orderly Invoice App',
      page_location: window.location.href,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
    });
  }
};

// Track business events
export const trackBusinessEvent = {
  invoiceGenerated: (amount: number, customerName: string) => {
    trackEvent('invoice_generated', 'business', customerName, amount);
  },
  
  customerAdded: (customerName: string) => {
    trackEvent('customer_added', 'business', customerName);
  },
  
  productAdded: (productName: string, price: number) => {
    trackEvent('product_added', 'business', productName, price);
  },
  
  dataExported: () => {
    trackEvent('data_exported', 'business', 'backup');
  },
  
  dataImported: () => {
    trackEvent('data_imported', 'business', 'restore');
  },
  
  dashboardViewed: () => {
    trackEvent('dashboard_viewed', 'navigation', 'dashboard');
  },
  
  settingsChanged: () => {
    trackEvent('settings_changed', 'business', 'configuration');
  }
};
