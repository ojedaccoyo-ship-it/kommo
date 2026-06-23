import React, { useContext } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { 
  Calendar, 
  CheckCircle, 
  Film, 
  Tv, 
  PlaySquare,
  TrendingUp, 
  DollarSign, 
  Percent, 
  Users 
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    filters, 
    products, 
    contentCalendar, 
    adsCampaigns, 
    collaborators, 
    getCollaboratorCompliance,
    getProductMetrics 
  } = useContext(MarketingContext);

  // Helper to check if a item is in the date range
  const isInDateRange = (dateStr) => {
    if (!dateStr) return true;
    return dateStr >= filters.dateRange.start && dateStr <= filters.dateRange.end;
  };

  // 1. FILTER CONTENT CALENDAR
  const filteredPosts = contentCalendar.filter(post => {
    const matchProduct = filters.productId === 'all' || post.product === filters.productId;
    const matchChannel = filters.channel === 'all' || post.channel === filters.channel;
    const matchOwner = filters.owner === 'all' || post.owner === filters.owner;
    const matchDate = isInDateRange(post.publishDate);
    return matchProduct && matchChannel && matchOwner && matchDate;
  });

  const scheduledCount = filteredPosts.filter(p => p.status === 'Programado' || p.status === 'Revisión').length;
  const publishedCount = filteredPosts.filter(p => p.status === 'Publicado').length;
  const reelsCount = filteredPosts.filter(p => p.contentType === 'Reel' && p.status === 'Publicado').length;
  const videosCount = filteredPosts.filter(p => (p.contentType === 'Video' || p.contentType === 'Video horizontal' || p.contentType === 'Video vertical') && p.status === 'Publicado').length;

  // 2. FILTER DIGITAL ADS & RESULTS
  const filteredAds = adsCampaigns.filter(ad => {
    const matchProduct = filters.productId === 'all' || ad.product === filters.productId;
    const matchOwner = filters.owner === 'all' || ad.owner === filters.owner;
    // Map platform mapping for channel filtering
    let matchChannel = true;
    if (filters.channel !== 'all') {
      if (filters.channel === 'Facebook' || filters.channel === 'Instagram' || filters.channel === 'WhatsApp') {
        matchChannel = ad.platform === 'Meta Ads';
      } else if (filters.channel === 'TikTok') {
        matchChannel = ad.platform === 'TikTok Ads';
      } else if (filters.channel === 'YouTube') {
        matchChannel = ad.platform === 'Google Ads';
      } else {
        matchChannel = false; // Blog does not map to Ads
      }
    }
    return matchProduct && matchChannel && matchOwner;
  });

  // Calculate totals for active ads
  const totals = filteredAds.reduce((acc, curr) => {
    const res = curr.results || { spent: 0, revenue: 0, clicks: 0, impressions: 0, leads: 0, purchases: 0 };
    return {
      spent: acc.spent + res.spent,
      revenue: acc.revenue + res.revenue,
      leads: acc.leads + res.leads,
      purchases: acc.purchases + res.purchases
    };
  }, { spent: 0, revenue: 0, leads: 0, purchases: 0 });

  const activeAdsCount = filteredAds.length;
  const roas = totals.spent > 0 ? (totals.revenue / totals.spent).toFixed(2) : '0.00';

  // 3. TEAM COMPLIANCE CALCULATION
  const activeCollaborators = collaborators.filter(col => {
    return filters.owner === 'all' || col.name === filters.owner;
  });

  const compliances = activeCollaborators.map(col => getCollaboratorCompliance(col.name).rate);
  const avgCompliance = compliances.length > 0 
    ? Math.round(compliances.reduce((a, b) => a + b, 0) / compliances.length) 
    : 0;

  // 4. CHART DATA: Product Performance (Spent vs Revenue)
  // meeting the core design principle
  const productChartData = products.map(prod => {
    const metrics = getProductMetrics(prod.id);
    return {
      name: prod.name,
      spent: metrics.spent,
      revenue: metrics.revenue
    };
  });

  const maxChartValue = Math.max(...productChartData.map(d => Math.max(d.spent, d.revenue)), 1000);

  // 5. CHART DATA: Channel Share (Leads per Channel)
  const channelData = {
    Instagram: { value: 0, color: '#ec4899' },
    Facebook: { value: 0, color: '#3b82f6' },
    TikTok: { value: 0, color: '#00f2fe' },
    YouTube: { value: 0, color: '#ef4444' },
    GoogleSearch: { value: 0, color: '#10b981' }
  };

  // Aggregate leads from ads by platform/channel
  filteredAds.forEach(ad => {
    const leads = ad.results?.leads || 0;
    if (ad.platform === 'Meta Ads') {
      // Split 50/50 for illustration
      channelData.Instagram.value += Math.round(leads * 0.6);
      channelData.Facebook.value += Math.round(leads * 0.4);
    } else if (ad.platform === 'TikTok Ads') {
      channelData.TikTok.value += leads;
    } else if (ad.platform === 'Google Ads') {
      channelData.GoogleSearch.value += Math.round(leads * 0.7);
      channelData.YouTube.value += Math.round(leads * 0.3);
    }
  });

  const totalLeads = Object.values(channelData).reduce((a, b) => a + b.value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Metric Cards Grid */}
      <div className="grid-cols-4">
        
        {/* Scheduled Content */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Posts Programados</div>
            <div className="card-value">{scheduledCount}</div>
            <div className="card-desc">Contenido en cola/revisión</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
            <Calendar size={24} />
          </div>
        </div>

        {/* Realized Content */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Posts Realizados</div>
            <div className="card-value">{publishedCount}</div>
            <div className="card-desc">Publicados orgánicamente</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Video Assets */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Videos / Reels</div>
            <div className="card-value">{reelsCount + videosCount}</div>
            <div className="card-desc">{reelsCount} Reels | {videosCount} Videos pág.</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-purple-soft)', color: 'var(--color-purple)' }}>
            <Film size={24} />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Campañas Activas</div>
            <div className="card-value">{activeAdsCount}</div>
            <div className="card-desc">Plataformas publicitarias</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}>
            <Tv size={24} />
          </div>
        </div>

      </div>

      <div className="grid-cols-4">
        
        {/* Leads Generated */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Leads Generados</div>
            <div className="card-value">{totals.leads.toLocaleString()}</div>
            <div className="card-desc">Registros de interés calificados</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-teal-soft)', color: 'var(--color-teal)' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Attributed Sales */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Ventas Atribuidas</div>
            <div className="card-value">${totals.revenue.toLocaleString()}</div>
            <div className="card-desc">Ingreso total rastreado</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-soft)', color: 'var(--color-success)' }}>
            <DollarSign size={24} />
          </div>
        </div>

        {/* ROAS General */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">ROAS General</div>
            <div className="card-value">{roas}x</div>
            <div className="card-desc">Retorno de inversión publicitaria</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Team Compliance */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">Cumplimiento Equipo</div>
            <div className="card-value">{avgCompliance}%</div>
            <div className="card-desc">Ejecución de obligaciones del mes</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-purple-soft)', color: 'var(--color-purple)' }}>
            <Percent size={24} />
          </div>
        </div>

      </div>

      {/* Charts Panel */}
      <div className="grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Chart 1: Product Rentability (Primary Design Principle) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
            Rentabilidad por Producto Turístico (Inversión vs. Ingresos)
          </h3>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {productChartData.map((d, i) => {
              const spentPct = (d.spent / maxChartValue) * 100;
              const revenuePct = (d.revenue / maxChartValue) * 100;
              const productRoas = d.spent > 0 ? (d.revenue / d.spent).toFixed(1) : '0';

              return (
                <div key={d.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: i === productChartData.length - 1 ? '0' : '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Gasto: <strong style={{ color: 'var(--color-danger)' }}>${d.spent.toLocaleString()}</strong> | 
                      Ingreso: <strong style={{ color: 'var(--color-success)' }}>${d.revenue.toLocaleString()}</strong> 
                      {d.spent > 0 && <span className="badge badge-success" style={{ marginLeft: '0.5rem', padding: '0px 4px' }}>ROAS {productRoas}x</span>}
                    </span>
                  </div>
                  {/* Custom CSS Bars */}
                  <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', height: '16px', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px', padding: '2px' }}>
                    <div style={{ width: `${Math.max(spentPct, 1)}%`, backgroundColor: 'var(--color-danger)', height: '5px', borderRadius: '2px', transition: 'width 1s ease-out' }}></div>
                    <div style={{ width: `${Math.max(revenuePct, 1)}%`, backgroundColor: 'var(--color-success)', height: '5px', borderRadius: '2px', transition: 'width 1s ease-out' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--color-danger)', borderRadius: '2px' }}></span> Gasto Publicitario
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--color-success)', borderRadius: '2px' }}></span> Ingreso Atribuido (Ventas)
            </span>
          </div>
        </div>

        {/* Chart 2: Leads Share by Channel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} style={{ color: 'var(--color-teal)' }} />
            Distribución de Leads por Canal
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
            {totalLeads > 0 ? (
              <svg width="150" height="150" viewBox="0 0 42 42" className="donut">
                <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="transparent"></circle>
                <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--bg-secondary)" strokeWidth="3"></circle>
                
                {/* Dynamically build segments */}
                {(() => {
                  let accumulatedPercent = 0;
                  return Object.entries(channelData).map(([key, data]) => {
                    if (data.value === 0) return null;
                    const pct = (data.value / totalLeads) * 100;
                    const strokeDasharray = `${pct} ${100 - pct}`;
                    const strokeDashoffset = 100 - accumulatedPercent + 25; // 25 adds standard 90deg rotation
                    accumulatedPercent += pct;

                    return (
                      <circle
                        key={key}
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={data.color}
                        strokeWidth="4"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()}
              </svg>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sin leads en este filtro</div>
            )}
            {totalLeads > 0 && (
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalLeads}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Leads</span>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
            {Object.entries(channelData).map(([name, data]) => {
              if (data.value === 0 && totalLeads > 0) return null;
              const pct = totalLeads > 0 ? Math.round((data.value / totalLeads) * 100) : 0;
              return (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: data.color, borderRadius: 'var(--radius-full)' }}></span>
                    {name}
                  </span>
                  <span style={{ fontWeight: 600 }}>{data.value.toLocaleString()} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
