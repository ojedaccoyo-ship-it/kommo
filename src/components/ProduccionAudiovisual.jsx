import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Film,
  Camera,
  Layers
} from 'lucide-react';

const columns = [
  { id: 'Programado', name: 'Programado', color: '#6b7280' },
  { id: 'Grabación', name: 'Grabación', color: '#f59e0b' },
  { id: 'Edición', name: 'Edición', color: '#a855f7' },
  { id: 'Revisión', name: 'Revisión', color: '#06b6d4' },
  { id: 'Finalizado', name: 'Finalizado', color: '#10b981' }
];

export const ProduccionAudiovisual = () => {
  const { 
    products, 
    productions, 
    addProduction, 
    updateProduction, 
    deleteProduction,
    filters 
  } = useContext(MarketingContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  // Form State
  const [form, setForm] = useState({
    id: '',
    project: '',
    product: '',
    type: 'Reel',
    dateRecording: '',
    dateEditing: '',
    datePublishing: '',
    status: 'Programado'
  });

  // Filter productions based on global filters (product only since there's no owner/channel direct link)
  const filteredProds = productions.filter(p => {
    return filters.productId === 'all' || p.product === filters.productId;
  });

  const openAddModal = () => {
    setEditingProd(null);
    setForm({
      id: '',
      project: '',
      product: products[0]?.id || '',
      type: 'Reel',
      dateRecording: new Date().toISOString().split('T')[0],
      dateEditing: new Date().toISOString().split('T')[0],
      datePublishing: new Date().toISOString().split('T')[0],
      status: 'Programado'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProd(prod);
    setForm({ ...prod });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProd) {
      updateProduction(form);
    } else {
      addProduction(form);
    }
    setIsModalOpen(false);
  };

  // Move production left/right in Kanban columns
  const moveCard = (prod, direction) => {
    const currentIndex = columns.findIndex(col => col.id === prod.status);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < columns.length) {
      const updatedProd = { ...prod, status: columns[nextIndex].id };
      updateProduction(updatedProd);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Fotografía': return <Camera size={14} />;
      case 'Reel': 
      case 'Video vertical': 
      case 'Video horizontal': return <Film size={14} />;
      default: return <Layers size={14} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0 }}>Gestiona el estado de tus producciones de contenido y rodajes turísticos.</p>
        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Plus size={16} /> Planificar Producción
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="kanban-board" style={{ paddingBottom: '1rem' }}>
        {columns.map(col => {
          const prodsInCol = filteredProds.filter(p => p.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header">
                <span className="kanban-column-title">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }}></span>
                  {col.name}
                </span>
                <span className="badge badge-secondary" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                  {prodsInCol.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="kanban-cards">
                {prodsInCol.map(prod => {
                  const productObj = products.find(p => p.id === prod.product);
                  return (
                    <div key={prod.id} className="kanban-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span 
                          className="badge" 
                          style={{ 
                            fontSize: '0.65rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            backgroundColor: 'rgba(255,255,255,0.05)', 
                            color: 'var(--text-secondary)' 
                          }}
                        >
                          {getTypeIcon(prod.type)}
                          {prod.type}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                          {productObj ? productObj.name : prod.product}
                        </span>
                      </div>

                      <div 
                        onClick={() => openEditModal(prod)}
                        style={{ 
                          fontWeight: 600, 
                          fontSize: '0.825rem', 
                          color: 'var(--text-primary)', 
                          cursor: 'pointer',
                          lineHeight: '1.2' 
                        }}
                      >
                        {prod.project}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={10} /> Grabación: {prod.dateRecording}
                        </div>
                        {prod.status === 'Edición' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={10} /> Edición: {prod.dateEditing}
                          </div>
                        )}
                        {prod.status === 'Finalizado' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={10} /> Publicación: {prod.datePublishing}
                          </div>
                        )}
                      </div>

                      {/* Card Actions (Move & Manage) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.4rem', marginTop: '0.25rem' }}>
                        {/* Navigation Arrows */}
                        <div style={{ display: 'flex', gap: '0.15rem' }}>
                          <button 
                            disabled={prod.status === 'Programado'} 
                            onClick={() => moveCard(prod, -1)} 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.15rem 0.25rem', opacity: prod.status === 'Programado' ? 0.3 : 1 }}
                          >
                            <ChevronLeft size={10} />
                          </button>
                          <button 
                            disabled={prod.status === 'Finalizado'} 
                            onClick={() => moveCard(prod, 1)} 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.15rem 0.25rem', opacity: prod.status === 'Finalizado' ? 0.3 : 1 }}
                          >
                            <ChevronRight size={10} />
                          </button>
                        </div>

                        {/* Edit and Trash */}
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button 
                            onClick={() => openEditModal(prod)} 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem' }}
                          >
                            <Edit size={10} />
                          </button>
                          <button 
                            onClick={() => deleteProduction(prod.id)} 
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.25rem' }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProd ? 'Editar Producción' : 'Planificar Nueva Producción'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre del Proyecto Audiovisual</label>
                  <input 
                    type="text" 
                    value={form.project} 
                    onChange={(e) => setForm({...form, project: e.target.value})} 
                    className="input" 
                    placeholder="Ej. Reels de Camino Inca con mochileros"
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div>
                    <label className="label">Producto Turístico</label>
                    <select 
                      value={form.product} 
                      onChange={(e) => setForm({...form, product: e.target.value})} 
                      className="input"
                      required
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Tipo de Producción</label>
                    <select 
                      value={form.type} 
                      onChange={(e) => setForm({...form, type: e.target.value})} 
                      className="input"
                      required
                    >
                      <option value="Fotografía">Fotografía</option>
                      <option value="Reel">Reel</option>
                      <option value="Video horizontal">Video horizontal</option>
                      <option value="Video vertical">Video vertical</option>
                      <option value="Drone">Drone y Aéreos</option>
                    </select>
                  </div>
                </div>

                <div className="grid-cols-3">
                  <div>
                    <label className="label">Fecha Grabación</label>
                    <input 
                      type="date" 
                      value={form.dateRecording} 
                      onChange={(e) => setForm({...form, dateRecording: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Fecha Edición</label>
                    <input 
                      type="date" 
                      value={form.dateEditing} 
                      onChange={(e) => setForm({...form, dateEditing: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Fecha Publicación</label>
                    <input 
                      type="date" 
                      value={form.datePublishing} 
                      onChange={(e) => setForm({...form, datePublishing: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Estado del Kanban</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => setForm({...form, status: e.target.value})} 
                    className="input"
                    required
                  >
                    <option value="Programado">Programado</option>
                    <option value="Grabación">Grabación</option>
                    <option value="Edición">Edición</option>
                    <option value="Revisión">Revisión</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingProd ? 'Actualizar' : 'Agregar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
