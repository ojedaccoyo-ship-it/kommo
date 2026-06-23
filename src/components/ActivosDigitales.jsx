import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { Plus, Trash2, Search, FolderOpen, Image, Film, Palette, Volume2, Layout, Star } from 'lucide-react';

const TYPE_ICONS = {
  Fotos: Image, Videos: Film, Diseños: Palette, Logos: Star, Audios: Volume2, Plantillas: Layout
};
const TYPE_COLORS = {
  Fotos: 'var(--color-primary)', Videos: 'var(--color-purple)', Diseños: 'var(--color-warning)',
  Logos: 'var(--color-teal)', Audios: 'var(--color-success)', Plantillas: 'var(--color-danger)'
};
const ASSET_TYPES = ['Fotos', 'Videos', 'Diseños', 'Logos', 'Audios', 'Plantillas'];

export const ActivosDigitales = () => {
  const { products, collaborators, assets, addAsset, deleteAsset, filters } = useContext(MarketingContext);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Fotos', product: '', date: new Date().toISOString().split('T')[0], author: '', url: '' });

  const filtered = assets.filter(a => {
    const matchProduct = filters.productId === 'all' || a.product === filters.productId;
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase());
    return matchProduct && matchType && matchSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAsset(form);
    setIsModalOpen(false);
  };

  const openAdd = () => {
    setForm({ name: '', type: 'Fotos', product: products[0]?.id || '', date: new Date().toISOString().split('T')[0], author: collaborators[0]?.name || '', url: '' });
    setIsModalOpen(true);
  };

  // Count by type
  const countByType = ASSET_TYPES.reduce((acc, t) => {
    acc[t] = assets.filter(a => a.type === t && (filters.productId === 'all' || a.product === filters.productId)).length;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Type stats */}
      <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {ASSET_TYPES.map(type => {
          const Icon = TYPE_ICONS[type] || FolderOpen;
          const color = TYPE_COLORS[type] || 'var(--color-primary)';
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              style={{
                background: typeFilter === type ? `${color}18` : 'var(--bg-card)',
                border: `1px solid ${typeFilter === type ? color : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={22} style={{ color }} />
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{countByType[type]}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{type}</div>
            </button>
          );
        })}
      </div>

      {/* Search & Add */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            placeholder="Buscar activos por nombre o autor..."
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Subir Activo
        </button>
      </div>

      {/* Assets Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <FolderOpen size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
          <div>No hay activos que coincidan con tu búsqueda.</div>
        </div>
      ) : (
        <div className="grid-cols-4">
          {filtered.map(asset => {
            const prod = products.find(p => p.id === asset.product);
            const Icon = TYPE_ICONS[asset.type] || FolderOpen;
            const color = TYPE_COLORS[asset.type] || 'var(--color-primary)';
            const isImage = asset.type === 'Fotos' || asset.type === 'Videos' || asset.type === 'Diseños' || asset.type === 'Logos' || asset.type === 'Plantillas';

            return (
              <div key={asset.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '160px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {asset.url && isImage ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Icon size={48} style={{ color, opacity: 0.4 }} />
                  )}
                  <div style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    backgroundColor: `${color}22`,
                    border: `1px solid ${color}44`,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.65rem', fontWeight: 600, color
                  }}>
                    <Icon size={10} /> {asset.type}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.825rem', lineHeight: '1.2' }}>{asset.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{prod?.name || asset.product}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{asset.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', marginTop: '0.1rem' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>👤 {asset.author}</span>
                    <button onClick={() => deleteAsset(asset.id)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem' }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Subir Nuevo Activo Digital</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Nombre del Activo</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required placeholder="Ej. Foto Amanecer Machu Picchu Alta Res" />
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Tipo de Activo</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input" required>
                      {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Producto Relacionado</label>
                    <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="input" required>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-cols-2">
                  <div>
                    <label className="label">Fecha de Creación</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" required />
                  </div>
                  <div>
                    <label className="label">Autor / Creador</label>
                    <select value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="input" required>
                      {collaborators.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">URL del Activo (Imagen / Archivo)</label>
                  <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="input" placeholder="https://images.unsplash.com/..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Subir Activo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
