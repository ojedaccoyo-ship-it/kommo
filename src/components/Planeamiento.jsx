import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import {
  Plus,
  Edit,
  Trash2,
  Compass,
  DollarSign,
  Calendar,
  AlertCircle,
  Link2
} from 'lucide-react';
import { CAMPAIGN_TYPES, AD_OBJECTIVES as OBJECTIVES, PLANNING_PLATFORMS as PLATFORM_OPTIONS, CAMPAIGN_STATUS } from '../constants';

const OTHER_PRODUCT = 'otro';

export const Planeamiento = () => {
  const {
    products,
    collaborators,
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    annualPlans,
    updateAnnualPlan,
    contentCalendar,
    adsCampaigns,
    productions,
    getCollaboratorName,
    filters
  } = useContext(MarketingContext);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);

  // Form states
  const [planForm, setPlanForm] = useState({ id: '', year: 2026, owner: '', objectives: '', budget: 0 });
  const [campForm, setCampForm] = useState({
    id: '',
    name: '',
    product: '',
    productLabel: '',
    season: '',
    startDate: '',
    endDate: '',
    status: 'Borrador',
    type: 'Pagada',
    objective: 'Leads',
    platforms: [],
    budget: 0,
    owner: ''
  });

  const currentPlan = annualPlans[0] || { year: 2026, owner: 'No asignado', objectives: 'Sin definir', budget: 0 };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchProduct = filters.productId === 'all' || c.product === filters.productId;
    const matchOwner = filters.owner === 'all' || c.owner === filters.owner;
    return matchProduct && matchOwner;
  });

  // Total allocated budget for campaigns
  const totalAllocatedBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

  const openPlanEdit = () => {
    setPlanForm({ ...currentPlan });
    setIsPlanModalOpen(true);
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    updateAnnualPlan(planForm);
    setIsPlanModalOpen(false);
  };

  const openCampAdd = () => {
    setEditingCamp(null);
    setCampForm({
      id: '',
      name: '',
      product: products[0]?.id || '',
      productLabel: '',
      season: 'Temporada Alta',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'Borrador',
      type: 'Pagada',
      objective: 'Leads',
      platforms: [],
      budget: 1000,
      owner: collaborators[0]?.id || ''
    });
    setIsCampModalOpen(true);
  };

  const openCampEdit = (camp) => {
    setEditingCamp(camp);
    // Merge with defaults so campaigns created before these fields existed still open cleanly
    setCampForm({ productLabel: '', type: 'Pagada', objective: 'Leads', platforms: [], ...camp });
    setIsCampModalOpen(true);
  };

  const handleCampSubmit = (e) => {
    e.preventDefault();
    if (editingCamp) {
      updateCampaign(campForm);
    } else {
      addCampaign(campForm);
    }
    setIsCampModalOpen(false);
  };

  const togglePlatform = (platform) => {
    setCampForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const productDisplayName = (camp) => {
    if (camp.product === OTHER_PRODUCT) return camp.productLabel || 'Otro';
    return products.find(p => p.id === camp.product)?.name || camp.product;
  };

  // Counts what's actually linked back to this plan campaign, so "sincronización" is a real number, not just a claim
  const linkedCounts = (campaignId) => ({
    content: contentCalendar.filter(post => post.planCampaignId === campaignId).length,
    ads: adsCampaigns.filter(ad => ad.planCampaignId === campaignId).length,
    productions: productions.filter(p => p.planCampaignId === campaignId).length
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Borrador': return 'badge-danger';
      case 'Planificada': return 'badge-info';
      case 'Aprobada': return 'badge-teal';
      case 'Ejecutándose': return 'badge-success';
      case 'Finalizada': return 'badge-purple';
      default: return 'badge-secondary';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Annual Plan details */}
      <div className="grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} style={{ color: 'var(--color-primary)' }} />
                Plan Comercial Anual {currentPlan.year}
              </h3>
              <button onClick={openPlanEdit} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Edit size={14} /> Editar
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{currentPlan.objectives}</p>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Responsable General: <strong style={{ color: 'var(--text-primary)' }}>{getCollaboratorName(currentPlan.owner)}</strong>
            </div>
          </div>
        </div>

        {/* Budget overview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Presupuesto Anual</div>
            <div className="card-value" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-success)' }}>
              <DollarSign size={22} /> {currentPlan.budget.toLocaleString()}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.775rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Asignado a Campañas:</span>
              <span style={{ fontWeight: 600 }}>${totalAllocatedBudget.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Disponible:</span>
              <span style={{ fontWeight: 600, color: currentPlan.budget - totalAllocatedBudget >= 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                ${(currentPlan.budget - totalAllocatedBudget).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <h3>Campañas de Marketing</h3>
        <button onClick={openCampAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Plus size={16} /> Planificar Campaña
        </button>
      </div>

      {/* Campaigns list */}
      <div className="table-container">
        {filteredCampaigns.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Campaña</th>
                <th>Tipo</th>
                <th>Producto Turístico</th>
                <th>Plataformas</th>
                <th>Temporada</th>
                <th>Cronograma</th>
                <th>Presupuesto</th>
                <th>Responsable</th>
                <th>Vinculado</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(camp => {
                const linked = linkedCounts(camp.id);
                const linkedTotal = linked.content + linked.ads + linked.productions;
                return (
                  <tr key={camp.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{camp.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-purple">{camp.type || 'Pagada'}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{productDisplayName(camp)}</span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '160px' }}>
                      {(camp.platforms || []).length > 0 ? camp.platforms.join(', ') : '—'}
                    </td>
                    <td>{camp.season}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {camp.startDate} al {camp.endDate}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      ${camp.budget.toLocaleString()}
                    </td>
                    <td>{getCollaboratorName(camp.owner)}</td>
                    <td>
                      {linkedTotal > 0 ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }} title={`${linked.content} contenido · ${linked.ads} anuncios · ${linked.productions} producciones`}>
                          <Link2 size={10} /> {linked.content} · {linked.ads} · {linked.productions}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sin vincular</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(camp.status)}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          onClick={() => openCampEdit(camp)} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem' }}
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => deleteCampaign(camp.id)} 
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={28} />
            <span>No se encontraron campañas planificadas con los filtros actuales.</span>
          </div>
        )}
      </div>

      {/* PLAN ANUAL MODAL */}
      {isPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Plan Anual</h3>
              <button onClick={() => setIsPlanModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handlePlanSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Año</label>
                    <input 
                      type="number" 
                      value={planForm.year} 
                      onChange={(e) => setPlanForm({...planForm, year: parseInt(e.target.value)})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Presupuesto Anual ($)</label>
                    <input 
                      type="number" 
                      value={planForm.budget} 
                      onChange={(e) => setPlanForm({...planForm, budget: parseInt(e.target.value)})} 
                      className="input" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Responsable Principal</label>
                  <select
                    value={planForm.owner}
                    onChange={(e) => setPlanForm({...planForm, owner: e.target.value})}
                    className="input"
                    required
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Objetivos Comerciales Estratégicos</label>
                  <textarea 
                    value={planForm.objectives} 
                    onChange={(e) => setPlanForm({...planForm, objectives: e.target.value})} 
                    className="input" 
                    rows="4" 
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsPlanModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAMPAIGN MODAL (ADD/EDIT) */}
      {isCampModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCamp ? 'Editar Campaña' : 'Planificar Nueva Campaña'}</h3>
              <button onClick={() => setIsCampModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleCampSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre de Campaña</label>
                  <input 
                    type="text" 
                    value={campForm.name} 
                    onChange={(e) => setCampForm({...campForm, name: e.target.value})} 
                    className="input" 
                    placeholder="Ej. Black Friday Cusco"
                    required
                  />
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Tipo de Campaña</label>
                    <select
                      value={campForm.type}
                      onChange={(e) => setCampForm({...campForm, type: e.target.value})}
                      className="input"
                      required
                    >
                      {CAMPAIGN_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Objetivo de Campaña</label>
                    <select
                      value={campForm.objective}
                      onChange={(e) => setCampForm({...campForm, objective: e.target.value})}
                      className="input"
                      required
                    >
                      {OBJECTIVES.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Producto Relacionado</label>
                    <select
                      value={campForm.product}
                      onChange={(e) => setCampForm({...campForm, product: e.target.value})}
                      className="input"
                      required
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                      <option value={OTHER_PRODUCT}>Otro (especificar)</option>
                    </select>
                    {campForm.product === OTHER_PRODUCT && (
                      <input
                        type="text"
                        value={campForm.productLabel}
                        onChange={(e) => setCampForm({...campForm, productLabel: e.target.value})}
                        className="input"
                        placeholder="Ej. Toda la marca / Nuevo producto"
                        style={{ marginTop: '0.5rem' }}
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="label">Temporada</label>
                    <input
                      type="text"
                      value={campForm.season}
                      onChange={(e) => setCampForm({...campForm, season: e.target.value})}
                      className="input"
                      placeholder="Ej. Temporada Alta"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Plataformas</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {PLATFORM_OPTIONS.map(platform => {
                      const checked = campForm.platforms.includes(platform);
                      return (
                        <label
                          key={platform}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.7rem',
                            borderRadius: 'var(--radius-full)',
                            border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--border-light)'}`,
                            backgroundColor: checked ? 'var(--color-primary-soft)' : 'var(--bg-input)',
                            color: checked ? 'var(--color-primary)' : 'var(--text-secondary)',
                            fontSize: '0.775rem',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePlatform(platform)}
                            style={{ margin: 0 }}
                          />
                          {platform}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Fecha Inicio</label>
                    <input 
                      type="date" 
                      value={campForm.startDate} 
                      onChange={(e) => setCampForm({...campForm, startDate: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Fecha Fin</label>
                    <input 
                      type="date" 
                      value={campForm.endDate} 
                      onChange={(e) => setCampForm({...campForm, endDate: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Presupuesto Campaña ($)</label>
                    <input 
                      type="number" 
                      value={campForm.budget} 
                      onChange={(e) => setCampForm({...campForm, budget: parseInt(e.target.value)})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Responsable</label>
                    <select
                      value={campForm.owner}
                      onChange={(e) => setCampForm({...campForm, owner: e.target.value})}
                      className="input"
                      required
                    >
                      {collaborators.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Estado de la Campaña</label>
                  <select
                    value={campForm.status}
                    onChange={(e) => setCampForm({...campForm, status: e.target.value})}
                    className="input"
                    required
                  >
                    {CAMPAIGN_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsCampModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingCamp ? 'Actualizar' : 'Agregar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
