import React, { useContext } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { TrendingUp, Users, Percent, DollarSign, Target } from 'lucide-react';

const KpiCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="card-title" style={{ margin: 0 }}>{label}</div>
      <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: `${color}18` }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
    {sub && <div className="card-desc">{sub}</div>}
  </div>
);

const RingGauge = ({ value, max, color, size = 80, label }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="6" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color }}>
          {Math.round(pct)}%
        </div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</div>
    </div>
  );
};

export const KPIs = () => {
  const { products, contentCalendar, adsCampaigns, collaborators, getProductMetrics, getCollaboratorCompliance, filters } = useContext(MarketingContext);

  const metrics = getProductMetrics(filters.productId);

  // Content KPIs
  const filteredPosts = contentCalendar.filter(p => filters.productId === 'all' || p.product === filters.productId);
  const publishedPosts = filteredPosts.filter(p => p.status === 'Publicado').length;
  const totalPosts = filteredPosts.length;
  const frequencyPerWeek = publishedPosts > 0 ? (publishedPosts / 4).toFixed(1) : '0';

  // Content breakdown by channel
  const channelBreakdown = {};
  filteredPosts.filter(p => p.status === 'Publicado').forEach(p => {
    channelBreakdown[p.channel] = (channelBreakdown[p.channel] || 0) + 1;
  });
  const topChannel = Object.entries(channelBreakdown).sort((a, b) => b[1] - a[1])[0];

  // Personnel KPIs
  const compliances = collaborators.map(col => getCollaboratorCompliance(col.name));
  const avgCompliance = compliances.length > 0 ? Math.round(compliances.reduce((a, c) => a + c.rate, 0) / compliances.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Section: Marketing Financial KPIs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
          <h3>KPIs Financieros de Marketing</h3>
        </div>
        <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <KpiCard icon={Users} label="CPL" value={`$${metrics.cpl}`} sub="Costo por Lead" color="var(--color-teal)" />
          <KpiCard icon={DollarSign} label="CPA" value={`$${metrics.cac}`} sub="Costo por Adquisición" color="var(--color-danger)" />
          <KpiCard icon={TrendingUp} label="ROAS" value={`${metrics.roas}x`} sub="Retorno de inversión publicitaria" color="var(--color-success)" />
          <KpiCard icon={Percent} label="ROI" value={`${metrics.roi}%`} sub="Retorno sobre la inversión" color="var(--color-warning)" />
          <KpiCard icon={Target} label="CTR" value={`${metrics.ctr}%`} sub="Click-through rate promedio" color="var(--color-purple)" />
        </div>
      </div>

      {/* Section: Content KPIs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--color-purple)', borderRadius: '2px' }} />
          <h3>KPIs de Contenido Orgánico</h3>
        </div>
        <div className="grid-cols-4">
          <KpiCard icon={TrendingUp} label="Alcance Orgánico" value={adsCampaigns.filter(c => filters.productId === 'all' || c.product === filters.productId).reduce((a, c) => a + (c.results?.reach || 0), 0).toLocaleString()} sub="Total de personas alcanzadas" color="var(--color-primary)" />
          <KpiCard icon={Target} label="Publicaciones Orgánicas" value={publishedPosts} sub={`de ${totalPosts} planificadas`} color="var(--color-teal)" />
          <KpiCard icon={Percent} label="Frecuencia" value={`${frequencyPerWeek}/sem`} sub="Publicaciones por semana" color="var(--color-warning)" />
          <KpiCard icon={Users} label="Canal Principal" value={topChannel?.[0] || '—'} sub={topChannel ? `${topChannel[1]} publicaciones` : 'Sin datos'} color="var(--color-purple)" />
        </div>

        {/* Breakdown by channel */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Distribución de Publicaciones Orgánicas por Canal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {Object.entries(channelBreakdown).sort((a, b) => b[1] - a[1]).map(([channel, count]) => (
              <div key={channel} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 50px', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{channel}</span>
                <div style={{ backgroundColor: 'var(--bg-secondary)', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / publishedPosts) * 100}%`,
                    height: '100%',
                    backgroundColor: channel === 'Instagram' ? '#ec4899' : channel === 'Facebook' ? '#3b82f6' : channel === 'TikTok' ? '#00f2fe' : channel === 'YouTube' ? '#ef4444' : channel === 'Blog' ? '#14b8a6' : '#10b981',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
            {Object.keys(channelBreakdown).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No hay publicaciones publicadas en este período.</div>
            )}
          </div>
        </div>
      </div>

      {/* Section: Personnel KPIs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--color-success)', borderRadius: '2px' }} />
          <h3>KPIs de Personal de Marketing</h3>
        </div>
        <div className="grid-cols-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
          {/* Average compliance ring */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <RingGauge value={avgCompliance} max={100} color={avgCompliance >= 80 ? 'var(--color-success)' : avgCompliance >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'} size={120} label="Cumplimiento Promedio del Equipo" />
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center' }}>Obligaciones contractuales del mes</div>
          </div>

          {/* Individual compliance */}
          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>Productividad Individual</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {collaborators.map(col => {
                const comp = getCollaboratorCompliance(col.name);
                return (
                  <div key={col.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 60px', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>{col.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{col.role}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${comp.rate}%`,
                        height: '100%',
                        backgroundColor: comp.rate >= 80 ? 'var(--color-success)' : comp.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      textAlign: 'right',
                      color: comp.rate >= 80 ? 'var(--color-success)' : comp.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                    }}>{comp.rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Per-Product breakdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--color-warning)', borderRadius: '2px' }} />
          <h3>ROAS por Producto Turístico</h3>
        </div>
        <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {products.map(prod => {
            const m = getProductMetrics(prod.id);
            return (
              <div key={prod.id} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <RingGauge value={Math.min(m.roas, 10)} max={10} color={m.roas >= 4 ? 'var(--color-success)' : m.roas >= 2 ? 'var(--color-warning)' : 'var(--color-danger)'} size={70} label="" />
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{prod.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROAS: {m.roas}x</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '0.15rem' }}>${m.revenue.toLocaleString()} ingresos</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
