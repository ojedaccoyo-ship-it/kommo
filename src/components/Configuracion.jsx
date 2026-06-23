import React, { useContext, useState } from 'react';
import { MarketingContext } from '../context/MarketingContext';
import { Sliders, Link2, ShoppingBag, Briefcase, BookOpen, Plus, Trash2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export const Configuracion = () => {
  const { products, setProducts, integrationSettings, setIntegrationSettings, resetToDefault } = useContext(MarketingContext);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', basePrice: 0 });
  const [showAddProd, setShowAddProd] = useState(false);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setProducts(prev => [...prev, { ...newProduct, id }]);
    setNewProduct({ name: '', description: '', basePrice: 0 });
    setShowAddProd(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto turístico? Se perderán las asociaciones en el calendario y campañas.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
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
          <button onClick={() => setShowAddProd(v => !v)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={12} /> Nuevo Producto
          </button>
        </div>

        {showAddProd && (
          <form onSubmit={handleAddProduct} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', border: '1px dashed var(--border-focus)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Agregar Nuevo Producto Turístico</h4>
            <div className="grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1 / 3' }}>
                <label className="label">Nombre del Producto</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="input" required placeholder="Ej. Pallay Punchu" />
              </div>
              <div>
                <label className="label">Precio Base (USD $)</label>
                <input type="number" value={newProduct.basePrice} onChange={e => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })} className="input" required min="0" />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Descripción del Tour</label>
              <input type="text" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="input" required placeholder="Breve descripción del producto" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddProd(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Producto</button>
            </div>
          </form>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Tour</th>
                <th>Descripción</th>
                <th>Precio Base</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id}>
                  <td><code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>{prod.id}</code></td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', maxWidth: '300px' }}>{prod.description}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>${prod.basePrice}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem' }}>
                      <Trash2 size={12} />
                    </button>
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
