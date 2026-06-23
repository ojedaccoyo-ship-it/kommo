import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import {
  Plus, Edit, Trash2, TrendingUp, Eye, MousePointer,
  DollarSign, MessageCircle, Users, ShoppingCart, Megaphone, Code
} from 'lucide-react';

const PLATFORMS = ['Meta Ads', 'Google Ads', 'TikTok Ads'];
const OBJECTIVES = ['Leads', 'Conversaciones', 'Ventas', 'Tráfico', 'Branding'];
const AUDIENCE_TYPES = ['Intereses', 'Lookalike', 'Remarketing', 'Amplia'];
const CREATIVE_FORMATS = ['Imagen', 'Video', 'Carrusel', 'Reel'];

const platformColor = (p) => {
  if (p === 'Meta Ads') return '#1877f2';
  if (p === 'Google Ads') return '#ea4335';
  if (p === 'TikTok Ads') return '#00f2fe';
  return 'var(--color-primary)';
};

const MetricCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="card-title" style={{ margin: 0 }}>{label}</span>
      <Icon size={16} style={{ color }} />
    </div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
    {sub && <div className="card-desc">{sub}</div>}
  </div>
);

export const PublicidadDigital = () => {
  const { products, collaborators, adsCampaigns, addAdCampaign, updateAdCampaign, deleteAdCampaign, filters } = useContext(MarketingContext);
  const [activeTab, setActiveTab] = useState('campanas');
  const [selectedCampId, setSelectedCampId] = useState(adsCampaigns[0]?.id || null);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [isSegModalOpen, setIsSegModalOpen] = useState(false);
  const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [editingCreative, setEditingCreative] = useState(null);
  const [jsonError, setJsonError] = useState('');

  // Form states
  const [campForm, setCampForm] = useState({ name: '', product: '', objective: 'Leads', platform: 'Meta Ads', budget: 1000, owner: '' });
  const [segForm, setSegForm] = useState({ name: '', country: '', ageRange: '', gender: 'Todos', language: '', audienceType: 'Intereses', jsonConfig: '{}' });
  const [creativeForm, setCreativeForm] = useState({ id: '', name: '', format: 'Imagen', language: 'Español', angle: '', hypothesis: '', url: '', metadata: '{}' });
  const [resultsForm, setResultsForm] = useState({ impressions: 0, reach: 0, clicks: 0, conversations: 0, leads: 0, purchases: 0, spent: 0, revenue: 0 });

  const filteredCamps = adsCampaigns.filter(c => {
    const matchProduct = filters.productId === 'all' || c.product === filters.productId;
    const matchOwner = filters.owner === 'all' || c.owner === filters.owner;
    return matchProduct && matchOwner;
  });

  const selectedCamp = adsCampaigns.find(c => c.id === selectedCampId) || filteredCamps[0] || null;

  // Validate JSON helper
  const validateJson = (str) => {
    try { JSON.parse(str); setJsonError(''); return true; }
    catch (e) { setJsonError('⚠ JSON inválido: ' + e.message); return false; }
  };

  // Campaign CRUD
  const openAddCamp = () => {
    setEditingCamp(null);
    setCampForm({ name: '', product: products[0]?.id || '', objective: 'Leads', platform: 'Meta Ads', budget: 1000, owner: collaborators[0]?.name || '' });
    setIsCampModalOpen(true);
  };
  const openEditCamp = (camp) => {
    setEditingCamp(camp);
    setCampForm({ name: camp.name, product: camp.product, objective: camp.objective, platform: camp.platform, budget: camp.budget, owner: camp.owner });
    setIsCampModalOpen(true);
  };
  const handleCampSubmit = (e) => {
    e.preventDefault();
    if (editingCamp) {
      updateAdCampaign({ ...editingCamp, ...campForm });
    } else {
      addAdCampaign(campForm);
    }
    setIsCampModalOpen(false);
  };

  // Segmentation Update
  const openSegEdit = () => {
    if (!selectedCamp) return;
    setSegForm({ ...selectedCamp.segmentation });
    setIsSegModalOpen(true);
  };
  const handleSegSubmit = (e) => {
    e.preventDefault();
    if (!validateJson(segForm.jsonConfig)) return;
    updateAdCampaign({ ...selectedCamp, segmentation: segForm });
    setIsSegModalOpen(false);
  };

  // Creative CRUD
  const openAddCreative = () => {
    setEditingCreative(null);
    setCreativeForm({ id: '', name: '', format: 'Imagen', language: 'Español', angle: '', hypothesis: '', url: '', metadata: '{}' });
    setIsCreativeModalOpen(true);
  };
  const openEditCreative = (creative) => {
    setEditingCreative(creative);
    setCreativeForm({ ...creative });
    setIsCreativeModalOpen(true);
  };
  const handleCreativeSubmit = (e) => {
    e.preventDefault();
    if (!validateJson(creativeForm.metadata)) return;
    const updatedCreatives = editingCreative
      ? selectedCamp.creatives.map(c => c.id === editingCreative.id ? { ...creativeForm, id: c.id } : c)
      : [...(selectedCamp.creatives || []), { ...creativeForm, id: `cre-${Date.now()}` }];
    updateAdCampaign({ ...selectedCamp, creatives: updatedCreatives });
    setIsCreativeModalOpen(false);
  };
  const deleteCreative = (creativeId) => {
    const updatedCreatives = selectedCamp.creatives.filter(c => c.id !== creativeId);
    updateAdCampaign({ ...selectedCamp, creatives: updatedCreatives });
  };

  // Results Update
  const openResultsEdit = () => {
    if (!selectedCamp) return;
    setResultsForm({ ...selectedCamp.results });
    setIsResultsModalOpen(true);
  };
  const handleResultsSubmit = (e) => {
    e.preventDefault();
    updateAdCampaign({ ...selectedCamp, results: resultsForm });
    setIsResultsModalOpen(false);
  };

  // Computed metrics for selected campaign
  const res = selectedCamp?.results || {};
  const roas = res.spent > 0 ? (res.revenue / res.spent).toFixed(2) : '0';
  const ctr = res.impressions > 0 ? ((res.clicks / res.impressions) * 100).toFixed(2) : '0';
  const cpl = res.leads > 0 ? (res.spent / res.leads).toFixed(2) : '0';
  const cpc = res.clicks > 0 ? (res.spent / res.clicks).toFixed(2) : '0';
  const cpm = res.impressions > 0 ? ((res.spent / res.impressions) * 1000).toFixed(2) : '0';

  return (
    <div style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>

      {/* Left Panel: Campaign List */}
      <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Campañas Activas</h4>
          <button onClick={openAddCamp} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={12} /> Nueva
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
          {filteredCamps.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
              Sin campañas. Crea una nueva.
            </div>
          )}
          {filteredCamps.map(camp => {
            const prod = products.find(p => p.id === camp.product);
            const isSelected = camp.id === (selectedCamp?.id);
            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampId(camp.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSelected ? platformColor(camp.platform) : 'var(--border-light)'}`,
                  backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  borderLeft: `4px solid ${platformColor(camp.platform)}`
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.825rem', marginBottom: '0.25rem' }}>{camp.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{prod?.name || camp.product}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: platformColor(camp.platform) }}>{camp.platform}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Presupuesto: <strong style={{ color: 'var(--color-success)' }}>${camp.budget?.toLocaleString()}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Campaign Detail Tabs */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedCamp ? (
          <>
            {/* Campaign Header */}
            <div className="card" style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3>{selectedCamp.name}</h3>
                  <span className="badge" style={{ backgroundColor: `${platformColor(selectedCamp.platform)}22`, color: platformColor(selectedCamp.platform) }}>
                    {selectedCamp.platform}
                  </span>
                  <span className="badge badge-info">{selectedCamp.objective}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Responsable: {selectedCamp.owner} · Presupuesto: ${selectedCamp.budget?.toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEditCamp(selectedCamp)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Edit size={12} /> Editar
                </button>
                <button onClick={() => deleteAdCampaign(selectedCamp.id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tab-bar">
              {['campanas', 'segmentacion', 'creativos', 'resultados'].map(tab => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {{ campanas: '📊 Resumen', segmentacion: '🎯 Segmentación', creativos: '🎨 Creativos', resultados: '📈 Resultados' }[tab]}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>

              {/* TAB: RESUMEN / OVERVIEW */}
              {activeTab === 'campanas' && (
                <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <MetricCard icon={Eye} label="Impresiones" value={res.impressions?.toLocaleString() || '0'} color="var(--color-primary)" />
                  <MetricCard icon={Users} label="Alcance" value={res.reach?.toLocaleString() || '0'} color="var(--color-teal)" />
                  <MetricCard icon={MousePointer} label="Clicks" value={res.clicks?.toLocaleString() || '0'} color="var(--color-purple)" />
                  <MetricCard icon={TrendingUp} label="CTR" value={`${ctr}%`} color="var(--color-warning)" sub="Click-through rate" />
                  <MetricCard icon={DollarSign} label="CPC" value={`$${cpc}`} color="var(--color-danger)" sub="Costo por click" />
                  <MetricCard icon={DollarSign} label="CPM" value={`$${cpm}`} color="var(--color-danger)" sub="Costo por 1k impresiones" />
                  <MetricCard icon={MessageCircle} label="Conversaciones" value={res.conversations?.toLocaleString() || '0'} color="var(--color-teal)" />
                  <MetricCard icon={Users} label="Leads" value={res.leads?.toLocaleString() || '0'} color="var(--color-primary)" sub={`CPL: $${cpl}`} />
                  <MetricCard icon={ShoppingCart} label="Compras" value={res.purchases?.toLocaleString() || '0'} color="var(--color-success)" />
                  <MetricCard icon={DollarSign} label="Gasto Total" value={`$${res.spent?.toLocaleString() || '0'}`} color="var(--color-danger)" />
                  <MetricCard icon={DollarSign} label="Ingresos Atribuidos" value={`$${res.revenue?.toLocaleString() || '0'}`} color="var(--color-success)" />
                  <MetricCard icon={TrendingUp} label="ROAS" value={`${roas}x`} color="var(--color-success)" sub="Retorno de inversión" />
                </div>
              )}

              {/* TAB: SEGMENTACION */}
              {activeTab === 'segmentacion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={openSegEdit} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Edit size={12} /> Editar Segmentación
                    </button>
                  </div>
                  <div className="grid-cols-2">
                    {[
                      ['Nombre de Audiencia', selectedCamp.segmentation?.name],
                      ['País / Región', selectedCamp.segmentation?.country],
                      ['Rango de Edad', selectedCamp.segmentation?.ageRange],
                      ['Género', selectedCamp.segmentation?.gender],
                      ['Idioma', selectedCamp.segmentation?.language],
                      ['Tipo de Audiencia', selectedCamp.segmentation?.audienceType],
                    ].map(([label, val]) => (
                      <div key={label} className="card" style={{ padding: '0.85rem' }}>
                        <div className="card-title" style={{ marginBottom: '0.25rem' }}>{label}</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{val || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Code size={16} style={{ color: 'var(--color-primary)' }} />
                      <span className="card-title" style={{ margin: 0 }}>Configuración JSON Detallada</span>
                    </div>
                    <pre style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      overflow: 'auto',
                      fontSize: '0.775rem',
                      color: '#a5f3fc',
                      lineHeight: '1.6',
                      border: '1px solid var(--border-light)',
                      maxHeight: '300px'
                    }}>
                      {selectedCamp.segmentation?.jsonConfig || '{}'}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB: CREATIVOS */}
              {activeTab === 'creativos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={openAddCreative} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Plus size={12} /> Agregar Creativo
                    </button>
                  </div>
                  {(selectedCamp.creatives || []).length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No hay creativos asociados a esta campaña todavía.
                    </div>
                  )}
                  <div className="grid-cols-2">
                    {(selectedCamp.creatives || []).map(creative => (
                      <div key={creative.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {creative.url && (
                          <img src={creative.url} alt={creative.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{creative.name}</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            <span className="badge badge-purple">{creative.format}</span>
                            <span className="badge badge-info">{creative.language}</span>
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong>Ángulo:</strong> {creative.angle}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            💡 {creative.hypothesis}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                          <button onClick={() => openEditCreative(creative)} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            <Edit size={12} /> Editar
                          </button>
                          <button onClick={() => deleteCreative(creative.id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: RESULTADOS */}
              {activeTab === 'resultados' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>Métricas importadas vía API de plataforma. Actualiza los valores manualmente para simular la sincronización.</p>
                    <button onClick={openResultsEdit} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <TrendingUp size={12} /> Actualizar Resultados
                    </button>
                  </div>
                  <div className="grid-cols-4">
                    <MetricCard icon={Eye} label="Impresiones" value={res.impressions?.toLocaleString() || '0'} color="var(--color-primary)" />
                    <MetricCard icon={Users} label="Alcance" value={res.reach?.toLocaleString() || '0'} color="var(--color-teal)" />
                    <MetricCard icon={MousePointer} label="Clicks" value={res.clicks?.toLocaleString() || '0'} color="var(--color-purple)" />
                    <MetricCard icon={TrendingUp} label="CTR" value={`${ctr}%`} color="var(--color-warning)" />
                    <MetricCard icon={DollarSign} label="CPC" value={`$${cpc}`} color="var(--color-danger)" />
                    <MetricCard icon={DollarSign} label="CPM" value={`$${cpm}`} color="var(--color-danger)" />
                    <MetricCard icon={MessageCircle} label="Conversaciones" value={res.conversations?.toLocaleString() || '0'} color="var(--color-teal)" />
                    <MetricCard icon={Users} label="Leads" value={`${res.leads?.toLocaleString() || '0'}`} color="var(--color-primary)" sub={`CPL: $${cpl}`} />
                    <MetricCard icon={ShoppingCart} label="Compras" value={res.purchases?.toLocaleString() || '0'} color="var(--color-success)" />
                    <MetricCard icon={DollarSign} label="Gasto" value={`$${res.spent?.toLocaleString() || '0'}`} color="var(--color-danger)" />
                    <MetricCard icon={DollarSign} label="Ingresos" value={`$${res.revenue?.toLocaleString() || '0'}`} color="var(--color-success)" />
                    <MetricCard icon={TrendingUp} label="ROAS" value={`${roas}x`} color="var(--color-success)" />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '1rem', color: 'var(--text-muted)' }}>
            <Megaphone size={48} style={{ opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Selecciona una campaña de la lista o crea una nueva para comenzar.</p>
            <button onClick={openAddCamp} className="btn btn-primary">
              <Plus size={16} /> Crear Primera Campaña
            </button>
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* Campaign Modal */}
      {isCampModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCamp ? 'Editar Campaña' : 'Nueva Campaña Publicitaria'}</h3>
              <button onClick={() => setIsCampModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleCampSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre de Campaña</label>
                  <input type="text" value={campForm.name} onChange={e => setCampForm({ ...campForm, name: e.target.value })} className="input" required placeholder="Ej. Meta Ads - Machu Picchu Temporada Alta" />
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Producto</label>
                    <select value={campForm.product} onChange={e => setCampForm({ ...campForm, product: e.target.value })} className="input" required>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Plataforma</label>
                    <select value={campForm.platform} onChange={e => setCampForm({ ...campForm, platform: e.target.value })} className="input" required>
                      {PLATFORMS.map(pl => <option key={pl} value={pl}>{pl}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Objetivo de Negocio</label>
                    <select value={campForm.objective} onChange={e => setCampForm({ ...campForm, objective: e.target.value })} className="input" required>
                      {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Presupuesto ($)</label>
                    <input type="number" value={campForm.budget} onChange={e => setCampForm({ ...campForm, budget: Number(e.target.value) })} className="input" required />
                  </div>
                </div>
                <div>
                  <label className="label">Responsable</label>
                  <select value={campForm.owner} onChange={e => setCampForm({ ...campForm, owner: e.target.value })} className="input" required>
                    {collaborators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsCampModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingCamp ? 'Actualizar' : 'Crear Campaña'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Segmentation Modal */}
      {isSegModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Editar Segmentación de Audiencia</h3>
              <button onClick={() => setIsSegModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSegSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Nombre de Audiencia</label>
                    <input type="text" value={segForm.name} onChange={e => setSegForm({ ...segForm, name: e.target.value })} className="input" required />
                  </div>
                  <div>
                    <label className="label">Tipo de Audiencia</label>
                    <select value={segForm.audienceType} onChange={e => setSegForm({ ...segForm, audienceType: e.target.value })} className="input">
                      {AUDIENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">País / Región</label>
                    <input type="text" value={segForm.country} onChange={e => setSegForm({ ...segForm, country: e.target.value })} className="input" required placeholder="Ej. Estados Unidos, España" />
                  </div>
                  <div>
                    <label className="label">Rango de Edad</label>
                    <input type="text" value={segForm.ageRange} onChange={e => setSegForm({ ...segForm, ageRange: e.target.value })} className="input" placeholder="Ej. 25-50" />
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Género</label>
                    <select value={segForm.gender} onChange={e => setSegForm({ ...segForm, gender: e.target.value })} className="input">
                      <option>Todos</option><option>Hombres</option><option>Mujeres</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Idioma</label>
                    <input type="text" value={segForm.language} onChange={e => setSegForm({ ...segForm, language: e.target.value })} className="input" placeholder="Ej. Inglés, Español" />
                  </div>
                </div>
                <div>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Code size={12} /> Configuración JSON Avanzada
                  </label>
                  <textarea
                    value={segForm.jsonConfig}
                    onChange={e => { setSegForm({ ...segForm, jsonConfig: e.target.value }); validateJson(e.target.value); }}
                    className="input"
                    rows="8"
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                  {jsonError && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{jsonError}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsSegModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Segmentación</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creative Modal */}
      {isCreativeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{editingCreative ? 'Editar Creativo' : 'Nuevo Creativo'}</h3>
              <button onClick={() => setIsCreativeModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleCreativeSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre del Creativo</label>
                  <input type="text" value={creativeForm.name} onChange={e => setCreativeForm({ ...creativeForm, name: e.target.value })} className="input" required placeholder="Ej. Video 15s - Amanecer Machu Picchu" />
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Formato</label>
                    <select value={creativeForm.format} onChange={e => setCreativeForm({ ...creativeForm, format: e.target.value })} className="input">
                      {CREATIVE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Idioma</label>
                    <select value={creativeForm.language} onChange={e => setCreativeForm({ ...creativeForm, language: e.target.value })} className="input">
                      <option>Español</option><option>Inglés</option><option>Portugués</option><option>Alemán</option><option>Francés</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Ángulo de Venta</label>
                  <input type="text" value={creativeForm.angle} onChange={e => setCreativeForm({ ...creativeForm, angle: e.target.value })} className="input" placeholder="Ej. Inspiracional / Conexión Emocional" required />
                </div>
                <div>
                  <label className="label">Hipótesis de Conversión</label>
                  <textarea value={creativeForm.hypothesis} onChange={e => setCreativeForm({ ...creativeForm, hypothesis: e.target.value })} className="input" rows="2" style={{ resize: 'none' }} placeholder="¿Por qué crees que este creativo convierte?" />
                </div>
                <div>
                  <label className="label">URL del Creativo (Imagen / Preview)</label>
                  <input type="url" value={creativeForm.url} onChange={e => setCreativeForm({ ...creativeForm, url: e.target.value })} className="input" placeholder="https://..." />
                </div>
                <div>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Code size={12} /> Metadatos JSON
                  </label>
                  <textarea
                    value={creativeForm.metadata}
                    onChange={e => { setCreativeForm({ ...creativeForm, metadata: e.target.value }); validateJson(e.target.value); }}
                    className="input"
                    rows="5"
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                  {jsonError && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{jsonError}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreativeModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingCreative ? 'Actualizar' : 'Agregar Creativo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {isResultsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Actualizar Resultados de Campaña</h3>
              <button onClick={() => setIsResultsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleResultsSubmit}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['Impresiones', 'impressions'], ['Alcance', 'reach'], ['Clicks', 'clicks'],
                  ['Conversaciones', 'conversations'], ['Leads', 'leads'], ['Compras', 'purchases'],
                  ['Gasto ($)', 'spent'], ['Ingresos ($)', 'revenue']
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input type="number" step="0.01" value={resultsForm[key]} onChange={e => setResultsForm({ ...resultsForm, [key]: Number(e.target.value) })} className="input" />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsResultsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Resultados</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
