import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { FileSpreadsheet, FileText, Download, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';

export const Informes = () => {
  const { products, contentCalendar, adsCampaigns, campaigns, collaborators, getCollaboratorCompliance, getProductMetrics, filters } = useContext(MarketingContext);
  const [reportType, setReportType] = useState('mensual');
  const [reportProduct, setReportProduct] = useState('all');
  const [generado, setGenerado] = useState(false);

  const handleGenerate = () => setGenerado(true);
  const handleExportSim = (format) => {
    alert(`✅ Simulación: El informe ${reportType} en formato ${format} ha sido generado y enviado a tu email.\n\n(En producción, este botón conectará con tu API de generación de documentos.)`);
  };

  // Filtered data for selected product/report
  const filterProd = reportProduct;
  const publishedPosts = contentCalendar.filter(p => p.status === 'Publicado' && (filterProd === 'all' || p.product === filterProd));
  const reelsDone = publishedPosts.filter(p => p.contentType === 'Reel').length;
  const videosDone = publishedPosts.filter(p => p.contentType === 'Video').length;
  const imagesDone = publishedPosts.filter(p => p.contentType === 'Imagen' || p.contentType === 'Carrusel').length;

  const filteredAds = adsCampaigns.filter(c => filterProd === 'all' || c.product === filterProd);
  const metrics = getProductMetrics(filterProd);

  const activeCampaigns = campaigns.filter(c => filterProd === 'all' || c.product === filterProd);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Report Generator Controls */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSpreadsheet size={18} style={{ color: 'var(--color-primary)' }} />
          Generador de Informes
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="label">Tipo de Informe</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['mensual', 'trimestral', 'anual'].map(type => (
                <button
                  key={type}
                  onClick={() => { setReportType(type); setGenerado(false); }}
                  className={`btn ${reportType === type ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Producto Turístico</label>
            <select value={reportProduct} onChange={e => { setReportProduct(e.target.value); setGenerado(false); }} className="input" style={{ width: '200px' }}>
              <option value="all">Todos los Productos</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} /> Generar Informe
          </button>
        </div>
      </div>

      {/* Generated Report Preview */}
      {generado && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--border-focus)' }}>
          {/* Report Header */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                INFORME {reportType.toUpperCase()} DE MARKETING
              </div>
              <h2 style={{ margin: 0 }}>
                {reportProduct === 'all' ? 'Todos los Productos Turísticos' : products.find(p => p.id === reportProduct)?.name}
              </h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                <Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Período: Junio 2026 · Generado: {new Date().toLocaleDateString('es-PE')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleExportSim('PDF')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Download size={14} /> PDF
              </button>
              <button onClick={() => handleExportSim('Excel')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Download size={14} /> Excel
              </button>
            </div>
          </div>

          {/* Summary metrics */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📊 Resumen Ejecutivo</h3>
            <div className="grid-cols-4">
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{publishedPosts.length}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Publicaciones<br/>Realizadas</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-purple)' }}>{filteredAds.length}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Campañas<br/>Publicitarias</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-teal)' }}>{metrics.leads.toLocaleString()}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Leads<br/>Generados</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>${metrics.revenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Ingresos<br/>Atribuidos</div>
              </div>
            </div>
          </div>

          {/* Organic Content section */}
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>🌱 Marketing Orgánico</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th><th>Canal</th><th>Tipo</th><th>Producto</th><th>Copy</th><th>Responsable</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedPosts.slice(0, 8).map(post => {
                    const prod = products.find(p => p.id === post.product);
                    return (
                      <tr key={post.id}>
                        <td style={{ fontSize: '0.775rem' }}>{post.publishDate}</td>
                        <td><span className="badge badge-info">{post.channel}</span></td>
                        <td style={{ fontSize: '0.8rem' }}>{post.contentType}</td>
                        <td style={{ fontSize: '0.8rem' }}>{prod?.name}</td>
                        <td style={{ fontSize: '0.775rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={post.copy}>{post.copy}</td>
                        <td style={{ fontSize: '0.8rem' }}>{post.owner}</td>
                        <td><span className="badge badge-success">Publicado</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advertising section */}
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>📢 Publicidad Digital - Resultados</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaña</th><th>Plataforma</th><th>Leads</th><th>Compras</th><th>Gasto</th><th>Ingresos</th><th>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.map(ad => {
                    const r = ad.results || {};
                    const campRoas = r.spent > 0 ? (r.revenue / r.spent).toFixed(2) : '0';
                    return (
                      <tr key={ad.id}>
                        <td style={{ fontWeight: 600, fontSize: '0.825rem' }}>{ad.name}</td>
                        <td><span className="badge badge-purple">{ad.platform}</span></td>
                        <td style={{ color: 'var(--color-teal)', fontWeight: 600 }}>{r.leads?.toLocaleString() || 0}</td>
                        <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{r.purchases?.toLocaleString() || 0}</td>
                        <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>${r.spent?.toLocaleString() || 0}</td>
                        <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>${r.revenue?.toLocaleString() || 0}</td>
                        <td><span className={`badge ${parseFloat(campRoas) >= 3 ? 'badge-success' : 'badge-warning'}`}>{campRoas}x</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Compliance */}
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>👥 Cumplimiento del Equipo</h3>
            <div className="grid-cols-3">
              {collaborators.map(col => {
                const comp = getCollaboratorCompliance(col.name);
                return (
                  <div key={col.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{col.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{col.role}</div>
                      </div>
                      <div style={{
                        fontSize: '1.35rem', fontWeight: 800,
                        color: comp.rate >= 80 ? 'var(--color-success)' : comp.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                      }}>
                        {comp.rate}%
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Posts: {comp.postsDone}/{comp.postsTarget}</span>
                      <span>·</span>
                      <span>Reels: {comp.reelsDone}/{comp.reelsTarget}</span>
                      <span>·</span>
                      <span>Videos: {comp.videosDone}/{comp.videosTarget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
