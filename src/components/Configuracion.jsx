import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { Sliders, Link2, ShoppingBag, Briefcase, BookOpen, Plus, Edit, Trash2, RotateCcw, CheckCircle, XCircle, UserCircle } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';

const emptyProduct = { name: '', description: '', basePrice: 0, category: PRODUCT_CATEGORIES[0], active: true };

export const Configuracion = () => {
  const {
    products, addProduct, updateProduct, deleteProduct,
    collaborators, currentUserId, setCurrentUserId,
    integrationSettings, setIntegrationSettings, resetToDefault
  } = useContext(MarketingContext);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductForm(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({ category: PRODUCT_CATEGORIES[0], active: true, ...prod });
    setShowProductForm(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productForm });
    } else {
      addProduct(productForm);
    }
    setShowProductForm(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto turístico? Se perderán las asociaciones en el calendario y campañas.')) {
      deleteProduct(id);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Restablecer TODOS los datos del módulo a los valores demo iniciales? Esta acción no se puede deshacer.')) {
      resetToDefault();
    }
  };

  const toggleIntegration = (key) => {
    setIntegrationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const integrationDefs = [
    {
      key: 'salesActive',
      title: 'Integración con Ventas',
      icon: ShoppingBag,
      color: 'var(--color-success)',
      description: 'Vincula cada Lead generado por campañas a su venta final. Permite calcular la tasa de conversión Lead → Venta y el ingreso real atribuido a Marketing.',
      flow: 'Marketing → Lead → Venta'
    },
    {
      key: 'operationsActive',
      title: 'Integración con Operaciones',
      icon: Briefcase,
      color: 'var(--color-primary)',
      description: 'Conecta los productos turísticos con sus campañas y reservas activas. Mide la demanda generada por Marketing en cada tour y permite planificar la capacidad operativa.',
      flow: 'Producto → Campaña → Reserva'
    },
    {
      key: 'accountingActive',
      title: 'Integración con Contabilidad',
      icon: BookOpen,
      color: 'var(--color-warning)',
      description: 'Registra el gasto publicitario como costo en contabilidad y lo cruza con los ingresos. Calcula el ROI real, la rentabilidad por producto y el Costo de Adquisición de Cliente (CAC).',
      flow: 'Gasto Publicitario → Ventas → P&L'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Current User */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <UserCircle size={18} style={{ color: 'var(--color-primary)' }} />
          <h3>Usuario Actual</h3>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          El sistema no tiene inicio de sesión real: esta selección solo indica quién está usando el sistema ahora mismo,
          para registrar quién creó o actualizó cada campaña, publicación o activo.
        </p>
        <select
          value={currentUserId}
          onChange={e => setCurrentUserId(e.target.value)}
          className="input"
          style={{ maxWidth: '320px' }}
        >
          {collaborators.map(c => (
            <option key={c.id} value={c.id}>{c.name} · {c.role}</option>
          ))}
        </select>
      </div>

      {/* Module Integrations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Link2 size={18} style={{ color: 'var(--color-primary)' }} />
          <h3>Integraciones del Módulo ERP</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {integrationDefs.map(({ key, title, icon: Icon, color, description, flow }) => {
            const isActive = integrationSettings[key];
            return (
              <div key={key} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', backgroundColor: `${color}18`, flexShrink: 0 }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ margin: 0 }}>{title}</h4>
                        {isActive
                          ? <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                          : <XCircle size={14} style={{ color: 'var(--color-danger)' }} />
                        }
                      </div>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.825rem' }}>{description}</p>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color, letterSpacing: '0.05em' }}>
                        Flujo: {flow}
                      </div>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleIntegration(key)}
                    style={{
                      width: '52px', height: '28px', borderRadius: 'var(--radius-full)',
                      border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                      backgroundColor: isActive ? color : 'var(--bg-secondary)',
                      transition: 'background-color var(--transition-normal)'
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: '4px',
                      left: isActive ? '26px' : '4px',
                      width: '20px', height: '20px',
                      borderRadius: '50%', backgroundColor: 'white',
                      transition: 'left var(--transition-normal)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                    }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Products Catalog */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--color-warning)' }} />
            <h3>Catálogo de Productos Turísticos</h3>
          </div>
          <button onClick={openAddProduct} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={12} /> Nuevo Producto
          </button>
        </div>

        {showProductForm && (
          <form onSubmit={handleProductSubmit} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', border: '1px dashed var(--border-focus)' }}>
            <h4 style={{ marginBottom: '1rem' }}>{editingProduct ? 'Editar Producto Turístico' : 'Agregar Nuevo Producto Turístico'}</h4>
            <div className="grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / 3' }}>
                <label className="label">Nombre del Producto</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="input" required placeholder="Ej. Pallay Punchu" disabled={!!editingProduct} />
              </div>
              <div>
                <label className="label">Precio Base (USD $)</label>
                <input type="number" value={productForm.basePrice} onChange={e => setProductForm({ ...productForm, basePrice: Number(e.target.value) })} className="input" required min="0" />
              </div>
            </div>
            <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label">Categoría</label>
                <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="input">
                  {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Estado</label>
                <select value={productForm.active ? 'true' : 'false'} onChange={e => setProductForm({ ...productForm, active: e.target.value === 'true' })} className="input">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Descripción del Tour</label>
              <input type="text" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="input" required placeholder="Breve descripción del producto" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowProductForm(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">{editingProduct ? 'Guardar Cambios' : 'Guardar Producto'}</button>
            </div>
          </form>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Tour</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Precio Base</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} style={{ opacity: prod.active === false ? 0.55 : 1 }}>
                  <td>
                    <code
                      style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}
                      title={prod.createdAt ? `Creado: ${new Date(prod.createdAt).toLocaleString('es-PE')}` : undefined}
                    >
                      {prod.id}
                    </code>
                  </td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td><span className="badge badge-info">{prod.category || '—'}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', maxWidth: '300px' }}>{prod.description}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>${prod.basePrice}</td>
                  <td>
                    <span className={`badge ${prod.active === false ? 'badge-danger' : 'badge-success'}`}>
                      {prod.active === false ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button onClick={() => openEditProduct(prod)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: 'var(--color-danger)33', padding: '1.25rem' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCcw size={16} /> Zona de Restablecimiento
        </h3>
        <p style={{ marginBottom: '1rem' }}>Restablece TODOS los datos del módulo al estado demo inicial. Útil para demostraciones o pruebas.</p>
        <button onClick={handleReset} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCcw size={14} /> Restablecer Datos Demo
        </button>
      </div>

    </div>
  );
};
