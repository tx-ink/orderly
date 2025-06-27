import React from 'react';
import type { SavedInvoice, SavedProduct } from '../utils/types';

interface DashboardProps {
  savedInvoices: SavedInvoice[];
  savedProducts: SavedProduct[];
  customers: Array<{name: string, address: string}>;
}

const Dashboard: React.FC<DashboardProps> = ({ savedInvoices, savedProducts, customers }) => {
  // Calculate analytics
  const totalRevenue = savedInvoices.filter(i => i.isPaid).reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = savedInvoices.filter(i => !i.isPaid).reduce((sum, inv) => sum + inv.total, 0);
  const avgOrderValue = savedInvoices.length > 0 ? totalRevenue / savedInvoices.filter(i => i.isPaid).length : 0;
  const paymentRate = savedInvoices.length > 0 ? (savedInvoices.filter(i => i.isPaid).length / savedInvoices.length) * 100 : 0;

  // Recent invoices (last 5)
  const recentInvoices = savedInvoices.slice(0, 5);
  // Top products by quantity sold
  const productSales = savedInvoices.reduce((acc, invoice) => {
    invoice.items.forEach((item: any) => {
      const key = item.productName || item.category;
      if (!acc[key]) {
        acc[key] = { name: key, quantity: 0, revenue: 0 };
      }
      acc[key].quantity += item.quantity;
      acc[key].revenue += item.subtotal;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  // Monthly revenue trend (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthRevenue = savedInvoices
      .filter(inv => inv.isPaid && inv.date.startsWith(monthKey))
      .reduce((sum, inv) => sum + inv.total, 0);
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthRevenue
    };
  }).reverse();

  return (
    <div className="dashboard">
      {/* Key Metrics */}
      <div className="dashboard-metrics">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">${totalRevenue.toFixed(2)}</div>
            <div className="metric-change">
              {savedInvoices.filter(i => i.isPaid).length} paid invoices
            </div>
          </div>
        </div>

        <div className="metric-card pending">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <div className="metric-label">Pending Revenue</div>
            <div className="metric-value">${pendingRevenue.toFixed(2)}</div>
            <div className="metric-change">
              {savedInvoices.filter(i => !i.isPaid).length} unpaid invoices
            </div>
          </div>
        </div>

        <div className="metric-card customers">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-label">Total Customers</div>
            <div className="metric-value">{customers.length}</div>
            <div className="metric-change">
              {savedInvoices.length} total invoices
            </div>
          </div>
        </div>

        <div className="metric-card avg-order">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-label">Avg Order Value</div>
            <div className="metric-value">${avgOrderValue.toFixed(2)}</div>
            <div className="metric-change">
              {paymentRate.toFixed(1)}% payment rate
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Revenue Trend */}
        <div className="dashboard-card revenue-trend">
          <h3 className="card-title">Revenue Trend</h3>
          <div className="trend-chart">
            {monthlyData.map((month) => (
              <div key={month.month} className="trend-bar">
                <div 
                  className="trend-fill"
                  style={{ 
                    height: `${Math.max(10, (month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100)}%` 
                  }}
                ></div>
                <div className="trend-label">{month.month.split(' ')[0]}</div>
                <div className="trend-value">${month.revenue.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="dashboard-card recent-invoices">
          <h3 className="card-title">Recent Invoices</h3>
          <div className="invoice-list">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="invoice-summary">
                  <div className="invoice-info">
                    <div className="invoice-number">#{invoice.id}</div>
                    <div className="invoice-customer">{invoice.customerName}</div>
                    <div className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</div>
                  </div>
                  <div className="invoice-amount">${invoice.total.toFixed(2)}</div>
                  <div className={`invoice-status ${invoice.isPaid ? 'paid' : 'unpaid'}`}>
                    {invoice.isPaid ? '✓' : '⏳'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card top-products">
          <h3 className="card-title">Top Products</h3>
          <div className="product-list">            {topProducts.length > 0 ? (
              topProducts.map((product: any, index) => (
                <div key={product.name} className="product-summary">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      {product.quantity} units • ${product.revenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="product-bar">
                    <div 
                      className="product-fill"
                      style={{ 
                        width: `${(product.revenue / Math.max(...topProducts.map((p: any) => p.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No products sold yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card quick-stats">
          <h3 className="card-title">Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{savedProducts.length}</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {savedInvoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0)}
              </div>
              <div className="stat-label">Items Sold</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {new Set(savedInvoices.map(inv => inv.customerName)).size}
              </div>
              <div className="stat-label">Unique Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {savedInvoices.length > 0 ? Math.round((Date.now() - new Date(savedInvoices[savedInvoices.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="stat-label">Days Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
