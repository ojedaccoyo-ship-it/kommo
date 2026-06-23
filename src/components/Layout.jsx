import React, { useContext } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import {
  LayoutDashboard,
  CalendarRange,
  Compass,
  Film,
  Megaphone,
  FolderOpen,
  Users2,
  FileSpreadsheet,
  TrendingUp,
  Sliders,
  Filter,
  RefreshCw
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'planeamiento', name: 'Planeamiento', icon: Compass },
  { id: 'calendario', name: 'Calendario de Contenido', icon: CalendarRange },
  { id: 'produccion', name: 'Producción Audiovisual', icon: Film },
  { id: 'publicidad', name: 'Publicidad Digital', icon: Megaphone },
  { id: 'activos', name: 'Activos Digitales', icon: FolderOpen },
  { id: 'personal', name: 'Personal Marketing', icon: Users2 },
  { id: 'informes', name: 'Informes', icon: FileSpreadsheet },
  { id: 'kpis', name: 'KPIs', icon: TrendingUp },
  { id: 'configuracion', name: 'Configuración', icon: Sliders }
];

export const Layout = ({ activeTab, setActiveTab, children }) => {
  const { products, collaborators, filters, setFilters } = useContext(MarketingContext);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      productId: 'all',
      dateRange: { start: '2026-01-01', end: '2026-12-31' },
      channel: 'all',
      owner: 'all'
    });
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <h1 style={{
            fontSize: '1.4rem',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-teal))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800
          }}>
            KOMMO ERP
          </h1>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600
          }}>
            MÓDULO DE MARKETING
          </span>
        </div>

        {/* Sidebar Menu */}
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexGrow: 1, overflowY: 'auto' }}>
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  paddingLeft: isActive ? 'calc(1rem - 3px)' : '1rem'
                }}
                className={isActive ? '' : 'sidebar-item-hover'}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          v1.0.0 • © 2026 Kommo
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header & Global Filters */}
        <header style={{
          padding: '1rem 1.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', textTransform: 'capitalize', fontWeight: 700 }}>
              {sidebarItems.find(item => item.id === activeTab)?.name || 'Marketing'}
            </h2>
            
            {/* Filter Toggle / Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Filter size={12} /> Filtros Activos
              </span>
              <button 
                onClick={resetFilters} 
                className="btn btn-secondary btn-sm"
                title="Restablecer filtros"
                style={{ padding: '0.35rem', display: 'flex', alignItems: 'center' }}
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.15)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            {/* Product Filter */}
            <div style={{ minWidth: '150px' }}>
              <select
                id="global-product-filter"
                value={filters.productId}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                className="input"
                style={{ padding: '0.25rem 0.5rem', height: '32px' }}
              >
                <option value="all">📍 Todos los Productos</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>📍 {p.name}</option>
                ))}
              </select>
            </div>

            {/* Channel Filter */}
            <div style={{ minWidth: '130px' }}>
              <select
                id="global-channel-filter"
                value={filters.channel}
                onChange={(e) => handleFilterChange('channel', e.target.value)}
                className="input"
                style={{ padding: '0.25rem 0.5rem', height: '32px' }}
              >
                <option value="all">📣 Todos los Canales</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Blog">Blog</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            {/* Collaborator Filter */}
            <div style={{ minWidth: '150px' }}>
              <select
                id="global-owner-filter"
                value={filters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="input"
                style={{ padding: '0.25rem 0.5rem', height: '32px' }}
              >
                <option value="all">👤 Todos los Responsables</option>
                {collaborators.map(c => (
                  <option key={c.id} value={c.name}>👤 {c.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range Start */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Desde:</span>
              <input
                id="global-date-start"
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="input"
                style={{ padding: '0.25rem 0.5rem', height: '32px', width: '130px' }}
              />
            </div>

            {/* Date Range End */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hasta:</span>
              <input
                id="global-date-end"
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="input"
                style={{ padding: '0.25rem 0.5rem', height: '32px', width: '130px' }}
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content Pane */}
        <div className="content-pane">
          {children}
        </div>
      </main>

      {/* Styled Hover Effect for Sidebar Navigation */}
      <style>{`
        .sidebar-item-hover:hover {
          background-color: var(--bg-card-hover) !important;
          color: var(--text-primary) !important;
          padding-left: 1.15rem !important;
        }
      `}</style>
    </div>
  );
};
