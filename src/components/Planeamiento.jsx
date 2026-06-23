import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Compass, 
  DollarSign, 
  Calendar,
  AlertCircle 
} from 'lucide-react';

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
    season: '',
    startDate: '',
    endDate: '',
    status: 'Borrador',
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
      season: 'Temporada Alta',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'Borrador',
      budget: 1000,
      owner: collaborators[0]?.name || ''
    });
    setIsCampModalOpen(true);
  };

  const openCampEdit = (camp) => {
    setEditingCamp(camp);
    setCampForm({ ...camp });
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
              Responsable General: <strong style={{ color: 'var(--text-primary)' }}>{currentPlan.owner}</strong>
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
                <th>Producto Turístico</th>
                <th>Temporada</th>
                <th>Cronograma</th>
                <th>Presupuesto</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(camp => {
                const prod = products.find(p => p.id === camp.product);
                return (
                  <tr key={camp.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{camp.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-info">{prod ? prod.name : camp.product}</span>
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
                    <td>{camp.owner}</td>
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
                      <option key={c.id} value={c.name}>{c.name}</option>
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
                    </select>
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
                        <option key={c.id} value={c.name}>{c.name}</option>
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
                    <option value="Borrador">Borrador</option>
                    <option value="Planificada">Planificada</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Ejecutándose">Ejecutándose</option>
                    <option value="Finalizada">Finalizada</option>
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
