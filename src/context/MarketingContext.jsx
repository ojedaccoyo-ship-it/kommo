import React, { createContext, useState, useEffect } from 'react';

export const MarketingContext = createContext();

// Initial Mock Data
const initialProducts = [
  { id: 'machu-picchu', name: 'Machu Picchu', description: 'Tour de día completo o Camino Inca Corto al santuario histórico.', basePrice: 299 },
  { id: 'valle-sagrado', name: 'Valle Sagrado', description: 'Tour arqueológico y vivencial en el valle de los Incas.', basePrice: 149 },
  { id: 'humantay', name: 'Laguna Humantay', description: 'Caminata de aventura y paisajes alpinos turquesas.', basePrice: 89 },
  { id: 'camino-inca', name: 'Camino Inca 4D/3N', description: 'El sendero de trekking más famoso de Sudamérica.', basePrice: 650 },
  { id: 'city-tour', name: 'Cusco City Tour', description: 'Exploración cultural e histórica en el centro de la ciudad y templos aledaños.', basePrice: 49 }
];

const initialCollaborators = [
  { id: 'col-1', name: 'Alejandro Ramos', role: 'Publicista', dateJoined: '2025-01-15', status: 'Activo', obligations: { posts: 15, reels: 12, videos: 0, reports: 1 }, metadata: '{\n  "commission_rate": 0.05,\n  "preferred_channel": "Meta Ads"\n}' },
  { id: 'col-2', name: 'Mariana Flores', role: 'Community Manager', dateJoined: '2025-02-10', status: 'Activo', obligations: { posts: 25, reels: 15, videos: 2, reports: 1 }, metadata: '{\n  "languages": ["Español", "Inglés"],\n  "experience_years": 3\n}' },
  { id: 'col-3', name: 'Diego Quispe', role: 'Diseñador', dateJoined: '2025-03-01', status: 'Activo', obligations: { posts: 20, reels: 8, videos: 0, reports: 0 }, metadata: '{\n  "tools": ["Figma", "Photoshop", "Illustrator"]\n}' },
  { id: 'col-4', name: 'Sofía Condori', role: 'Editor', dateJoined: '2025-01-20', status: 'Activo', obligations: { posts: 0, reels: 15, videos: 6, reports: 0 }, metadata: '{\n  "software": ["Premiere Pro", "After Effects"]\n}' },
  { id: 'col-5', name: 'Carlos Vega', role: 'Fotógrafo', dateJoined: '2025-04-12', status: 'Activo', obligations: { posts: 10, reels: 10, videos: 4, reports: 0 }, metadata: '{\n  "equipment": ["Sony Alpha 7 IV", "Drone DJI Mavic 3"]\n}' }
];

const initialAnnualPlans = [
  { id: 'plan-2026', year: 2026, owner: 'Alejandro Ramos', objectives: 'Incrementar el volumen de leads en un 40% interanual y optimizar el CAC en campañas digitales para productos estrella.', budget: 120000 }
];

const initialCampaigns = [
  { id: 'camp-1', name: 'Inti Raymi Especial 2026', product: 'machu-picchu', season: 'Temporada Alta', startDate: '2026-05-01', endDate: '2026-06-25', status: 'Ejecutándose', budget: 15000, owner: 'Alejandro Ramos' },
  { id: 'camp-2', name: 'Aventura Humantay Invierno', product: 'humantay', season: 'Temporada Media', startDate: '2026-06-01', endDate: '2026-08-31', status: 'Ejecutándose', budget: 8000, owner: 'Mariana Flores' },
  { id: 'camp-3', name: 'Cyber Inca 2026', product: 'camino-inca', season: 'Cyber Week', startDate: '2026-07-10', endDate: '2026-07-17', status: 'Planificada', budget: 12000, owner: 'Alejandro Ramos' },
  { id: 'camp-4', name: 'Cultura Cusco Histórico', product: 'city-tour', season: 'Todo el año', startDate: '2026-02-01', endDate: '2026-12-31', status: 'Ejecutándose', budget: 5000, owner: 'Mariana Flores' },
  { id: 'camp-5', name: 'Valle Sagrado y Maras Moray', product: 'valle-sagrado', season: 'Primavera', startDate: '2026-09-01', endDate: '2026-11-30', status: 'Borrador', budget: 6000, owner: 'Diego Quispe' }
];

const initialContentCalendar = [
  { id: 'post-1', publishDate: '2026-06-15', channel: 'Instagram', product: 'machu-picchu', contentType: 'Reel', owner: 'Mariana Flores', status: 'Publicado', copy: '¿Listo para ver el amanecer en Machu Picchu? 🌅 Reserva tu tour hoy.', designUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', publishUrl: 'https://instagram.com/reel/1234' },
  { id: 'post-2', publishDate: '2026-06-16', channel: 'Facebook', product: 'humantay', contentType: 'Imagen', owner: 'Diego Quispe', status: 'Publicado', copy: 'La gema turquesa de Cusco te espera. ⛰️ Laguna Humantay a 4200msnm.', designUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', publishUrl: 'https://facebook.com/posts/1234' },
  { id: 'post-3', publishDate: '2026-06-18', channel: 'TikTok', product: 'camino-inca', contentType: 'Reel', owner: 'Sofía Condori', status: 'Programado', copy: 'Lo que nadie te cuenta de caminar 4 días por el Camino Inca 🥾🎒 #trekking', designUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', publishUrl: '' },
  { id: 'post-4', publishDate: '2026-06-19', channel: 'YouTube', product: 'machu-picchu', contentType: 'Video', owner: 'Carlos Vega', status: 'Revisión', copy: 'Guía Completa para Viajar a Machu Picchu en 2026: Entradas, horarios y tips.', designUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', publishUrl: '' },
  { id: 'post-5', publishDate: '2026-06-20', channel: 'Blog', product: 'valle-sagrado', contentType: 'Artículo', owner: 'Mariana Flores', status: 'Diseño', copy: '5 templos poco conocidos en el Valle Sagrado de los Incas.', designUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800', publishUrl: '' },
  { id: 'post-6', publishDate: '2026-06-22', channel: 'WhatsApp', product: 'city-tour', contentType: 'Historia', owner: 'Alejandro Ramos', status: 'Idea', copy: 'Oferta flash: Cusco City Tour 2x1 solo por hoy 🌟', designUrl: '', publishUrl: '' },
  { id: 'post-7', publishDate: '2026-06-02', channel: 'Instagram', product: 'humantay', contentType: 'Reel', owner: 'Mariana Flores', status: 'Publicado', copy: 'Caminando hacia el cielo en Humantay 🩵❄️', designUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', publishUrl: 'https://instagram.com/reel/humantay' },
  { id: 'post-8', publishDate: '2026-06-05', channel: 'TikTok', product: 'machu-picchu', contentType: 'Reel', owner: 'Mariana Flores', status: 'Publicado', copy: 'POV: Llegas a la Puerta del Sol (Intipunku) 🚪✨', designUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', publishUrl: 'https://tiktok.com/@kommo/reel/1' },
  { id: 'post-9', publishDate: '2026-06-08', channel: 'Facebook', product: 'machu-picchu', contentType: 'Imagen', owner: 'Mariana Flores', status: 'Publicado', copy: '¡Machu Picchu te espera en esta temporada seca! Reserva con anticipación.', designUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', publishUrl: 'https://facebook.com/machu' },
  { id: 'post-10', publishDate: '2026-06-10', channel: 'Instagram', product: 'camino-inca', contentType: 'Imagen', owner: 'Diego Quispe', status: 'Publicado', copy: 'Paisajes que roban el aliento. Camino Inca 2026.', designUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', publishUrl: 'https://instagram.com/p/inca' },
  { id: 'post-11', publishDate: '2026-06-11', channel: 'YouTube', product: 'humantay', contentType: 'Video', owner: 'Sofía Condori', status: 'Publicado', copy: 'El trekking más desafiante de un día en Cusco: Laguna Humantay.', designUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', publishUrl: 'https://youtube.com/watch?v=humantay' },
  { id: 'post-12', publishDate: '2026-06-12', channel: 'Instagram', product: 'city-tour', contentType: 'Imagen', owner: 'Mariana Flores', status: 'Publicado', copy: 'Explorando las calles de piedra del Barrio de San Blas 🧱🚶', designUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800', publishUrl: 'https://instagram.com/city' }
];

const initialProductions = [
  { id: 'prod-1', project: 'Sesión Fotográfica Machu Picchu Amanecer', product: 'machu-picchu', type: 'Fotografía', dateRecording: '2026-05-10', dateEditing: '2026-05-15', datePublishing: '2026-05-20', status: 'Finalizado' },
  { id: 'prod-2', project: 'Video Drone Laguna Humantay', product: 'humantay', type: 'Drone', dateRecording: '2026-06-14', dateEditing: '2026-06-18', datePublishing: '2026-06-22', status: 'Edición' },
  { id: 'prod-3', project: 'Reels Camino Inca Experiencia Mochilera', product: 'camino-inca', type: 'Reel', dateRecording: '2026-06-25', dateEditing: '2026-06-28', datePublishing: '2026-07-02', status: 'Programado' },
  { id: 'prod-4', project: 'Video Explicativo Valle Sagrado Arqueología', product: 'valle-sagrado', type: 'Video horizontal', dateRecording: '2026-06-01', dateEditing: '2026-06-08', datePublishing: '2026-06-15', status: 'Finalizado' },
  { id: 'prod-5', project: 'Entrevistas a Turistas en el City Tour', product: 'city-tour', type: 'Video vertical', dateRecording: '2026-06-17', dateEditing: '2026-06-19', datePublishing: '2026-06-21', status: 'Grabación' }
];

const initialAdCampaigns = [
  {
    id: 'ad-camp-1',
    name: 'Meta Ads - Machu Picchu Ventas Directas 2026',
    product: 'machu-picchu',
    platform: 'Meta Ads',
    objective: 'Ventas',
    budget: 3500,
    owner: 'Alejandro Ramos',
    segmentation: {
      name: 'Público Internacional Aventura',
      country: 'Estados Unidos, Canadá, España',
      ageRange: '25-50',
      gender: 'Todos',
      language: 'Inglés, Español',
      audienceType: 'Intereses',
      jsonConfig: '{\n  "interests": ["Machu Picchu", "Trekking", "South America Travel", "Adventure Travel"],\n  "behaviors": ["Frequent International Travelers"],\n  "exclusions": ["Tour Guides"]\n}'
    },
    creatives: [
      {
        id: 'cre-1',
        name: 'Video - Vista Panorámica Amanecer',
        format: 'Video',
        language: 'Inglés',
        angle: 'Inspiracional / Conexión Emocional',
        hypothesis: 'Mostrar el amanecer despejado genera un 30% más CTR al tocar el deseo de visitar el lugar sin aglomeraciones.',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
        metadata: '{\n  "duration_seconds": 15,\n  "aspect_ratio": "9:16",\n  "cta_text": "Reservar Ahora",\n  "overlay_badge": "Mejor Precio Garantizado"\n}'
      },
      {
        id: 'cre-2',
        name: 'Carrusel - 5 Razones para Reservar el Camino Inca Corto',
        format: 'Carrusel',
        language: 'Español',
        angle: 'Educativo / Evitación del dolor',
        hypothesis: 'Facilitar la planificación con un carrusel descriptivo reduce la tasa de rebote del lead.',
        url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
        metadata: '{\n  "slides_count": 5,\n  "has_discount_coupon": true,\n  "color_scheme": "Warm Earth"\n}'
      }
    ],
    results: {
      impressions: 245000,
      reach: 180000,
      clicks: 8900,
      conversations: 550,
      leads: 320,
      purchases: 85,
      spent: 3500,
      revenue: 25415
    }
  },
  {
    id: 'ad-camp-2',
    name: 'Google Search - Leads Camino Inca Histórico',
    product: 'camino-inca',
    platform: 'Google Ads',
    objective: 'Leads',
    budget: 4000,
    owner: 'Alejandro Ramos',
    segmentation: {
      name: 'Búsquedas de Alta Intención Compra',
      country: 'Reino Unido, Australia, Alemania',
      ageRange: '30-60',
      gender: 'Todos',
      language: 'Inglés, Alemán',
      audienceType: 'Lookalike',
      jsonConfig: '{\n  "keywords_match_phrase": ["inca trail booking", "best inca trail tours", "camino inca peru reservations"],\n  "negative_keywords": ["cheap inca trail", "free map"],\n  "bid_strategy": "Maximize Conversions"\n}'
    },
    creatives: [
      {
        id: 'cre-3',
        name: 'Anuncio de Búsqueda - Espacios Disponibles 2026',
        format: 'Imagen',
        language: 'Inglés',
        angle: 'Urgencia / Escasez',
        hypothesis: 'Destacar la escasez de cupos para el año 2026 en los títulos incrementará el volumen de conversiones de leads calificados.',
        url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
        metadata: '{\n  "headings": ["Inca Trail Permits 2026", "Book Authorized Tour Operator", "Limited Spaces Left"],\n  "description_1": "Secure your official Inca Trail trekking permit with the local experts."\n}'
      }
    ],
    results: {
      impressions: 48000,
      reach: 35000,
      clicks: 3400,
      conversations: 0, // Google search leads direct to form
      leads: 290,
      purchases: 42,
      spent: 4000,
      revenue: 27300
    }
  },
  {
    id: 'ad-camp-3',
    name: 'TikTok Ads - Humantay Aventura Joven',
    product: 'humantay',
    platform: 'TikTok Ads',
    objective: 'Conversaciones',
    budget: 1500,
    owner: 'Mariana Flores',
    segmentation: {
      name: 'Viajeros Jóvenes Latam',
      country: 'Chile, Colombia, México, Argentina',
      ageRange: '18-34',
      gender: 'Todos',
      language: 'Español',
      audienceType: 'Remarketing',
      jsonConfig: '{\n  "custom_audience_id": "visitors_last_30_days",\n  "interests": ["Hiking", "Backpacking", "South America Adventure", "Instagrammable Spots"],\n  "placements": ["TikTok Feed"]\n}'
    },
    creatives: [
      {
        id: 'cre-4',
        name: 'TikTok Reel - Tendencia de Audio + Reacción Humantay',
        format: 'Reel',
        language: 'Español',
        angle: 'Social Proof / Entretenimiento',
        hypothesis: 'Un video en formato nativo UGC (User Generated Content) con la laguna turquesa de fondo capta la atención del usuario en menos de 2 segundos.',
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
        metadata: '{\n  "tiktok_sound_used": "Epic Wandering Instrumental",\n  "ugc_creator": "Mariana CM",\n  "retention_rate_3s": "68%"\n}'
      }
    ],
    results: {
      impressions: 198000,
      reach: 142000,
      clicks: 12200,
      conversations: 920,
      leads: 185,
      purchases: 32,
      spent: 1500,
      revenue: 2848
    }
  }
];

const initialAssets = [
  { 
    id: 'as-1', 
    name: 'Logo Kommo ERP Turístico - Vector', 
    type: 'Logos', 
    product: 'city-tour', 
    date: '2026-01-02', 
    author: 'Diego Quispe', 
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    hypothesis: 'El logo limpio transmite modernidad y confianza técnica para agencias corporativas.',
    targetSegment: 'Clientes Corporativos B2B / Agencias Afiliadas'
  },
  { 
    id: 'as-2', 
    name: 'Foto Amanecer Machu Picchu Alta Res', 
    type: 'Fotos', 
    product: 'machu-picchu', 
    date: '2026-05-12', 
    author: 'Carlos Vega', 
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
    hypothesis: 'Mostrar el santuario sin aglomeraciones a primera hora apela al deseo de exclusividad y paz.',
    targetSegment: 'Viajeros de Lujo / Buscadores de Experiencias Premium'
  },
  { 
    id: 'as-3', 
    name: 'Video Promocional Humantay Drone 4K', 
    type: 'Videos', 
    product: 'humantay', 
    date: '2026-06-15', 
    author: 'Carlos Vega', 
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    hypothesis: 'La escala de la laguna turquesa vista desde arriba incrementa el CTR por su impacto visual y sensación de aventura.',
    targetSegment: 'Jóvenes Aventureros / Mochileros / Amantes del Trekking'
  },
  { 
    id: 'as-4', 
    name: 'Plantilla de Stories - Promociones Especiales', 
    type: 'Plantillas', 
    product: 'city-tour', 
    date: '2026-03-10', 
    author: 'Diego Quispe', 
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    hypothesis: 'Diseño tipo "flash sale" con colores de alto contraste para fomentar la compra impulsiva rápida.',
    targetSegment: 'Viajeros Locales / Compradores de Último Minuto'
  },
  { 
    id: 'as-5', 
    name: 'Diseño Gráfico - Mapa del Camino Inca Ilustrado', 
    type: 'Diseños', 
    product: 'camino-inca', 
    date: '2026-06-11', 
    author: 'Diego Quispe', 
    url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
    hypothesis: 'Los mapas ilustrativos ayudan a visualizar el recorrido diario, reduciendo la fricción informativa y la duda sobre el esfuerzo físico.',
    targetSegment: 'Trekking Internacional / Adultos Activos 30-55 años'
  },
  { 
    id: 'as-6', 
    name: 'Banda Sonora Original Andina - Soundscape', 
    type: 'Audios', 
    product: 'valle-sagrado', 
    date: '2026-02-15', 
    author: 'Alejandro Ramos', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    hypothesis: 'El uso de instrumentos autóctonos como la quena y zampoña en reels genera una conexión emocional inmediata con la cultura andina.',
    targetSegment: 'Turistas Culturales / Apasionados de la Antropología e Historia'
  }
];

export const MarketingProvider = ({ children }) => {
  // Load state from localStorage or fallback to initial mocks
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [collaborators, setCollaborators] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_collaborators');
    return saved ? JSON.parse(saved) : initialCollaborators;
  });

  const [annualPlans, setAnnualPlans] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_annual_plans');
    return saved ? JSON.parse(saved) : initialAnnualPlans;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [contentCalendar, setContentCalendar] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_content_calendar');
    return saved ? JSON.parse(saved) : initialContentCalendar;
  });

  const [productions, setProductions] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_productions');
    return saved ? JSON.parse(saved) : initialProductions;
  });

  const [adsCampaigns, setAdsCampaigns] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_ads_campaigns');
    return saved ? JSON.parse(saved) : initialAdCampaigns;
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_assets');
    return saved ? JSON.parse(saved) : initialAssets;
  });

  // Global filters state
  const [filters, setFilters] = useState({
    productId: 'all',
    dateRange: { start: '2026-01-01', end: '2026-12-31' },
    channel: 'all',
    owner: 'all'
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState(() => {
    const saved = localStorage.getItem('erp_marketing_integrations');
    return saved ? JSON.parse(saved) : {
      salesActive: true,
      operationsActive: true,
      accountingActive: true
    };
  });

  // Save changes to localStorage automatically on state changes
  useEffect(() => {
    localStorage.setItem('erp_marketing_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_collaborators', JSON.stringify(collaborators));
  }, [collaborators]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_annual_plans', JSON.stringify(annualPlans));
  }, [annualPlans]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_content_calendar', JSON.stringify(contentCalendar));
  }, [contentCalendar]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_productions', JSON.stringify(productions));
  }, [productions]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_ads_campaigns', JSON.stringify(adsCampaigns));
  }, [adsCampaigns]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('erp_marketing_integrations', JSON.stringify(integrationSettings));
  }, [integrationSettings]);

  // CRUD Operations

  // Annual Plan
  const updateAnnualPlan = (updatedPlan) => {
    setAnnualPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  // Campaigns
  const addCampaign = (campaign) => {
    const newCampaign = { ...campaign, id: `camp-${Date.now()}` };
    setCampaigns(prev => [newCampaign, ...prev]);
  };
  const updateCampaign = (updatedCampaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };
  const deleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Organic Content
  const addContent = (content) => {
    const newContent = { ...content, id: `post-${Date.now()}` };
    setContentCalendar(prev => [newContent, ...prev]);
  };
  const updateContent = (updatedContent) => {
    setContentCalendar(prev => prev.map(c => c.id === updatedContent.id ? updatedContent : c));
  };
  const deleteContent = (id) => {
    setContentCalendar(prev => prev.filter(c => c.id !== id));
  };

  // Productions
  const addProduction = (prod) => {
    const newProd = { ...prod, id: `prod-${Date.now()}` };
    setProductions(prev => [newProd, ...prev]);
  };
  const updateProduction = (updatedProd) => {
    setProductions(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };
  const deleteProduction = (id) => {
    setProductions(prev => prev.filter(p => p.id !== id));
  };

  // Publicidad Digital (Ad Campaigns + Segmentations + Creatives + Results)
  const addAdCampaign = (adCamp) => {
    const newAdCamp = {
      ...adCamp,
      id: `ad-camp-${Date.now()}`,
      segmentation: adCamp.segmentation || { name: 'Público Amplio', country: 'Perú', ageRange: '18-65', gender: 'Todos', language: 'Español', audienceType: 'Amplia', jsonConfig: '{}' },
      creatives: adCamp.creatives || [],
      results: adCamp.results || { impressions: 0, reach: 0, clicks: 0, conversations: 0, leads: 0, purchases: 0, spent: 0, revenue: 0 }
    };
    setAdsCampaigns(prev => [newAdCamp, ...prev]);
  };
  const updateAdCampaign = (updatedAdCamp) => {
    setAdsCampaigns(prev => prev.map(a => a.id === updatedAdCamp.id ? updatedAdCamp : a));
  };
  const deleteAdCampaign = (id) => {
    setAdsCampaigns(prev => prev.filter(a => a.id !== id));
  };

  // Collaborators
  const addCollaborator = (col) => {
    const newCol = { ...col, id: `col-${Date.now()}` };
    setCollaborators(prev => [newCol, ...prev]);
  };
  const updateCollaborator = (updatedCol) => {
    setCollaborators(prev => prev.map(c => c.id === updatedCol.id ? updatedCol : c));
  };
  const deleteCollaborator = (id) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  // Assets
  const addAsset = (asset) => {
    const newAsset = { ...asset, id: `as-${Date.now()}` };
    setAssets(prev => [newAsset, ...prev]);
  };
  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Dynamic integration metrics helpers
  const getProductMetrics = (productId) => {
    const campaignList = adsCampaigns.filter(c => productId === 'all' || c.product === productId);
    
    const totals = campaignList.reduce((acc, current) => {
      const res = current.results || { spent: 0, revenue: 0, clicks: 0, impressions: 0, leads: 0, purchases: 0 };
      return {
        spent: acc.spent + res.spent,
        revenue: acc.revenue + res.revenue,
        clicks: acc.clicks + res.clicks,
        impressions: acc.impressions + res.impressions,
        leads: acc.leads + res.leads,
        purchases: acc.purchases + res.purchases
      };
    }, { spent: 0, revenue: 0, clicks: 0, impressions: 0, leads: 0, purchases: 0 });

    const roas = totals.spent > 0 ? Number((totals.revenue / totals.spent).toFixed(2)) : 0;
    const roi = totals.spent > 0 ? Number((((totals.revenue - totals.spent) / totals.spent) * 100).toFixed(1)) : 0;
    const cac = totals.purchases > 0 ? Number((totals.spent / totals.purchases).toFixed(2)) : 0;
    const cpl = totals.leads > 0 ? Number((totals.spent / totals.leads).toFixed(2)) : 0;
    const ctr = totals.impressions > 0 ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0;
    const cpc = totals.clicks > 0 ? Number((totals.spent / totals.clicks).toFixed(2)) : 0;

    return {
      ...totals,
      roas,
      roi,
      cac,
      cpl,
      ctr,
      cpc
    };
  };

  // Helper for team member compliance calculations
  const getCollaboratorCompliance = (collaboratorName) => {
    const col = collaborators.find(c => c.name === collaboratorName);
    if (!col) return { posts: 0, reels: 0, videos: 0, totalTarget: 0, totalDone: 0, rate: 0 };

    const publishedContent = contentCalendar.filter(post => 
      post.owner === collaboratorName && post.status === 'Publicado'
    );

    const postsDone = publishedContent.filter(p => p.contentType === 'Imagen' || p.contentType === 'Carrusel' || p.contentType === 'Historia' || p.contentType === 'Artículo').length;
    const reelsDone = publishedContent.filter(p => p.contentType === 'Reel').length;
    const videosDone = publishedContent.filter(p => p.contentType === 'Video').length;

    const target = col.obligations || { posts: 0, reels: 0, videos: 0 };
    const totalTarget = target.posts + target.reels + target.videos;
    const totalDone = Math.min(postsDone, target.posts) + Math.min(reelsDone, target.reels) + Math.min(videosDone, target.videos);

    const rate = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;

    return {
      postsDone,
      reelsDone,
      videosDone,
      postsTarget: target.posts,
      reelsTarget: target.reels,
      videosTarget: target.videos,
      totalTarget,
      totalDone,
      rate
    };
  };

  // Reset context to default state
  const resetToDefault = () => {
    localStorage.clear();
    setProducts(initialProducts);
    setCollaborators(initialCollaborators);
    setAnnualPlans(initialAnnualPlans);
    setCampaigns(initialCampaigns);
    setContentCalendar(initialContentCalendar);
    setProductions(initialProductions);
    setAdsCampaigns(initialAdCampaigns);
    setAssets(initialAssets);
    setIntegrationSettings({
      salesActive: true,
      operationsActive: true,
      accountingActive: true
    });
  };

  return (
    <MarketingContext.Provider value={{
      products,
      setProducts,
      collaborators,
      annualPlans,
      updateAnnualPlan,
      campaigns,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      contentCalendar,
      addContent,
      updateContent,
      deleteContent,
      productions,
      addProduction,
      updateProduction,
      deleteProduction,
      adsCampaigns,
      addAdCampaign,
      updateAdCampaign,
      deleteAdCampaign,
      assets,
      addAsset,
      deleteAsset,
      addCollaborator,
      updateCollaborator,
      deleteCollaborator,
      filters,
      setFilters,
      integrationSettings,
      setIntegrationSettings,
      getProductMetrics,
      getCollaboratorCompliance,
      resetToDefault
    }}>
      {children}
    </MarketingContext.Provider>
  );
};
