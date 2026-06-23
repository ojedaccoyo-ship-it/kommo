import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  List, 
  ExternalLink, 
  Paperclip,
  CheckCircle,
  Eye
} from 'lucide-react';

export const CalendarioContenido = () => {
  const { 
    products, 
    collaborators, 
    contentCalendar, 
    addContent, 
    updateContent, 
    deleteContent,
    filters 
  } = useContext(MarketingContext);

  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form State
  const [form, setForm] = useState({
    id: '',
    publishDate: '',
    channel: 'Facebook',
    product: '',
    contentType: 'Imagen',
    owner: '',
    status: 'Idea',
    copy: '',
    designUrl: '',
    publishUrl: ''
  });

  // Filter content
  const filteredPosts = contentCalendar.filter(post => {
    const matchProduct = filters.productId === 'all' || post.product === filters.productId;
    const matchChannel = filters.channel === 'all' || post.channel === filters.channel;
    const matchOwner = filters.owner === 'all' || post.owner === filters.owner;
    
    // Date filter
    const matchDate = post.publishDate >= filters.dateRange.start && post.publishDate <= filters.dateRange.end;
    return matchProduct && matchChannel && matchOwner && matchDate;
  });

  const openAddModal = () => {
    setEditingPost(null);
    setForm({
      id: '',
      publishDate: new Date().toISOString().split('T')[0],
      channel: 'Instagram',
      product: products[0]?.id || '',
      contentType: 'Reel',
      owner: collaborators[0]?.name || '',
      status: 'Idea',
      copy: '',
      designUrl: '',
      publishUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setForm({ ...post });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      updateContent(form);
    } else {
      addContent(form);
    }
    setIsModalOpen(false);
  };

  const getChannelColor = (channel) => {
    switch(channel) {
      case 'Facebook': return '#3b82f6';
      case 'Instagram': return '#ec4899';
      case 'TikTok': return '#00f2fe';
      case 'YouTube': return '#ef4444';
      case 'Blog': return '#14b8a6';
      case 'WhatsApp': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Idea': return 'badge-danger'; // red/orange
      case 'Diseño': return 'badge-warning'; // amber
      case 'Revisión': return 'badge-info'; // blue
      case 'Programado': return 'badge-purple'; // purple
      case 'Publicado': return 'badge-success'; // green
      default: return 'badge-secondary';
    }
  };

  // CALENDAR GENERATOR (Hardcoded for June 2026 which matches the contextual timeline of the ERP)
  const renderCalendar = () => {
    // June 2026 starts on a Monday (1) and has 30 days
    const totalDays = 30;
    const startOffset = 0; // Monday start
    const days = [];
    
    // We can map calendar cells
    for(let i = 1; i <= totalDays; i++) {
      const dateString = `2026-06-${i.toString().padStart(2, '0')}`;
      const postsForDay = filteredPosts.filter(p => p.publishDate === dateString);
      days.push({ dayNum: i, dateString, posts: postsForDay });
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', gridAutoRows: '120px' }}>
          {days.map(day => (
            <div 
              key={day.dayNum} 
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                overflow: 'hidden'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{day.dayNum}</div>
              <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {day.posts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => openEditModal(post)}
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      borderLeft: `3px solid ${getChannelColor(post.channel)}`,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={`${post.channel} - ${post.contentType}: ${post.copy}`}
                  >
                    {post.contentType}: {post.copy}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* View Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '2px' }}>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Calendar size={14} /> Calendario
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <List size={14} /> Lista de Postings
          </button>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Plus size={16} /> Planificar Post
        </button>
      </div>

      {/* Render Main View */}
      {viewMode === 'calendar' ? (
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Junio 2026</h3>
            {/* Color legend */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.725rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#3b82f6' }}></span> Facebook
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ec4899' }}></span> Instagram
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#00f2fe' }}></span> TikTok
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ef4444' }}></span> YouTube
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#14b8a6' }}></span> Blog
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#10b981' }}></span> WhatsApp
              </span>
            </div>
          </div>
          {renderCalendar()}
        </div>
      ) : (
        <div className="table-container">
          {filteredPosts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Canal</th>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th>Copy / Descripción</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Adjuntos</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => {
                  const prod = products.find(p => p.id === post.product);
                  return (
                    <tr key={post.id}>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{post.publishDate}</td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          color: getChannelColor(post.channel), 
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getChannelColor(post.channel) }}></span>
                          {post.channel}
                        </span>
                      </td>
                      <td>{post.contentType}</td>
                      <td>
                        <span className="badge badge-info">{prod ? prod.name : post.product}</span>
                      </td>
                      <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={post.copy}>
                        {post.copy}
                      </td>
                      <td>{post.owner}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {post.designUrl && (
                            <a href={post.designUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem', display: 'inline-flex' }} title="Ver Diseño">
                              <Paperclip size={12} />
                            </a>
                          )}
                          {post.publishUrl && (
                            <a href={post.publishUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem', display: 'inline-flex' }} title="Ver Publicación">
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => openEditModal(post)} 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem' }}
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => deleteContent(post.id)} 
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
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No hay publicaciones programadas para este filtro en la vista de lista.
            </div>
          )}
        </div>
      )}

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPost ? 'Editar Publicación Orgánica' : 'Nueva Publicación Orgánica'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Fecha de Publicación</label>
                    <input 
                      type="date" 
                      value={form.publishDate} 
                      onChange={(e) => setForm({...form, publishDate: e.target.value})} 
                      className="input" 
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Canal de Difusión</label>
                    <select 
                      value={form.channel} 
                      onChange={(e) => setForm({...form, channel: e.target.value})} 
                      className="input"
                      required
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Blog">Blog</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
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
                    <label className="label">Tipo de Contenido</label>
                    <select 
                      value={form.contentType} 
                      onChange={(e) => setForm({...form, contentType: e.target.value})} 
                      className="input"
                      required
                    >
                      <option value="Imagen">Imagen</option>
                      <option value="Reel">Reel</option>
                      <option value="Video">Video</option>
                      <option value="Carrusel">Carrusel</option>
                      <option value="Historia">Historia</option>
                      <option value="Artículo">Artículo</option>
                    </select>
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div>
                    <label className="label">Responsable</label>
                    <select 
                      value={form.owner} 
                      onChange={(e) => setForm({...form, owner: e.target.value})} 
                      className="input"
                      required
                    >
                      {collaborators.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Estado del Flujo</label>
                    <select 
                      value={form.status} 
                      onChange={(e) => setForm({...form, status: e.target.value})} 
                      className="input"
                      required
                    >
                      <option value="Idea">Idea</option>
                      <option value="Diseño">Diseño</option>
                      <option value="Revisión">Revisión</option>
                      <option value="Programado">Programado</option>
                      <option value="Publicado">Publicado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Copy / Texto del Post</label>
                  <textarea 
                    value={form.copy} 
                    onChange={(e) => setForm({...form, copy: e.target.value})} 
                    className="input" 
                    rows="3" 
                    placeholder="Redacta el copy de tu publicación aquí..."
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <div className="grid-cols-2">
                  <div>
                    <label className="label">URL del Diseño (Adjunto)</label>
                    <input 
                      type="url" 
                      value={form.designUrl} 
                      onChange={(e) => setForm({...form, designUrl: e.target.value})} 
                      className="input" 
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="label">URL de Publicación</label>
                    <input 
                      type="url" 
                      value={form.publishUrl} 
                      onChange={(e) => setForm({...form, publishUrl: e.target.value})} 
                      className="input" 
                      placeholder="https://instagram.com/p/..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingPost ? 'Actualizar Post' : 'Agregar Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
