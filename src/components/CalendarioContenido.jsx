import React, { useContext, useState } from 'react';
import ExcelJS from 'exceljs';
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
  Eye,
  Upload,
  FileText,
  Download
} from 'lucide-react';

const CHANNEL_OPTIONS = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Blog', 'WhatsApp'];
const CONTENT_TYPE_OPTIONS = ['Imagen', 'Reel', 'Video', 'Carrusel', 'Historia', 'Artículo'];
const TEMPLATE_ROWS = 200;

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
  
  // Schedule Import States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedPosts, setParsedPosts] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importMode, setImportMode] = useState('text'); // 'text' | 'file'
  const [importFileName, setImportFileName] = useState('');

  // Matches typed text against a product's internal id OR its display name, so "Machu Picchu" and "machu-picchu" both resolve
  const resolveProductId = (value) => {
    if (!value) return products[0]?.id || '';
    const trimmed = String(value).trim();
    const match = products.find(p => p.id.toLowerCase() === trimmed.toLowerCase() || p.name.toLowerCase() === trimmed.toLowerCase());
    return match ? match.id : trimmed;
  };

  const parseLines = (text) => {
    const lines = text.split('\n');
    const parsed = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      // support both pipe | and comma , as delimiters
      const separator = trimmed.includes('|') ? '|' : ',';
      const parts = trimmed.split(separator).map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 4) {
        const [publishDate, channel, contentType, product, copy, owner] = parts;
        parsed.push({
          id: `parsed-${index}-${Date.now()}`,
          publishDate: publishDate || new Date().toISOString().split('T')[0],
          channel: channel || 'Instagram',
          contentType: contentType || 'Reel',
          product: resolveProductId(product),
          copy: copy || 'Sin copy',
          owner: owner || collaborators[0]?.name || '',
          status: 'Idea',
          designUrl: '',
          publishUrl: ''
        });
      }
    });
    return parsed;
  };

  // Reads back the .xlsx smart template (dropdown-filled rows), one row per planned post
  const parseXlsxFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.getWorksheet('Cronograma') || workbook.worksheets[0];
    const parsed = [];
    const cellText = (cell) => {
      const v = cell?.value;
      if (v === null || v === undefined) return '';
      if (v instanceof Date) return v.toISOString().split('T')[0];
      if (typeof v === 'object' && 'text' in v) return String(v.text).trim();
      if (typeof v === 'object' && 'result' in v) return String(v.result).trim();
      return String(v).trim();
    };
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header row
      const publishDate = cellText(row.getCell(1));
      const channel = cellText(row.getCell(2));
      const contentType = cellText(row.getCell(3));
      const productRaw = cellText(row.getCell(4));
      const copy = cellText(row.getCell(5));
      const owner = cellText(row.getCell(6));
      if (!publishDate && !channel && !productRaw && !copy) return; // skip blank rows
      parsed.push({
        id: `parsed-${rowNumber}-${Date.now()}`,
        publishDate: publishDate || new Date().toISOString().split('T')[0],
        channel: channel || 'Instagram',
        contentType: contentType || 'Reel',
        product: resolveProductId(productRaw),
        copy: copy || 'Sin copy',
        owner: owner || collaborators[0]?.name || '',
        status: 'Idea',
        designUrl: '',
        publishUrl: ''
      });
    });
    return parsed;
  };

  const handleImportTextChange = (text) => {
    setImportText(text);
    setParsedPosts(parseLines(text));
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setImportFileName(file.name);
    if (file.name.toLowerCase().endsWith('.xlsx')) {
      setImportText('');
      parseXlsxFile(file).then(setParsedPosts);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setImportText(text);
      setParsedPosts(parseLines(text));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.xlsx'))) {
      handleFileUpload(file);
    }
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    parsedPosts.forEach(post => {
      const { id, ...postData } = post;
      addContent(postData);
    });
    setIsImportModalOpen(false);
    setImportText('');
    setParsedPosts([]);
    setImportFileName('');
  };

  // Builds a real .xlsx with dropdown validation on Canal/Tipo/Producto/Responsable, so filling it in Excel avoids typos
  const downloadImportTemplate = async () => {
    const today = new Date();
    const exampleDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };
    const productNames = products.map(p => p.name);
    const ownerNames = collaborators.map(c => c.name);
    const firstProduct = productNames[0] || 'Machu Picchu';
    const secondProduct = productNames[1] || firstProduct;
    const firstOwner = ownerNames[0] || 'Responsable';
    const secondOwner = ownerNames[1] || firstOwner;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Kommo ERP - Módulo de Marketing';
    workbook.created = today;

    // --- Instructions sheet ---
    const info = workbook.addWorksheet('Instrucciones');
    info.columns = [{ width: 95 }];
    info.addRow(['Cómo usar esta plantilla']).font = { bold: true, size: 14 };
    info.addRow([]);
    [
      '1. Ve a la hoja "Cronograma" y llena una fila por publicación planificada.',
      '2. Usa los menús desplegables en Canal, Tipo de Contenido, Producto y Responsable — evitan errores de escritura.',
      '3. La Fecha debe tener el formato AAAA-MM-DD, por ejemplo 2026-08-15.',
      '4. No borres ni renombres la fila de encabezados (fila 1).',
      '5. Guarda el archivo y súbelo de vuelta en "Importar Cronograma" → "Subir Archivo".'
    ].forEach(line => { info.addRow([line]); });

    // --- Cronograma sheet ---
    const sheet = workbook.addWorksheet('Cronograma');
    sheet.columns = [
      { header: 'Fecha (AAAA-MM-DD)', key: 'date', width: 18 },
      { header: 'Canal', key: 'channel', width: 14 },
      { header: 'Tipo de Contenido', key: 'type', width: 18 },
      { header: 'Producto', key: 'product', width: 20 },
      { header: 'Copy', key: 'copy', width: 50 },
      { header: 'Responsable', key: 'owner', width: 20 }
    ];
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0EA5E9' } };
    headerRow.alignment = { vertical: 'middle' };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.autoFilter = 'A1:F1';

    sheet.addRow({ date: exampleDate(2), channel: 'Instagram', type: 'Reel', product: firstProduct, copy: 'Escribe aquí el copy de la publicación', owner: firstOwner });
    sheet.addRow({ date: exampleDate(4), channel: 'Facebook', type: 'Imagen', product: secondProduct, copy: 'Escribe aquí el copy de la publicación', owner: secondOwner });
    sheet.addRow({ date: exampleDate(6), channel: 'TikTok', type: 'Reel', product: firstProduct, copy: 'Escribe aquí el copy de la publicación', owner: firstOwner });

    // Dropdown (data validation) lists applied down the sheet for easy bulk planning
    const listFormula = (values) => `"${values.join(',')}"`;
    for (let row = 2; row <= TEMPLATE_ROWS; row++) {
      sheet.getCell(`B${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: [listFormula(CHANNEL_OPTIONS)] };
      sheet.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: [listFormula(CONTENT_TYPE_OPTIONS)] };
      if (productNames.length > 0) {
        sheet.getCell(`D${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: [listFormula(productNames)] };
      }
      if (ownerNames.length > 0) {
        sheet.getCell(`F${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: [listFormula(ownerNames)] };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_calendario_contenido.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCalendar = () => {
    const headers = ['id', 'publishDate', 'channel', 'contentType', 'product', 'owner', 'status', 'copy', 'designUrl', 'publishUrl'];
    const rows = filteredPosts.map(p =>
      headers.map(h => `"${String(p[h] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cronograma_contenido_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={exportCalendar} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Exportar calendario actual como CSV para análisis">
            <FileText size={14} /> Exportar CSV
          </button>
          <button onClick={() => setIsImportModalOpen(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Upload size={14} /> Importar Cronograma
          </button>
          <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={16} /> Planificar Post
          </button>
        </div>
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

      {/* IMPORT MASSIVE CALENDAR MODAL */}
      {isImportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3>📅 Importar Cronograma Masivo</h3>
              <button onClick={() => { setIsImportModalOpen(false); setImportText(''); setParsedPosts([]); setImportFileName(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <form onSubmit={handleImportSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Mode Toggle + Template download */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '2px' }}>
                    <button type="button" onClick={() => setImportMode('text')} className={`btn btn-sm ${importMode === 'text' ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none' }}>Pegar Texto</button>
                    <button type="button" onClick={() => setImportMode('file')} className={`btn btn-sm ${importMode === 'file' ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none' }}>Subir Archivo</button>
                  </div>
                  <button type="button" onClick={downloadImportTemplate} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Descarga una plantilla Excel (.xlsx) con menús desplegables, lista para llenar y volver a subir">
                    <Download size={12} /> Descargar Plantilla Excel
                  </button>
                </div>

                {/* Format Reference */}
                <div style={{ fontSize: '0.725rem', backgroundColor: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <strong>Plantilla Excel:</strong> trae menús desplegables en Canal, Tipo, Producto y Responsable — evita errores de escritura al llenarla.<br/>
                  <strong>Formato para pegar texto o CSV:</strong> <code>Fecha | Canal | Tipo | Producto | Copy | Responsable</code> (soporta <code>|</code> o <code>,</code> como separador)<br/>
                  <strong>Ejemplo:</strong><br/>
                  <code>2026-06-20 | Instagram | Reel | Machu Picchu | ¡Atardecer único! 🌅 | Mariana Flores</code>
                </div>

                {/* Text Mode */}
                {importMode === 'text' && (
                  <div>
                    <label className="label">Cronograma en Texto Estructurado</label>
                    <textarea 
                      value={importText} 
                      onChange={(e) => handleImportTextChange(e.target.value)} 
                      className="input" 
                      rows="8" 
                      placeholder={"# Comentarios empiezan con #\n2026-06-20 | Instagram | Reel | machu-picchu | Copy aquí | Mariana Flores\n2026-06-21 | TikTok | Reel | humantay | Otro copy | Sofía Condori"}
                      style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                    ></textarea>
                  </div>
                )}

                {/* File Upload Mode */}
                {importMode === 'file' && (
                  <div>
                    <label className="label">Archivo Excel (.xlsx), CSV o TXT</label>
                    <label
                      className={`dropzone ${isDragOver ? 'dragover' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".csv,.txt,.xlsx"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                      />
                      {importFileName ? (
                        <div>
                          <CheckCircle size={20} style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }} />
                          <div style={{ fontWeight: 600 }}>{importFileName}</div>
                          <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Archivo cargado. Haz clic para cambiar.</div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Arrastra tu archivo aquí</div>
                          <div>o haz clic para seleccionar un .xlsx, .csv o .txt</div>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {/* Preview Table */}
                {parsedPosts.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success)' }}>
                      <CheckCircle size={14} /> {parsedPosts.length} publicaciones detectadas y listas para importar
                    </h4>
                    <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', backgroundColor: 'var(--bg-primary)' }}>
                      <table className="table" style={{ margin: 0 }}>
                        <thead>
                          <tr style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 1 }}>
                            <th>Fecha</th>
                            <th>Canal</th>
                            <th>Tipo</th>
                            <th>Producto</th>
                            <th>Copy</th>
                            <th>Responsable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedPosts.map(post => (
                            <tr key={post.id}>
                              <td>{post.publishDate}</td>
                              <td>{post.channel}</td>
                              <td>{post.contentType}</td>
                              <td>{post.product}</td>
                              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.copy}</td>
                              <td>{post.owner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => { setIsImportModalOpen(false); setImportText(''); setParsedPosts([]); setImportFileName(''); }} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={parsedPosts.length === 0}>
                  Cargar al Calendario ({parsedPosts.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
