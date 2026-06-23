import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { Plus, Edit, Trash2, Users2, CheckCircle, AlertCircle, Code } from 'lucide-react';

const ROLES = ['Publicista', 'Community Manager', 'Diseñador', 'Editor', 'Fotógrafo'];

const roleColor = (role) => {
  switch(role) {
    case 'Publicista': return 'var(--color-primary)';
    case 'Community Manager': return 'var(--color-success)';
    case 'Diseñador': return 'var(--color-purple)';
    case 'Editor': return 'var(--color-warning)';
    case 'Fotógrafo': return 'var(--color-teal)';
    default: return 'var(--text-muted)';
  }
};

const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-secondary)', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, color, minWidth: '40px', textAlign: 'right' }}>{value}/{max}</span>
    </div>
  );
};

export const PersonalMarketing = () => {
  const { collaborators, addCollaborator, updateCollaborator, deleteCollaborator, getCollaboratorCompliance, filters } = useContext(MarketingContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState(null);
  const [form, setForm] = useState({ name: '', role: 'Community Manager', dateJoined: '', status: 'Activo', obligations: { posts: 11, reels: 11, videos: 4, reports: 1 }, metadata: '{}' });
  const [selectedCol, setSelectedCol] = useState(collaborators[0]?.id || null);
  const [jsonError, setJsonError] = useState('');

  const filteredCols = collaborators.filter(c => filters.owner === 'all' || c.name === filters.owner);

  const validateJson = (str) => {
    try { JSON.parse(str || '{}'); setJsonError(''); return true; }
    catch (e) { setJsonError('⚠ JSON inválido: ' + e.message); return false; }
  };

  const openAdd = () => {
    setEditingCol(null);
    setForm({ name: '', role: 'Community Manager', dateJoined: new Date().toISOString().split('T')[0], status: 'Activo', obligations: { posts: 11, reels: 11, videos: 4, reports: 1 }, metadata: '{}' });
    setJsonError('');
    setIsModalOpen(true);
  };

  const openEdit = (col) => {
    setEditingCol(col);
    setForm({ ...col, obligations: { ...col.obligations }, metadata: col.metadata || '{}' });
    setJsonError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateJson(form.metadata)) return;
    if (editingCol) updateCollaborator({ ...editingCol, ...form });
    else addCollaborator(form);
    setIsModalOpen(false);
  };

  const selectedColObj = collaborators.find(c => c.id === selectedCol) || filteredCols[0];
  const compliance = selectedColObj ? getCollaboratorCompliance(selectedColObj.name) : null;

  return (
    <div style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>

      {/* Left: Collaborator List */}
      <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Equipo de Marketing</h4>
          <button onClick={openAdd} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={12} /> Añadir
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {filteredCols.map(col => {
            const comp = getCollaboratorCompliance(col.name);
            const isSelected = col.id === selectedColObj?.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCol(col.id)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isSelected ? roleColor(col.role) : 'var(--border-light)'}`,
                  backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  borderLeft: `4px solid ${roleColor(col.role)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{col.name}</div>
                  <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: col.status === 'Activo' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)', color: col.status === 'Activo' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {col.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.775rem', color: roleColor(col.role), fontWeight: 600, marginBottom: '0.5rem' }}>{col.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-secondary)', height: '4px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${comp.rate}%`, height: '100%', backgroundColor: comp.rate >= 80 ? 'var(--color-success)' : comp.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: comp.rate >= 80 ? 'var(--color-success)' : comp.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{comp.rate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {selectedColObj && compliance ? (
          <>
            {/* Header Card */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${roleColor(selectedColObj.role)}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${roleColor(selectedColObj.role)}` }}>
                    <Users2 size={22} style={{ color: roleColor(selectedColObj.role) }} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0 }}>{selectedColObj.name}</h2>
                    <div style={{ color: roleColor(selectedColObj.role), fontWeight: 600, fontSize: '0.875rem' }}>{selectedColObj.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Ingreso: {selectedColObj.dateJoined} · Estado: <span style={{ color: selectedColObj.status === 'Activo' ? 'var(--color-success)' : 'var(--color-danger)' }}>{selectedColObj.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(selectedColObj)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Edit size={12} /> Editar
                </button>
                <button onClick={() => deleteCollaborator(selectedColObj.id)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Overall Compliance Summary */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Cumplimiento de Obligaciones (Mes Actual)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {compliance.rate >= 80 ? <CheckCircle size={20} style={{ color: 'var(--color-success)' }} /> : <AlertCircle size={20} style={{ color: compliance.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }} />}
                  <span style={{
                    fontSize: '1.75rem', fontWeight: 800,
                    color: compliance.rate >= 80 ? 'var(--color-success)' : compliance.rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                  }}>{compliance.rate}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Posts */}
                {selectedColObj.obligations.posts > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>📷 Imágenes / Posts</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Objetivo: {selectedColObj.obligations.posts} publicaciones</span>
                    </div>
                    <ProgressBar value={compliance.postsDone} max={selectedColObj.obligations.posts} color="var(--color-primary)" />
                  </div>
                )}
                {/* Reels */}
                {selectedColObj.obligations.reels > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>🎬 Reels</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Objetivo: {selectedColObj.obligations.reels} reels</span>
                    </div>
                    <ProgressBar value={compliance.reelsDone} max={selectedColObj.obligations.reels} color="var(--color-purple)" />
                  </div>
                )}
                {/* Videos */}
                {selectedColObj.obligations.videos > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>🎥 Videos (YouTube / Horizontal)</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Objetivo: {selectedColObj.obligations.videos} videos</span>
                    </div>
                    <ProgressBar value={compliance.videosDone} max={selectedColObj.obligations.videos} color="var(--color-warning)" />
                  </div>
                )}
                {/* Reports */}
                {selectedColObj.obligations.reports > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>📋 Informes Mensuales</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Objetivo: {selectedColObj.obligations.reports} informe(s)</span>
                    </div>
                    <ProgressBar value={0} max={selectedColObj.obligations.reports} color="var(--color-teal)" />
                  </div>
                )}
              </div>
            </div>

            {/* Contract Summary */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Obligaciones Contractuales Mensuales</h3>
              <div className="grid-cols-4">
                {[
                  { label: 'Posts / Imágenes', val: selectedColObj.obligations.posts, unit: 'publicaciones', color: 'var(--color-primary)' },
                  { label: 'Reels', val: selectedColObj.obligations.reels, unit: 'reels', color: 'var(--color-purple)' },
                  { label: 'Videos', val: selectedColObj.obligations.videos, unit: 'videos', color: 'var(--color-warning)' },
                  { label: 'Informes', val: selectedColObj.obligations.reports, unit: 'informes', color: 'var(--color-teal)' }
                ].map(item => (
                  <div key={item.label} className="card" style={{ padding: '1rem', textAlign: 'center', border: `1px solid ${item.color}33` }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.unit}<br/>mensuales</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Code size={16} style={{ color: roleColor(selectedColObj.role) }} />
                <span className="card-title" style={{ margin: 0 }}>Configuración de Perfil (JSON)</span>
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
                maxHeight: '200px'
              }}>
                {selectedColObj.metadata || '{}'}
              </pre>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: 'var(--text-muted)', gap: '1rem' }}>
            <Users2 size={48} style={{ opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Selecciona un colaborador para ver sus detalles.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCol ? 'Editar Colaborador' : 'Nuevo Colaborador'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre Completo</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required placeholder="Ej. Ana García" />
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Cargo</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input" required>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Fecha de Ingreso</label>
                    <input type="date" value={form.dateJoined} onChange={e => setForm({ ...form, dateJoined: e.target.value })} className="input" required />
                  </div>
                </div>
                <div>
                  <label className="label">Estado</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>Obligaciones Mensuales</label>
                  <div className="grid-cols-2">
                    {[['posts', 'Posts / Imágenes'], ['reels', 'Reels'], ['videos', 'Videos'], ['reports', 'Informes']].map(([key, label]) => (
                      <div key={key}>
                        <label className="label">{label}</label>
                        <input
                          type="number"
                          min="0"
                          value={form.obligations[key]}
                          onChange={e => setForm({ ...form, obligations: { ...form.obligations, [key]: parseInt(e.target.value) || 0 } })}
                          className="input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Code size={12} /> Configuración de Perfil (JSON)
                  </label>
                  <textarea
                    value={form.metadata}
                    onChange={e => { setForm({ ...form, metadata: e.target.value }); validateJson(e.target.value); }}
                    className="input"
                    rows="4"
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                    placeholder='{\n  "commission_rate": 0.05\n}'
                  />
                  {jsonError && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{jsonError}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingCol ? 'Actualizar' : 'Agregar Colaborador'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
