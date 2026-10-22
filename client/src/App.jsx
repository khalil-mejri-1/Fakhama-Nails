import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import { API_BASE_URL } from './config/api';

const DEFAULT_SETTINGS = {
  phone: '(216) 92 760 840',
  phoneRaw: '+21692760840',
  whatsapp: '+21692760840',
  email: 'concierge@fakhama.nails',
  address: '482 Broome Street, 2nd Fl, New York, NY 10013',
  sanctuaryHoursWeekdays: '10:00 AM – 8:00 PM',
  sanctuaryHoursWeekends: '9:30 AM – 7:00 PM',
  sanctuaryHoursMonday: 'Private Atelier VIP Suites by Reservation Only',
  announcement: 'Haute Atelier • SoHo',
  instagram: '@fakhama.nails',
  vipDiscount: '15%'
};

const ensureDT = (price) => {
  if (!price) return '0 DT';
  let s = String(price).replace('$', '').trim();
  if (!s.toUpperCase().includes('DT')) {
    s = `${s} DT`;
  }
  return s;
};

// Luxury Haute Couture Hairline Section Divider
const SectionDivider = ({ darkMode }) => (
  <div className="w-full flex items-center justify-center pt-8 sm:pt-14 pb-2 sm:pb-3 pointer-events-none select-none" aria-hidden="true">
    <div className="flex items-center gap-3 sm:gap-4 max-w-[220px] sm:max-w-xs w-full px-4">
      <div className={`flex-1 h-[1px] bg-gradient-to-r from-transparent ${darkMode ? 'to-[#d4af37]/50' : 'to-[#d4af37]/60'}`}></div>
      <span className={`text-xs tracking-widest ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'}`}>✦</span>
      <div className={`flex-1 h-[1px] bg-gradient-to-l from-transparent ${darkMode ? 'to-[#d4af37]/50' : 'to-[#d4af37]/60'}`}></div>
    </div>
  </div>
);

const INITIAL_SERVICES = [
  {
    id: 1,
    category: 'Russian Manicure',
    title: 'The Signature Russian Manicure',
    duration: '75 Mins',
    price: '120 DT',
    tag: 'Russian E-File',
    description: 'Proprietary dry e-file diamond technique with microscope cuticle detailing, builder gel apex overlay, and pure silk finishing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCghbBmp5PC1SazlePSBTo3i2jdyaipwCiWPBL-cN0ahApERN-Az3MIepjp1GPt8uDCq8O2GauaCxT25SPui5PIM2nVbdtt1z0FA7XG0HhnUTGcG9Wd6-TfQZ0ELfajmYhx6bSQMOeo6qD3FxJNVtd6_HhURjxXP8AXbcIt7fMLDAAR0UEtfW3cGRdfz6P2WVNKsv9znLUHefpus7gJYkU4hVpsPbB_cPrS_3IK4z_Iq4QipWAbHKZ4',
    features: [
      'Diamond-grit e-file cuticle care',
      'Japanese keratin base coat',
      'Cold-pressed organic camellia oil'
    ],
    featured: false
  },
  {
    id: 2,
    category: 'Foot Spa & Pedicure',
    title: 'Royal Rose Petal & Milk Pedicure',
    duration: '90 Mins',
    price: '145 DT',
    tag: 'Floral Quartz Spa',
    description: 'Warm volcanic stone scrub, heated quartz petal bath, and deeply hydrating warm paraffin wrap for supreme restorative relaxation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChVu_LzTVEjwB5R-PqDGFVick78J5KW78a7cE0rL3OEOPPtIIzxU0gNqfnwH-yvfRbhx1wu_6RGWNbMzkWrxdkGNMoUVyCwKG4ToxtaBkfWyhjCEE388cJA7jhFq_zo-8nDtyAzZhtleWttB8MbC3AWnkmxVgVdcnBxkTr8VsncKBQ8odqfSaiFDuPJ7UCof2wQ11KDlPRHqk7mpPlbQiBVRL2Kgkok9fyhfgRJyV3OnMYzTaw0a3i',
    features: [
      'Fresh Damascus rose petal soak',
      '20-min botanical acupressure massage',
      'High-gloss breathable lacquer'
    ],
    featured: true,
    ribbon: 'Most Loved by Brides & VIPs'
  },
  {
    id: 3,
    category: 'Apres Gel-X Sculpting',
    title: 'Apres Gel-X & Sculpted Extensions',
    duration: '105 Mins',
    price: '175 DT',
    tag: 'Gel-X Sculpted',
    description: 'Zero-damage soft gel extension technology customized to your hand anatomy. Tailored shapes: Modern Almond, Tapered Square, or Coffin.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhQrKq4FAgaUgV7rjUgeMLTB65KbunDBWHnukZND01JWgID2NPzVzOdPc7XthQ-6o10lbwkKC0DqqC-XfY5cnU95nip3tXiHwPzBrr870hNPHVNtFj9GAy17RZNPbWxuGg6PJ3ms_WdPnLLhxW3ZFih5ToyHmPZmEMGVwFKaTugbN2RVqbSnUbiAqN-rP42sQ58q5JXbjIiM6KGik-PXWuqJQsnW_CWOX_DU2Xt4PupgVy4-6g57oR',
    features: [
      'Custom apex hand architecture',
      'Damage-free soak-off formula',
      'Mirror chrome or glazed nude tint'
    ],
    featured: false
  },
  {
    id: 4,
    category: 'Haute 3D Art',
    title: 'Couture 3D & Chrome Artistry',
    duration: '120 Mins',
    price: '210 DT',
    tag: '3D Pearls & Gold',
    description: 'Bespoke artisanal design session. Incorporating miniature relief sculptures, Swarovski crystals, metallic chrome, and micro-pearls.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3dG-zxXH3p2LFdHbbgOqyqMKPYU9lEm8awhIVUOGudtTfhcV5poxkFZmnOQPzcv6qcMoTPrLBO8ryZvgh-Ip988i9dNe65mNROD0LoYmK-wFzNi4ezoJ5DE0dwGKkLLKoAeWDO_Rs9AQYYNLniX0NrtG0VBVHq0M9SGdVezAaB288z8bGnwHHXKM-tIv6MNEqEK-lqsbiJgH-UcBlN1z9oYeBQ75juR56SyuImNK58hROKHaVVQwh',
    features: [
      'Pre-service moodboard consultation',
      'Hand-formed 3D gel sculptural relief',
      'Genuine Swarovski & 24k gold leaf'
    ],
    featured: false
  }
];

const INITIAL_PRESS_ON = [
  {
    id: 1,
    title: 'Café au Lait Ombré',
    price: '85 DT',
    desc: 'Sculpted Medium Almond • Includes Custom Sizing Kit',
    category: 'Press-On',
    inStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD57BFKUEmJKkm1NYi8egrqerICv8RHjRe73lwrR4STH-XZ0qI6dLWOQGFpyHlf5vWQZNRlqz4eWXyu3wRwQs5MUJsGE8fYmGKbiYtNRSK-68flMq04gF8dzcKgaGymLVhUGHQsSY9boGN1aB6S8nzjtzH-nbcRfQmwrkz6ABy9w8QC0bHVmUdQQ_W47cZKhdW993SKDZAJWVzErwUAUb6l7r8ilOOp7LAqqgGYld-zbehMSr331Xuq'
  },
  {
    id: 2,
    title: 'Midnight Gilded Velvet',
    price: '110 DT',
    desc: 'Sculpted Long Coffin • Limited Edition Capsule',
    category: 'Press-On',
    inStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZTlxx4aTtcxeG8Ac9G9lNm9nWXlWCrdkfpR0kdgdaWuc9Pl82W4GLJ6G0vW4JzcPG5PcahSHQ6OofnNsn1ZaFujcarHRI8htQrhneE4LzbRRzard3Tq01bz8Sjlb_WMlMR4mJvKtQOACVaoXky9Ksf7AnKi1Iak_PQEfzYya0HKt6jnF4eitJLoXr_zaMUV-fy-VGNZqQ99xG_PFknJA-R3yvhp8y4CDD9WnJ7wIVp3yKqGO4VFSj'
  },
  {
    id: 3,
    title: 'Silk Blossom French',
    price: '95 DT',
    desc: 'Sculpted Short Oval • Delicate Hand Painted Art',
    category: 'Press-On',
    inStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLI3GhY9dFbAdCPxPBclAaZAa-n_Yu4VD5wOibkpNVi3yeVajJr2oNk8tt6Ti4Jt8TJUxZn2qBcXbCyW_CSlyBzUwA7LP6jsvOcvMYmFJ1m3LT06yYurKg2qbZ9FZ7XF6l_CQ72VUaVzNyE4TOvuDKUgxBi0bbskaRwKPSLu_DxoTkfp7v8ROLypYxIpww2c9CMbMQ0z3JfttqVX8HYb0AcBS0Y8Tzz8hi812jDLAc8jvd1XtqVhRY'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'FKN-8492',
    clientName: 'Sophie Laurent',
    clientPhone: '+1 (917) 442-8921',
    item: 'The Signature Russian Manicure',
    type: 'Service',
    price: '120 DT',
    date: 'Aujourd\'hui, 14:30',
    status: 'Confirmée',
    notes: 'Private Suite 1 • Thé blanc et macarons demandés'
  },
  {
    id: 'FKN-8493',
    clientName: 'Elena Rostova',
    clientPhone: '+1 (212) 890-1144',
    item: 'Midnight Gilded Velvet (Press-On)',
    type: 'Produit',
    price: '110 DT',
    date: 'Aujourd\'hui, 11:15',
    status: 'En attente',
    notes: 'Taille M • Livraison coursier SoHo demandée avant 18h'
  },
  {
    id: 'FKN-8490',
    clientName: 'Camille Dubois',
    clientPhone: '+1 (646) 332-9081',
    item: 'Royal Rose Petal & Milk Pedicure',
    type: 'Service',
    price: '145 DT',
    date: 'Hier, 16:00',
    status: 'Complétée',
    notes: 'Séance VIP terminée avec succès'
  },
  {
    id: 'FKN-8488',
    clientName: 'Aria Montgomery',
    clientPhone: '+1 (347) 555-7281',
    item: 'Café au Lait Ombré (Press-On)',
    type: 'Produit',
    price: '85 DT',
    date: 'Hier, 10:20',
    status: 'Complétée',
    notes: 'Retrait en boutique effectué'
  }
];

export default function App() {
  // SPA Client Routing State
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Site Settings State (phone editable from one place, synchronizing across the whole site)
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('fakhama_site_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Background fetch to sync with Express API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data?.settings) {
          setSiteSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => { });
  }, []);

  const handleUpdateSiteSettings = (newSettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem('fakhama_site_settings', JSON.stringify(newSettings));
    } catch (e) { }
    fetch(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(() => { });
  };

  // 2. Products State (sanitized to DT currency)
  const [pressOnProducts, setPressOnProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('fakhama_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(p => ({ ...p, price: ensureDT(p.price) }));
      }
      return INITIAL_PRESS_ON;
    } catch (e) {
      return INITIAL_PRESS_ON;
    }
  });

  const handleAddProduct = (newProd) => {
    const item = { ...newProd, id: Date.now(), price: ensureDT(newProd.price) };
    const updated = [item, ...pressOnProducts];
    setPressOnProducts(updated);
    try { localStorage.setItem('fakhama_products', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => { });
  };

  const handleUpdateProduct = (id, updatedFields) => {
    const updated = pressOnProducts.map(p => {
      if (p.id === id) {
        const price = updatedFields.price !== undefined ? ensureDT(updatedFields.price) : p.price;
        return { ...p, ...updatedFields, price };
      }
      return p;
    });
    setPressOnProducts(updated);
    try { localStorage.setItem('fakhama_products', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    }).catch(() => { });
  };

  const handleDeleteProduct = (id) => {
    const updated = pressOnProducts.filter(p => p.id !== id);
    setPressOnProducts(updated);
    try { localStorage.setItem('fakhama_products', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    }).catch(() => { });
  };

  // Services State (sanitized to DT currency)
  const [serviceCards, setServiceCards] = useState(() => {
    try {
      const saved = localStorage.getItem('fakhama_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(s => ({ ...s, price: ensureDT(s.price) }));
      }
      return INITIAL_SERVICES;
    } catch (e) {
      return INITIAL_SERVICES;
    }
  });

  const handleAddService = (newSvc) => {
    const item = { ...newSvc, id: Date.now(), price: ensureDT(newSvc.price) };
    const updated = [...serviceCards, item];
    setServiceCards(updated);
    try { localStorage.setItem('fakhama_services', JSON.stringify(updated)); } catch (e) { }
  };

  const handleUpdateService = (id, updatedFields) => {
    const updated = serviceCards.map(s => {
      if (s.id === id) {
        const price = updatedFields.price !== undefined ? ensureDT(updatedFields.price) : s.price;
        return { ...s, ...updatedFields, price };
      }
      return s;
    });
    setServiceCards(updated);
    try { localStorage.setItem('fakhama_services', JSON.stringify(updated)); } catch (e) { }
  };

  const handleDeleteService = (id) => {
    const updated = serviceCards.filter(s => s.id !== id);
    setServiceCards(updated);
    try { localStorage.setItem('fakhama_services', JSON.stringify(updated)); } catch (e) { }
  };

  // 3. Orders State (sanitized to DT currency)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('fakhama_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(o => ({ ...o, price: ensureDT(o.price) }));
      }
      return INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  // Sync orders with API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => {
        if (data?.orders && data.orders.length > 0) {
          const sanitized = data.orders.map(o => ({ ...o, price: ensureDT(o.price) }));
          setOrders(sanitized);
        }
      })
      .catch(() => { });
  }, []);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    try { localStorage.setItem('fakhama_orders', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => { });
  };

  const handleDeleteOrder = (orderId) => {
    const updated = orders.filter(ord => ord.id !== orderId);
    setOrders(updated);
    try { localStorage.setItem('fakhama_orders', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'DELETE'
    }).catch(() => { });
  };

  const handleAddOrder = (newOrderData) => {
    const orderObj = {
      ...newOrderData,
      id: `FKN-${Math.floor(1000 + Math.random() * 9000)}`,
      price: ensureDT(newOrderData.price),
      date: newOrderData.date || 'À l\'instant'
    };
    const updated = [orderObj, ...orders];
    setOrders(updated);
    try { localStorage.setItem('fakhama_orders', JSON.stringify(updated)); } catch (e) { }
    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderObj)
    }).catch(() => { });
  };

  // Navigation Items Configuration
  const NAV_ITEMS = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'services', label: 'Royal Menu', href: '#services' },
    { id: 'press-on-shop', label: 'Press-On Shop', href: '#press-on-shop' },
    { id: 'lookbook', label: 'Lookbook & Proof', href: '#lookbook' },
    { id: 'hygiene', label: 'Hygiene & Safety', href: '#hygiene' },
    { id: 'sanctuary', label: 'Atelier SoHo', href: '#sanctuary' },
  ];

  // Storefront UI State
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('All Royal Rituals');
  const [galleryFilter, setGalleryFilter] = useState('All Designs (84)');
  const [modalMessage, setModalMessage] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Theme State: Dark Mode / Light Mode with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('fakhama_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return true; // Default to luxury dark mode
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fakhama_theme', darkMode ? 'dark' : 'light');
    } catch (e) { }

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#070707';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#fcf8f5';
      document.body.style.color = '#1a1a1a';
    }
  }, [darkMode]);

  // Synchronize active nav state with window URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && NAV_ITEMS.some(item => item.id === hash)) {
        setActiveNav(hash);
      } else if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#home') {
        setActiveNav('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleTheme = () => setDarkMode(prev => !prev);

  // Client actions that auto-record real orders into the Admin Dashboard
  const handleBooking = (serviceInput = 'The Signature Russian Manicure') => {
    const serviceTitle = typeof serviceInput === 'string' ? serviceInput : 'The Signature Russian Manicure';

    // Auto-create incoming order
    handleAddOrder({
      clientName: 'Visiteuse Storefront',
      clientPhone: siteSettings.phone,
      item: serviceTitle,
      type: 'Service',
      price: '120 DT',
      date: 'À l\'instant',
      status: 'En attente',
      notes: 'Demande de séance réservée depuis la page d\'accueil'
    });

    setModalMessage({
      title: 'Session Reserved for Atelier',
      detail: `Your request for "${serviceTitle}" has been placed. Our concierge will send your confirmation and VIP suite allocation via SMS to ${siteSettings.phone}.`,
    });
  };

  const handleAddToCart = (productName) => {
    setCartItemsCount(prev => prev + 1);

    // Auto-create product order
    handleAddOrder({
      clientName: 'Acheteuse Press-On Bag',
      clientPhone: siteSettings.phone,
      item: `${productName} (Press-On)`,
      type: 'Produit',
      price: '95 DT',
      date: 'À l\'instant',
      status: 'En attente',
      notes: 'Panier haute couture en attente de préparation'
    });

    setModalMessage({
      title: 'Added to Luxury Bag',
      detail: `"${productName}" ready-to-wear set has been added to your shopping bag.`,
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  const galleryItems = [
    {
      id: 1,
      artist: 'Elena V.',
      title: 'Glazed Pearl Chrome',
      subtitle: 'Subtle Elegance & Hailey Chrome Glaze',
      category: 'Glazed & Chrome',
      tag: 'N° 01 • Glazed Finish',
      dimensions: 'Large Panoramic Showcase',
      description: 'Ultra-refined glazed pearl chrome powder infused on Japanese builder structure with diamond cuticle work.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCghbBmp5PC1SazlePSBTo3i2jdyaipwCiWPBL-cN0ahApERN-Az3MIepjp1GPt8uDCq8O2GauaCxT25SPui5PIM2nVbdtt1z0FA7XG0HhnUTGcG9Wd6-TfQZ0ELfajmYhx6bSQMOeo6qD3FxJNVtd6_HhURjxXP8AXbcIt7fMLDAAR0UEtfW3cGRdfz6P2WVNKsv9znLUHefpus7gJYkU4hVpsPbB_cPrS_3IK4z_Iq4QipWAbHKZ4'
    },
    {
      id: 2,
      artist: 'Camille R.',
      title: 'Tortoiseshell & 24K Leaf',
      subtitle: 'Artisanal Tier II & Genuine 24K Gold',
      category: 'Quiet Luxury & Nude',
      tag: 'N° 02 • 24K Gold Leaf',
      dimensions: 'Regal Parisian Mirror Arch',
      description: 'Hand-blended amber tortoiseshell patterns layered with genuine 24-karat gold leaf flakes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBddrfaWBo9XVwHN0eOffbMPdXDNBWS6es1t2ngGGGONKEJuRw7NxLDcnrDayFPpFRw_TlcadycuzYFASmBN5cemGZEdK4_balrGOqRMr-LUiW3ivlFWe0BvgnmDtV1dTMy_34LadZ5aRk5KASSJ3Cjcafai6Ksw_adEG5xc5V_WtYKv6UGQWZrqBHCD-vcBbNdCUD9nJlURSiLhL_NyToizTm_26Fvmf-aCL1qoo85ovCkqFiqlhmt'
    },
    {
      id: 3,
      artist: 'Vivienne M.',
      title: 'Royal Onyx Velvet Cat-Eye',
      subtitle: 'Magnetic Luminescence & Haute Depth',
      category: 'Quiet Luxury & Nude',
      tag: 'N° 03 • Royal Velvet',
      dimensions: 'Editorial Portrait Card',
      description: 'Deep velvet cat-eye magnetic gel reacting to light angles, paired with high-gloss mirror finish.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD92bBFud4OtGbr44yl_m41Mn6NGxkMkk7O8KlUOGsvxDWdIX1Y6i_rzPnPKRyTARECLwtgZ8I9wR6_0MLgYXhhBR6SHkunl0LKJmRYZdMpSVvNu0uoHl4zT3b8zqZnrN8Z6Y6dWqTpqY76FZeQSHKr9x7rixmJVmLFNryk3QVFmyXCrbg3S_vUIQjEBpWAN0GIwfR_bJM-mmRnnn8MN2BPe8F5FgXcQ5Tc98lkkS9auIAkSgM9FAJn'
    },
    {
      id: 4,
      artist: 'Elena V.',
      title: 'Micro-French Seed Pearl',
      subtitle: 'Bridal Couture & Swarovski Accents',
      category: 'Bridal & Pearl',
      tag: 'N° 04 • Bridal Special',
      dimensions: 'High-Crown Arch Elevated',
      description: 'Hand-set micro seed pearls framing delicate French tips, designed specifically for luxury weddings.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF9LZp1bVOODJ2egRdJEsVhUQPQIPa4unu1fXt-dAOgcRPM3QY0Ix7cPulQWdxEjuew1gkPo4mYg0RxQ1dyVM-bekioGY6tm78j1qsyp27170YZxaap45OhSwLDaTmQJo-Cla6cXo6QN5VUvW7loiYOOqsKioCBTjm-ouKUR2L-h30RAt2Ll6E4XWg17vG04WmiEWqwXJrP2fDhN9WBhhvD6EkPpw2FYIY-7aF9ao3IOKD8B_-UNh5'
    },
    {
      id: 5,
      artist: 'Camille R.',
      title: 'Bridal Pearl & 24K Leaf',
      subtitle: 'Avant-Garde 3D Sculptural Gel',
      category: '3D Sculptures',
      tag: 'N° 05 • 3D Sculpting',
      dimensions: 'Sculptural Detail Card',
      description: 'Three-dimensional relief textures with encapsulated micro-pearls and hand-carved soft gel arches.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3dG-zxXH3p2LFdHbbgOqyqMKPYU9lEm8awhIVUOGudtTfhcV5poxkFZmnOQPzcv6qcMoTPrLBO8ryZvgh-Ip988i9dNe65mNROD0LoYmK-wFzNi4ezoJ5DE0dwGKkLLKoAeWDO_Rs9AQYYNLniX0NrtG0VBVHq0M9SGdVezAaB288z8bGnwHHXKM-tIv6MNEqEK-lqsbiJgH-UcBlN1z9oYeBQ75juR56SyuImNK58hROKHaVVQwh'
    },
    {
      id: 6,
      artist: 'Vivienne M.',
      title: 'Japanese Botanical Zen',
      subtitle: 'Fine Brushwork & Ink Flora',
      category: 'Modern French Twist',
      tag: 'N° 06 • Fine Art',
      dimensions: 'Panoramic Fine Brushwork Canvas',
      description: 'Microscopic single-hair brush floral strokes inspired by Kyoto botanical gardens on milky nude canvas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFlAZiF3vB9tcZ4EqWIH9MtTYo6IdQUlU1pJYLVbgG9yYNuP7PqJJwo5tYy0s75nN4YLwjLLIIY6J-FwkL8gK0BzdvoxlUbzps989uSixiEMQuoRLi-n8qdKzpB3WjNgwjEccxccUY4S5UaQxVrZGrWyalsfuH-7NksRVBGrzsckRott2hubpo3Xgz2vTw7-dunMbUxdzbynH8oXbXpsFWaHPM3C30d5DxlQRIHfzN3sjFWRkjKmS6'
    }
  ];

  // =========================================================================
  // ROUTING: IF CURRENT ROUTE IS /admin, RENDER THE LUXURY ADMIN DASHBOARD
  // =========================================================================
  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return (
      <AdminDashboard
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        products={pressOnProducts}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        services={serviceCards}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onAddOrder={handleAddOrder}
        onNavigateToStore={() => navigateTo('/')}
      />
    );
  }

  return (
    <div className={`${darkMode ? 'bg-[#070707] text-white selection:bg-[#d4af37]/30 selection:text-white' : 'bg-[#fcf8f5] text-[#1a1a1a] selection:bg-[#d4af37]/30 selection:text-black'} font-body-md antialiased min-h-screen transition-colors duration-300`}>

      {/* Toast Notification / Booking Confirmation Modal */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className={`${darkMode ? 'bg-[#121212]/92 text-white border-[#d4af37]/50 shadow-[0_25px_80px_rgba(0,0,0,0.95)]' : 'bg-white/75 backdrop-blur-2xl text-zinc-900 border-[#d4af37]/45 shadow-[0_25px_80px_rgba(212,175,55,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)]'} rounded-3xl p-8 max-w-md w-full border-2 relative backdrop-blur-2xl`}>
            <button
              onClick={() => setModalMessage(null)}
              className={`absolute top-4 right-4 ${darkMode ? 'text-white/50 hover:text-white bg-white/10' : 'text-zinc-400 hover:text-black bg-zinc-100/80'} text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer`}
            >
              ✕
            </button>
            <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-black text-[#ffe08d]' : 'bg-[#fffdf7] text-amber-700'} border border-[#d4af37]/70 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <span className="material-symbols-outlined text-3xl text-[#d4af37]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <h3 className={`font-display-hero text-2xl text-center font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {modalMessage.title}
            </h3>
            <p className={`font-body-md text-center text-sm mb-6 leading-relaxed ${darkMode ? 'text-white/80' : 'text-zinc-600'}`}>
              {modalMessage.detail}
            </p>
            <button
              onClick={() => setModalMessage(null)}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-lg uppercase tracking-widest text-xs font-extrabold border border-[#d4af37] shadow-lg transition-all hover:brightness-110 cursor-pointer"
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}

      {/* Editorial High-Resolution Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className={`${darkMode ? 'bg-[#0a0a0a]/95 text-[#fbf6f0] border-[#d4af37]/50 shadow-[0_25px_70px_rgba(0,0,0,0.8)]' : 'bg-white/80 backdrop-blur-2xl text-zinc-900 border-[#d4af37]/45 shadow-[0_25px_70px_rgba(212,175,55,0.2),inset_0_1px_2px_rgba(255,255,255,0.95)]'} rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border relative grid grid-cols-1 md:grid-cols-12 animate-scaleUp`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-[#ffe08d] hover:text-white text-lg sm:text-xl w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/60 border border-[#d4af37]/40 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Left: Image Preview */}
            <div className="md:col-span-7 relative h-60 sm:h-80 md:h-auto md:min-h-[380px] bg-black overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#d4af37]/30">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-burgundy/85 border border-[#d4af37]/60 backdrop-blur-md text-[#ffe08d] font-label-sm text-[0.6875rem] sm:text-xs tracking-wider uppercase font-bold">
                {lightboxItem.tag || 'Couture Selection'}
              </div>
            </div>

            {/* Right: Editorial Detail */}
            <div className={`md:col-span-5 p-5 sm:p-7 md:p-8 flex flex-col justify-between ${darkMode ? 'bg-gradient-to-b from-[#181818] to-[#0a0a0a]' : 'bg-gradient-to-b from-[#fcf9f6] to-[#f6efe7]'}`}>
              <div>
                <span className="font-label-sm text-[0.6875rem] sm:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1.5">
                  Atelier Fakhama • Archive
                </span>
                <h3 className={`font-display-hero text-xl sm:text-2xl md:text-3xl font-bold mb-2.5 leading-tight ${darkMode ? 'text-[#ffe08d]' : 'text-zinc-900'}`}>
                  {lightboxItem.title}
                </h3>
                <p className={`font-label-sm text-xs uppercase tracking-wider mb-4 pb-3 sm:pb-4 border-b border-[#d4af37]/20 ${darkMode ? 'text-[#d5c3aa]' : 'text-zinc-600'}`}>
                  Master Artist: <span className="text-[#d4af37] font-bold">{lightboxItem.artist}</span> • {lightboxItem.category}
                </p>
                <p className={`font-body-md text-sm leading-relaxed mb-6 ${darkMode ? 'text-[#e6dad1]' : 'text-zinc-700'}`}>
                  {lightboxItem.description || lightboxItem.subtitle}
                </p>

                <div className="space-y-2 mb-6">
                  <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-[#d5c3aa]' : 'text-zinc-600'}`}>
                    <span className="material-symbols-outlined text-sm text-[#d4af37]">verified</span>
                    <span>100% Medical E-file Russian Technique</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-[#d5c3aa]' : 'text-zinc-600'}`}>
                    <span className="material-symbols-outlined text-sm text-[#d4af37]">spa</span>
                    <span>Japanese Non-Toxic Botanical Gel Base</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-[#d5c3aa]' : 'text-zinc-600'}`}>
                    <span className="material-symbols-outlined text-sm text-[#d4af37]">timer</span>
                    <span>4 to 6 Weeks Impeccable Retention</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  onClick={() => {
                    const title = lightboxItem.title;
                    setLightboxItem(null);
                    handleBooking(title);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] hover:brightness-110 text-black font-label-md uppercase tracking-widest text-xs font-extrabold shadow-lg transition-all cursor-pointer"
                >
                  Book This Exact Design
                </button>
                <button
                  onClick={() => setLightboxItem(null)}
                  className={`w-full py-2.5 rounded-full ${darkMode ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-700 hover:text-black'} font-label-sm uppercase tracking-wider text-xs transition-colors cursor-pointer`}
                >
                  Close Archive View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC THEMED HEADER WITH LUXURY GLASSMORPHISM */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none transition-all duration-300">
        <div className={`w-full pointer-events-auto border-b backdrop-blur-3xl transition-all duration-300 ${darkMode
          ? 'bg-[#080808]/90 border-[#d4af37]/25 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-white'
          : 'bg-white/45 backdrop-saturate-180 border-[#d4af37]/30 shadow-[0_8px_32px_rgba(212,175,55,0.12),inset_0_1px_2px_rgba(255,255,255,0.95)] text-zinc-900'
          }`}>
          <div className="h-16 sm:h-20 w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">

            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              <a href="#home" onClick={() => setActiveNav('home')} className="flex items-center justify-center shrink-0 group cursor-pointer py-1">
                <div
                  style={{ width: '3.25rem', height: '3.25rem', minWidth: '3.25rem', minHeight: '3.25rem' }}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${darkMode ? 'bg-[#141414] border-[#d4af37]/50' : 'bg-white/80 backdrop-blur-md border-[#d4af37]/50 shadow-sm'} border shadow-md flex items-center justify-center p-1.5 shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105`}
                >
                  <img
                    src="/logo.png"
                    alt="Fakhama Nails Logo"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                  />
                </div>
              </a>
              <a className="flex flex-col cursor-pointer" href="#home" onClick={() => setActiveNav('home')}>
                <span className={`font-display-hero text-lg xs:text-xl sm:text-2xl lg:text-[1.65rem] tracking-tight font-semibold leading-none ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Fakhama Nails</span>
                <span className={`font-label-sm text-[0.55rem] xs:text-[0.625rem] sm:text-[0.65rem] tracking-[0.2em] xs:tracking-[0.28em] uppercase mt-1 font-bold ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'}`}>{siteSettings.announcement || 'Haute Atelier • SoHo'}</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveNav(item.id)}
                    className={`text-xs uppercase tracking-widest transition-all duration-300 relative py-1 cursor-pointer select-none ${
                      isActive
                        ? `font-bold ${darkMode ? 'text-[#ffe08d]' : 'text-amber-900'} after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#ffe08d] after:via-[#d4af37] after:to-[#b38f26] after:rounded-full after:shadow-[0_2px_8px_rgba(212,175,55,0.6)]`
                        : `font-semibold ${darkMode ? 'text-white/80 hover:text-[#ffe08d]' : 'text-zinc-700 hover:text-amber-900'} hover:after:content-[''] hover:after:absolute hover:after:-bottom-1.5 hover:after:left-0 hover:after:w-full hover:after:h-[1.5px] hover:after:bg-[#d4af37]/40`
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Action CTAs & Theme Toggle */}
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 shrink-0">
              {/* Dynamic Phone Link from Site Settings */}
              <a className={`hidden sm:flex items-center gap-1.5 transition-colors text-xs font-medium tracking-wider ${darkMode ? 'text-white/85 hover:text-[#ffe08d]' : 'text-zinc-700 hover:text-amber-900'}`} href={`tel:${siteSettings.phoneRaw}`}>
                <span className="material-symbols-outlined text-sm text-[#d4af37]">call</span>
                <span className="uppercase font-semibold">{siteSettings.phone}</span>
              </a>

              {/* Shopping Bag Icon with counter */}
              <a href="#press-on-shop" className={`relative p-2 transition-colors ${darkMode ? 'text-[#ffe08d] hover:text-white' : 'text-amber-800 hover:text-black'}`} title="Panier d'achats">
                <span className="material-symbols-outlined text-xl">shopping_bag</span>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[0.625rem] font-black flex items-center justify-center border border-black shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </a>

              {/* THEME TOGGLE BUTTON (Light Mode / Dark Mode Switch) */}
              <button
                id="theme-toggle-desktop"
                onClick={toggleTheme}
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                title={darkMode ? 'Passer en Mode Clair (Light Mode)' : 'Passer en Mode Sombre (Dark Mode)'}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer group transform hover:scale-105 active:scale-95 ${darkMode
                  ? 'bg-[#151515] border-[#d4af37]/50 hover:border-[#ffe08d] text-[#ffe08d] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-white/75 backdrop-blur-md border-[#d4af37]/60 hover:bg-white text-amber-900 shadow-[0_2px_10px_rgba(212,175,55,0.12)]'
                  }`}
              >
                <span className="material-symbols-outlined text-base sm:text-lg transition-transform duration-500 group-hover:rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span className="hidden sm:inline font-label-sm text-[0.65rem] uppercase tracking-wider font-bold">
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>

              {/* Reserve Atelier Button */}
              <a className="hidden md:inline-flex items-center justify-center px-4 lg:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black text-[0.7rem] uppercase tracking-widest font-extrabold shadow-[0_0_20px_rgba(212,175,55,0.35)] border border-[#d4af37] hover:brightness-110 transition-all transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer" href="#services">
                Reserve Atelier
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer ${darkMode
                  ? 'text-[#ffe08d] bg-white/5 border-white/10 hover:bg-white/10'
                  : 'text-amber-950 bg-white/60 backdrop-blur-md border-[#d4af37]/40 shadow-xs hover:bg-white/85'
                  }`}
                aria-label="Toggle menu"
              >
                <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE & TABLET HAUTE COUTURE LUXURY SIDE DRAWER (النافذة الجانبية) */}
        {/* ============================================================== */}
        {/* Backdrop Overlay with Fluid Fade In/Out Animation */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] transition-opacity duration-400 ease-in-out ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!mobileMenuOpen}
        />

        {/* Sliding Side Drawer Panel */}
        <aside
          aria-label="Mobile Navigation Menu"
          className={`fixed top-0 right-0 bottom-0 h-full w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[380px] z-[100] flex flex-col justify-between shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
          } ${
            darkMode
              ? 'bg-[#0c0c0c] border-l border-[#d4af37]/30 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.85)]'
              : 'bg-[#fcf9f5] border-l border-[#d4af37]/40 text-zinc-900 shadow-[-20px_0_50px_rgba(0,0,0,0.18)]'
          }`}
        >
          {/* Drawer Top Bar: Brand Monogram & Close Button */}
          <div className={`p-5 sm:p-6 flex items-center justify-between border-b ${
            darkMode ? 'bg-[#121212] border-white/10' : 'bg-[#f6eee4] border-[#d4af37]/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full p-1 border flex items-center justify-center shrink-0 shadow-sm ${
                darkMode
                  ? 'bg-gradient-to-br from-[#ffe08d]/25 to-transparent border-[#d4af37]/50'
                  : 'bg-white border-[#d4af37]/60'
              }`}>
                <img
                  src="/logo.png"
                  alt="Fakhama Nails Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-display text-base font-semibold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Fakhama Nails
                </span>
                <span className={`text-[0.6rem] uppercase tracking-[0.25em] font-semibold mt-0.5 ${darkMode ? 'text-[#ffe08d]' : 'text-amber-900'}`}>
                  Haute Atelier • SoHo
                </span>
              </div>
            </div>

            {/* Circular Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                darkMode
                  ? 'border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-[#ffe08d] hover:bg-white/10'
                  : 'border-[#d4af37]/40 bg-white text-zinc-800 hover:text-amber-950 hover:bg-amber-50 shadow-xs'
              }`}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Navigation Links Area (Clean, Airy, Haute Couture - NO lines below buttons!) */}
          <div className={`flex-1 overflow-y-auto px-5 sm:px-6 py-6 flex flex-col gap-2 ${
            darkMode ? 'bg-[#0c0c0c]' : 'bg-[#fcf9f5]'
          }`}>
            <span className={`text-[0.65rem] uppercase tracking-[0.28em] font-extrabold px-3 mb-1 ${
              darkMode ? 'text-[#ffe08d]/80' : 'text-amber-900'
            }`}>
              Navigation Menu
            </span>

            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeNav === item.id;
              const numStr = `0${idx + 1}`;
              return (
                <a
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`group relative py-3 px-3.5 rounded-xl transition-all duration-300 flex items-center justify-between cursor-pointer select-none ${
                    isActive
                      ? `${
                          darkMode
                            ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-transparent border border-[#d4af37]/40 text-[#ffe08d] font-bold'
                            : 'bg-gradient-to-r from-amber-200/60 via-amber-100/50 to-transparent border border-[#d4af37]/50 text-amber-950 font-bold shadow-xs'
                        }`
                      : `${
                          darkMode
                            ? 'text-white/85 hover:text-[#ffe08d] hover:bg-white/5 hover:translate-x-1 font-medium'
                            : 'text-zinc-800 hover:text-amber-950 hover:bg-amber-900/5 hover:translate-x-1 font-semibold'
                        }`
                  }`}
                  href={item.href}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono tracking-wider transition-colors ${
                      isActive
                        ? darkMode ? 'text-[#d4af37] font-bold' : 'text-amber-950 font-black'
                        : darkMode ? 'text-zinc-500 group-hover:text-[#d4af37]' : 'text-[#b38f26] font-bold'
                    }`}>
                      {numStr}
                    </span>
                    <span className="text-sm uppercase tracking-[0.16em]">
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]"></span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Drawer Footer: Reserve Button & Atelier Details */}
          <div className={`p-5 sm:p-6 border-t flex flex-col gap-3.5 ${
            darkMode ? 'border-white/10 bg-[#121212]' : 'border-[#d4af37]/30 bg-[#f6eee4]'
          }`}>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black text-center font-label-lg uppercase tracking-widest text-xs font-extrabold shadow-[0_6px_20px_rgba(212,175,55,0.35)] border border-[#ffe08d] hover:brightness-105 transition-all cursor-pointer"
              href="#services"
            >
              Reserve Atelier
            </a>

            {/* Quick Atelier Details */}
            <div className="flex items-center justify-between pt-1 px-1 text-[0.7rem]">
              <a
                href={`tel:${siteSettings.phoneRaw}`}
                className={`flex items-center gap-1.5 transition-colors font-semibold ${
                  darkMode ? 'text-white/75 hover:text-[#ffe08d]' : 'text-zinc-700 hover:text-amber-950'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-[#d4af37]">call</span>
                <span>{siteSettings.phone}</span>
              </a>

              <span className={`tracking-wider font-medium ${darkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                SoHo • New York
              </span>
            </div>
          </div>
        </aside>
      </header>

      {/* MAIN CONTAINER */}
      <main className={`w-full pt-16 sm:pt-20 transition-colors duration-300 ${darkMode ? 'bg-[#070707]' : 'bg-[#fcf8f5]'}`}>
        <div className="flex flex-col w-full">

          {/* ============================================================== */}
          {/* SECTION 1: HERO SECTION - Grand Haute Couture Presentation    */}
          {/* ============================================================== */}
          <section className={`relative w-full overflow-hidden transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#060607] via-[#0b0b0e] to-[#070709] text-white'
            : 'bg-gradient-to-b from-[#fbf8f5] via-[#f7f0e7] to-[#f2e7dc] text-[#1a1a1a]'
            } pt-12 sm:pt-18 lg:pt-28 pb-20 sm:pb-28 lg:pb-36`} id="home">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

                {/* Left: Refined luxury copy */}
                <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-8">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-md mb-4 sm:mb-6 ${darkMode ? 'bg-[#141414] border-[#d4af37]/50' : 'bg-white border-[#d4af37]/60 shadow-sm'
                    }`}>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#d4af37] animate-pulse"></span>
                    <span className={`text-[0.65rem] xs:text-xs uppercase tracking-[0.16em] sm:tracking-[0.24em] font-extrabold ${darkMode ? 'text-[#ffe08d]' : 'text-amber-900'
                      }`}>
                      Fakhama Nails • SoHo Luxury Sanctuary
                    </span>
                  </div>

                  <h1 className={`font-display-hero text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] tracking-tight mb-4 sm:mb-6 leading-[1.12] sm:leading-[1.08] font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                    Where Artistry Meets <span className={`italic font-normal font-display-hero block lg:inline ${darkMode
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#ffe08d]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-[#d4af37] to-amber-800'
                      }`}>Pure Royal Couture</span>
                  </h1>

                  <p className={`font-body-md text-sm sm:text-base lg:text-lg max-w-xl mb-7 sm:mb-9 leading-relaxed font-normal ${darkMode ? 'text-white/80' : 'text-zinc-600'
                    }`}>
                    Experience bespoke Japanese gel mastery, clinical hospital-grade autoclave sterilization, and runway-tier hand-sculpted nail art tailored for the discerning woman in our light-drenched SoHo atelier.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
                    <a
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black text-xs font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-[#d4af37] hover:brightness-110 transition-all duration-300 transform hover:-translate-y-1 group text-center cursor-pointer"
                      href="#services"
                    >
                      <span>Reserve a Session</span>
                      <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1.5 text-black">arrow_forward</span>
                    </a>
                    <a
                      className={`w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest border border-[#d4af37]/40 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center cursor-pointer backdrop-blur-md ${darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white hover:bg-amber-50 text-zinc-900 border-[#d4af37]/50'
                        }`}
                      href="#lookbook"
                    >
                      Explore Lookbook
                    </a>
                  </div>
                </div>

                {/* Right: Editorial showcase frame with double gold halo & Ambient Glow */}
                <div className="lg:col-span-5 relative mt-8 sm:mt-12 lg:mt-0">
                  <div className="relative mx-auto max-w-[340px] xs:max-w-[400px] sm:max-w-[440px] lg:max-w-none">

                    {/* Ambient Champagne Gold Luxury Backlight */}
                    <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-[#d4af37]/25 via-amber-500/15 to-transparent rounded-t-[14rem] sm:rounded-t-[16rem] rounded-b-3xl blur-3xl -z-10 opacity-70 pointer-events-none"></div>

                    {/* Outer and inner champagne gold halo framing */}
                    <div className={`p-2 sm:p-2.5 rounded-t-[12rem] xs:rounded-t-[14.5rem] rounded-b-[2rem] border-2 border-[#d4af37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${darkMode ? 'bg-gradient-to-b from-[#181818] via-[#121212] to-[#080808]' : 'bg-gradient-to-b from-white via-[#fcf8f4] to-[#f5ede5]'
                      }`}>
                      <div className="relative overflow-hidden rounded-t-[11.5rem] xs:rounded-t-[14rem] rounded-b-2xl aspect-[3/4] bg-[#0a0a0a] border border-[#d4af37]/50 shadow-inner group">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt="Editorial close up of immaculate feminine hands with glazed pearl almond chrome nails and minimalist solid gold knuckle rings holding a delicate pale blush peony in soft diffuse daylight, haute couture beauty photography"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVz81lDR88FebJZPE565tZvYa1SkU3dhqshG_tJxeLdQbXf8fTdrsCyEtMtXyZZDCfA343nPtrbf57tj4rkpLXKi7BhtFQ3Il8zgUpkg84qEY125xDVNu24TUVJrM3KbKWsTBLDrJGBqeboI9ri3uZ9S0Edz6NEAgL1_ZQfTbWWXkl7CFORuyC1kSCSSmthDipJRb-T6iLrGMQsUIkc7j3ESQxOR842wR7UIyKb6cHAo8BBtE7Ksj0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                    </div>

                    {/* Floating 3D Glassmorphic Trust Badges */}
                    <div className={`absolute -bottom-4 left-2 sm:-bottom-6 sm:left-2 p-3 sm:p-4 rounded-2xl backdrop-blur-xl border border-[#d4af37]/60 shadow-[0_16px_36px_rgba(0,0,0,0.4)] max-w-[240px] xs:max-w-[280px] ${darkMode ? 'bg-[#121212]/95 text-white' : 'bg-white/95 text-zinc-900'
                      }`}>
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black border border-[#d4af37]/70 flex items-center justify-center text-[#ffe08d] shrink-0 shadow-md">
                          <span className="material-symbols-outlined text-lg sm:text-xl text-[#d4af37]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-widest font-extrabold ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'}`}>Autoclave Verified</span>
                          <span className={`text-xs sm:text-sm font-bold leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>100% Medical Grade</span>
                          <span className={`text-[0.55rem] sm:text-[0.625rem] font-medium ${darkMode ? 'text-white/70' : 'text-zinc-500'}`}>Class-B Steam Sterilization</span>
                        </div>
                      </div>
                    </div>

                    <div className={`absolute top-10 -right-2 sm:-right-6 p-2.5 sm:p-3.5 rounded-2xl backdrop-blur-xl border border-[#d4af37]/50 shadow-xl hidden xs:flex items-center gap-2 sm:gap-2.5 max-w-[200px] sm:max-w-[220px] ${darkMode ? 'bg-[#121212]/95 text-white' : 'bg-white/95 text-zinc-900'
                      }`}>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black border border-[#d4af37]/70 flex items-center justify-center text-[#ffe08d] shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-base sm:text-lg text-[#d4af37]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                      <div>
                        <span className={`text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider font-extrabold block ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'}`}>VIP Choice</span>
                        <span className={`text-[0.7rem] sm:text-xs font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>4.9★ by 2,000+ Women</span>
                      </div>
                    </div>

                    {/* Atelier Detail Stamp */}
                    <div className={`absolute -top-4 left-4 sm:-top-5 sm:left-6 hidden sm:flex w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#d4af37] shadow-[0_8px_25px_rgba(212,175,55,0.35)] items-center justify-center p-2 text-center backdrop-blur-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-[#121212]/95 text-white' : 'bg-white/95 text-zinc-900'
                      }`}>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[0.48rem] sm:text-[0.52rem] tracking-[0.24em] uppercase text-[#d4af37] font-bold">
                          Maison
                        </span>
                        <span className="text-[0.58rem] sm:text-[0.66rem] leading-tight uppercase tracking-wider font-extrabold my-0.5">
                          Haute<br />Couture
                        </span>
                        <span className="text-[0.48rem] sm:text-[0.52rem] tracking-[0.2em] uppercase text-[#d4af37] font-semibold">
                          Atelier
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: Services & Pricing Showcase ('The Royal Atelier Menu') */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#0d0a07] via-[#14100b] to-[#0c0906] text-white'
            : 'bg-gradient-to-b from-[#f5ede3] via-[#ede0d0] to-[#f4ebe1] text-[#1a1a1a]'
            }`} id="services">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">

              <div className="mb-10 sm:mb-14">
                <span className={`font-label-md text-[0.6875rem] sm:text-label-md uppercase tracking-[0.24em] font-bold mb-1.5 sm:mb-2 block ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'
                  }`}>
                  Haute Couture Offerings
                </span>
                <h2 className={`font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                  The Royal Atelier Menu
                </h2>
              </div>

              {/* Filter Frame Container with Professional Luxury Border & Styling */}
              <div className="relative mb-10 sm:mb-14 max-w-full">

                {/* Mobile Swipe Cue Banner */}
                <div className="flex sm:hidden items-center justify-between px-2 mb-2">
                  <span className={`text-[0.6875rem] font-bold uppercase tracking-wider ${darkMode ? 'text-[#ffe08d]' : 'text-amber-800'}`}>
                    Filter Rituals
                  </span>
                  <div className={`inline-flex items-center gap-1 text-[0.625rem] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border shadow-xs ${darkMode ? 'bg-white/5 border-[#d4af37]/40 text-zinc-300' : 'bg-white border-[#d4af37]/40 text-zinc-700'}`}>
                    <span>Swipe</span>
                    <span className="material-symbols-outlined text-xs text-[#d4af37] animate-pulse">arrow_forward</span>
                  </div>
                </div>

                {/* Outer Glassmorphic Frame */}
                <div className={`relative p-1.5 sm:p-2 rounded-2xl sm:rounded-full border shadow-sm backdrop-blur-md overflow-hidden ${darkMode
                  ? 'bg-[#121215]/90 border-[#d4af37]/35 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                  : 'bg-white/90 border-[#d4af37]/40 shadow-[0_4px_20px_rgba(212,175,55,0.12)]'
                  }`}>

                  {/* Subtle Right Edge Fade Indicator on Mobile to Show More Content Lies Beyond */}
                  <div className={`absolute top-0 right-0 bottom-0 w-12 sm:hidden pointer-events-none z-10 flex items-center justify-end pr-1.5 bg-gradient-to-l ${darkMode
                    ? 'from-[#121215] via-[#121215]/80 to-transparent'
                    : 'from-white via-white/80 to-transparent'
                    }`}>
                    <span className="material-symbols-outlined text-sm text-[#d4af37] animate-pulse">
                      chevron_right
                    </span>
                  </div>

                  {/* Scrollable Buttons Row */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pr-10 sm:pr-0">
                    {['All Royal Rituals', 'Russian Manicure', 'Foot Spa & Pedicure', 'Apres Gel-X Sculpting', 'Haute 3D Art'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setServiceFilter(filter)}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-label-md text-xs sm:text-label-md uppercase tracking-wider transition-all duration-300 whitespace-nowrap font-bold cursor-pointer shrink-0 ${serviceFilter === filter
                          ? 'bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black shadow-md border border-[#ffe08d]'
                          : darkMode
                            ? 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-transparent'
                            : 'bg-transparent text-zinc-700 hover:text-black hover:bg-black/5 border border-transparent'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Cards Grid with Creative Haute Couture Palettes in Dark Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 items-stretch pt-6 sm:pt-8">
                {serviceCards
                  .filter(card => serviceFilter === 'All Royal Rituals' || card.category === serviceFilter)
                  .map((card) => {
                    // Creative Luxury Haute Couture Jewel Palettes applied in both Light & Dark modes
                    const cardTheme = (() => {
                      if (card.featured) {
                        // Card 2: Royal Gold Velvet & Amber Quartz
                        return {
                          container: 'bg-gradient-to-b from-[#3a2c17] via-[#271d0e] to-[#150f06] border-2 border-[#ffe08d] shadow-[0_22px_60px_rgba(212,175,55,0.45),0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_26px_75px_rgba(212,175,55,0.65)] ring-1 ring-[#ffe08d]/50',
                          badge: 'bg-[#ffe08d]/20 text-[#ffe08d] border-[#ffe08d]/60',
                          button: 'bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black border border-[#fff2b2] shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:brightness-110'
                        };
                      }

                      switch (card.id) {
                        case 1:
                          // Card 1: Imperial Sapphire-Titanium Slate
                          return {
                            container: 'bg-gradient-to-b from-[#1c2533] via-[#131b26] to-[#0a0e14] border-2 border-[#6ea0cc]/50 hover:border-[#ffe08d] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_30px_rgba(110,160,204,0.22)] hover:shadow-[0_25px_65px_rgba(212,175,55,0.4)]',
                            badge: 'bg-[#6ea0cc]/20 text-[#c2dcfa] border-[#6ea0cc]/50',
                            button: 'bg-[#141b26] hover:bg-gradient-to-r hover:from-[#ffe08d] hover:via-[#d4af37] hover:to-[#b38f26] hover:text-black text-[#d9e8f7] border border-[#6ea0cc]/60 hover:border-[#ffe08d] shadow-[0_0_15px_rgba(110,160,204,0.2)]'
                          };
                        case 3:
                          // Card 3: Burnished Copper-Bronze & Sunset Amber
                          return {
                            container: 'bg-gradient-to-b from-[#322015] via-[#24160e] to-[#140c07] border-2 border-[#e6985a]/50 hover:border-[#ffe08d] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_30px_rgba(230,152,90,0.22)] hover:shadow-[0_25px_65px_rgba(212,175,55,0.4)]',
                            badge: 'bg-[#e6985a]/20 text-[#fcd3b6] border-[#e6985a]/50',
                            button: 'bg-[#22150d] hover:bg-gradient-to-r hover:from-[#ffe08d] hover:via-[#d4af37] hover:to-[#b38f26] hover:text-black text-[#fde3d2] border border-[#e6985a]/60 hover:border-[#ffe08d] shadow-[0_0_15px_rgba(230,152,90,0.2)]'
                          };
                        case 4:
                          // Card 4: Royal Midnight Amethyst & Platinum Noir
                          return {
                            container: 'bg-gradient-to-b from-[#2d1a38] via-[#1f1027] to-[#120818] border-2 border-[#c885ea]/50 hover:border-[#ffe08d] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_30px_rgba(200,133,234,0.22)] hover:shadow-[0_25px_65px_rgba(212,175,55,0.4)]',
                            badge: 'bg-[#c885ea]/20 text-[#e9c1fb] border-[#c885ea]/50',
                            button: 'bg-[#1f0f29] hover:bg-gradient-to-r hover:from-[#ffe08d] hover:via-[#d4af37] hover:to-[#b38f26] hover:text-black text-[#f4dcfd] border border-[#c885ea]/60 hover:border-[#ffe08d] shadow-[0_0_15px_rgba(200,133,234,0.2)]'
                          };
                        default:
                          return {
                            container: 'bg-gradient-to-b from-[#261f17] via-[#1a150e] to-[#100d08] border-2 border-[#d4af37]/45 hover:border-[#ffe08d] shadow-[0_18px_50px_rgba(0,0,0,0.45),0_0_25px_rgba(212,175,55,0.18)] hover:shadow-[0_22px_60px_rgba(212,175,55,0.35)]',
                            badge: 'bg-[#d4af37]/15 text-[#ffe08d] border-[#d4af37]/40',
                            button: 'bg-[#1e1811] hover:bg-gradient-to-r hover:from-[#ffe08d] hover:via-[#d4af37] hover:to-[#b38f26] hover:text-black text-[#ffe08d] border border-[#d4af37]/60 hover:border-[#ffe08d]'
                          };
                      }
                    })();

                    return (
                      <div
                        key={card.id}
                        className={`p-5 xs:p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl max-w-[360px] xs:max-w-[380px] sm:max-w-none mx-auto w-full flex flex-col justify-between group transition-all duration-500 text-white relative transform hover:-translate-y-1.5 ${card.featured ? 'lg:-translate-y-2.5' : ''} ${cardTheme.container}`}
                      >
                        {/* Specular Highlight Line at the Top of the Card */}
                        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffe08d]/60 to-transparent pointer-events-none rounded-full"></div>

                        {card.featured && (
                          <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-widest font-black shadow-[0_4px_25px_rgba(212,175,55,0.65)] whitespace-nowrap flex items-center gap-1.5 border-2 border-[#fff2b2] z-30">
                            <span className="material-symbols-outlined text-xs sm:text-sm text-black" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span>{card.ribbon}</span>
                          </div>
                        )}

                        <div>
                          {/* Thumbnail Preview */}
                          <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 sm:mb-6 border border-[#d4af37]/40 relative bg-black mt-1 sm:mt-2 shadow-inner">
                            <img alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" src={card.image} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <span className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/90 text-[#ffe08d] border border-[#d4af37]/60 font-label-sm text-[0.6rem] sm:text-[0.65rem] font-bold tracking-wider uppercase backdrop-blur-md shadow-md">
                              {card.tag}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-label-sm text-[0.625rem] sm:text-label-sm uppercase tracking-wider font-bold border shadow-xs ${cardTheme.badge}`}>
                              <span className="material-symbols-outlined text-[0.75rem] sm:text-xs">schedule</span>
                              <span>{card.duration}</span>
                            </span>
                            <span className="font-headline-sm text-xl sm:text-2xl font-display-hero font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#f5d77f] drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">
                              {card.price}
                            </span>
                          </div>

                          <h3 className="font-title-lg text-base sm:text-lg lg:text-xl font-bold mb-1.5 sm:mb-2.5 text-white group-hover:text-[#ffe08d] transition-colors leading-snug">
                            {card.title}
                          </h3>

                          <p className="font-body-sm text-[0.75rem] sm:text-xs lg:text-sm mb-3 sm:mb-5 leading-normal sm:leading-relaxed text-zinc-300 font-light">
                            {card.description}
                          </p>

                          <ul className="space-y-1.5 sm:space-y-2.5 mb-4 sm:mb-7">
                            {card.features.map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-1.5 sm:gap-2 font-body-sm text-[0.75rem] sm:text-xs lg:text-sm text-zinc-200">
                                <span className="material-symbols-outlined text-xs sm:text-sm text-[#d4af37] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => handleBooking(card.title)}
                          className={`w-full py-3 sm:py-3.5 rounded-full font-label-md text-xs sm:text-label-md uppercase tracking-wider transition-all duration-300 font-extrabold cursor-pointer transform hover:scale-[1.02] ${cardTheme.button}`}
                        >
                          Select & Book
                        </button>
                      </div>
                    );
                  })}
              </div>

            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: Lookbook & Nail Art Gallery + Before/After Proof    */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#05070a] via-[#090d14] to-[#050609] text-white'
            : 'bg-gradient-to-b from-[#ffffff] via-[#fbf9f6] to-[#f6f2ec] text-zinc-900'
            }`} id="lookbook">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">

              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                <span className="font-label-md text-[0.6875rem] sm:text-label-md uppercase tracking-[0.24em] text-[#d4af37] font-bold mb-2 sm:mb-3 block">
                  Artisanal Gallery
                </span>
                <h2 className={`font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg mb-2.5 sm:mb-4 font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                  The Lookbook Gallery
                </h2>
                <p className={`font-body-md text-sm sm:text-body-md leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                  Immerse yourself in our evolving repertoire of runway-inspired micro-art, glazed chrome finishes, and minimalist hand embellishments.
                </p>
              </div>

              {/* Haute Couture Organized Bento Gallery (Tablet 2-1-2-1 / Desktop 8+4, 4+8, 6+6 / Mobile 1-col) */}
              <div className="mb-14 sm:mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">

                    {/* ROW 1 — Card 1: Wide Runway Panoramic Feature (Tablet Span 2, Desktop Span 8) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[0])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-8 h-[340px] xs:h-[380px] sm:h-[400px] md:h-[430px] lg:h-[460px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/40 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[0].title}
                        src={galleryItems[0].image}
                      />
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/60 text-[#ffe08d] font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-semibold shadow-md">
                          {galleryItems[0].tag}
                        </span>
                        <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 font-label-sm text-[0.65rem] tracking-widest uppercase">
                          Runway Panorama
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[0]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      {/* Bottom Low-Profile Info Bar */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 md:px-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 transition-all duration-300">
                        <div>
                          <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                            Master Artist: {galleryItems[0].artist} • {galleryItems[0].category}
                          </span>
                          <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                            {galleryItems[0].title}
                          </h4>
                          <p className="font-body-sm text-[0.7rem] sm:text-xs text-zinc-300 mt-0.5 line-clamp-1 max-w-lg">
                            {galleryItems[0].description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[0].title); }}
                          className="self-start sm:self-auto shrink-0 px-3.5 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Book Look</span>
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        </button>
                      </div>
                    </div>

                    {/* ROW 1 — Card 2: Editorial Portrait Feature (Tablet Span 1, Desktop Span 4) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[1])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-1 lg:col-span-4 h-[340px] xs:h-[380px] sm:h-[400px] md:h-[430px] lg:h-[460px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/40 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[1].title}
                        src={galleryItems[1].image}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/60 text-[#ffe08d] font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-semibold shadow-md">
                          {galleryItems[1].tag}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[1]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 flex flex-col justify-end transition-all duration-300">
                        <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                          Master Artist: {galleryItems[1].artist}
                        </span>
                        <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl text-white font-bold tracking-tight mb-1.5 sm:mb-2">
                          {galleryItems[1].title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-label-sm text-[0.7rem] sm:text-xs text-[#ffe08d]/90 uppercase tracking-wider">
                            24K Gold Leaf
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[1].title); }}
                            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
                          >
                            Book Look
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ROW 2 — Card 3: Editorial Portrait Feature (Tablet Span 1, Desktop Span 4) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[2])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-1 lg:col-span-4 h-[340px] xs:h-[380px] sm:h-[400px] md:h-[430px] lg:h-[460px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/40 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[2].title}
                        src={galleryItems[2].image}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/60 text-[#ffe08d] font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-semibold shadow-md">
                          {galleryItems[2].tag}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[2]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 flex flex-col justify-end transition-all duration-300">
                        <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                          Master Artist: {galleryItems[2].artist}
                        </span>
                        <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl text-white font-bold tracking-tight mb-1.5 sm:mb-2">
                          {galleryItems[2].title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-label-sm text-[0.7rem] sm:text-xs text-[#ffe08d]/90 uppercase tracking-wider">
                            Velvet Cat-Eye
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[2].title); }}
                            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
                          >
                            Book Look
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ROW 2 — Card 4: Wide Bridal Masterpiece Feature (Tablet Span 2, Desktop Span 8) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[3])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-8 h-[340px] xs:h-[380px] sm:h-[400px] md:h-[430px] lg:h-[460px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/45 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[3].title}
                        src={galleryItems[3].image}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-bold shadow-md">
                          ✨ Bridal Haute Couture
                        </span>
                        <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 font-label-sm text-[0.65rem] tracking-widest uppercase">
                          {galleryItems[3].tag}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[3]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 md:px-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 transition-all duration-300">
                        <div>
                          <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                            Master Artist: {galleryItems[3].artist} • Signature Bridal Piece
                          </span>
                          <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                            {galleryItems[3].title}
                          </h4>
                          <p className="font-body-sm text-[0.7rem] sm:text-xs text-zinc-300 mt-0.5 line-clamp-1 max-w-lg">
                            {galleryItems[3].description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[3].title); }}
                          className="self-start sm:self-auto shrink-0 px-3.5 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Book Look</span>
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        </button>
                      </div>
                    </div>

                    {/* ROW 3 — Card 5: Balanced Studio Canvas (Tablet Span 1, Desktop Span 6) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[4])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-1 lg:col-span-6 h-[320px] xs:h-[360px] sm:h-[380px] md:h-[400px] lg:h-[430px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/40 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[4].title}
                        src={galleryItems[4].image}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/60 text-[#ffe08d] font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-semibold shadow-md">
                          {galleryItems[4].tag}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[4]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 transition-all duration-300">
                        <div>
                          <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                            Master Artist: {galleryItems[4].artist} • 3D Relief
                          </span>
                          <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl text-white font-bold tracking-tight">
                            {galleryItems[4].title}
                          </h4>
                          <p className="font-body-sm text-[0.7rem] sm:text-xs text-zinc-300 mt-0.5 line-clamp-1 max-w-sm">
                            {galleryItems[4].description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[4].title); }}
                          className="self-start sm:self-auto shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
                        >
                          Book Look
                        </button>
                      </div>
                    </div>

                    {/* ROW 3 — Card 6: Balanced Studio Canvas (Tablet Span 1, Desktop Span 6) */}
                    <div
                      onClick={() => setLightboxItem(galleryItems[5])}
                      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden col-span-1 md:col-span-1 lg:col-span-6 h-[320px] xs:h-[360px] sm:h-[380px] md:h-[400px] lg:h-[430px] bg-[#0a0a0a] shadow-2xl border border-[#d4af37]/40 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:border-[#ffe08d]"
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={galleryItems[5].title}
                        src={galleryItems[5].image}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2">
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/60 text-[#ffe08d] font-label-sm text-[0.65rem] sm:text-xs tracking-wider uppercase font-semibold shadow-md">
                          {galleryItems[5].tag}
                        </span>
                        <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 font-label-sm text-[0.65rem] tracking-widest uppercase">
                          Fine Brushwork
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxItem(galleryItems[5]); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#d4af37] text-[#ffe08d] hover:text-black border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md"
                        title="Inspecter en haute définition"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg">zoom_in</span>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 sm:pt-16 pb-3.5 sm:pb-5 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 transition-all duration-300">
                        <div>
                          <span className="font-label-sm text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#ffe08d] font-semibold mb-0.5 sm:mb-1 block">
                            Master Artist: {galleryItems[5].artist} • Kyoto Botanical Art
                          </span>
                          <h4 className="font-display-hero text-lg xs:text-xl sm:text-2xl text-white font-bold tracking-tight">
                            {galleryItems[5].title}
                          </h4>
                          <p className="font-body-sm text-[0.7rem] sm:text-xs text-zinc-300 mt-0.5 line-clamp-1 max-w-sm">
                            {galleryItems[5].description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBooking(galleryItems[5].title); }}
                          className="self-start sm:self-auto shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-sm text-[0.7rem] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
                        >
                          Book Look
                        </button>
                      </div>
                    </div>

                  </div>
              </div>

              {/* SPOTLIGHT: Before & After Nail Transformation Trust Card */}
              <div className={`p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-3xl border shadow-2xl transition-all duration-500 mt-14 sm:mt-20 ${darkMode
                ? 'bg-gradient-to-br from-[#121212] via-[#161616] to-[#0d0d0d] border-[#d4af37]/45 text-white'
                : 'bg-gradient-to-br from-white via-[#fdfaf7] to-[#f6efe7] border-[#d4af37]/40 text-zinc-900'
                }`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-xl">
                    <img
                      alt="Split comparison before and after nail transformation: damaged short brittle bare nails vs flawless Russian manicure"
                      className="w-full h-auto object-cover max-h-[260px] xs:max-h-[300px] sm:max-h-[380px] lg:max-h-[480px]"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIe2HiI78nSY8QurPYxN36-cOXYmxSPxIvl2qt8H4l84awN3-WxNlJR6kG_rdOCWs5HVu64HYiooMLDoKcMdB9IQF31dcOxfYYkp6a6rPPyqtGRElNnWiX0S-po7tzUuFLJmdat0VTgPCrcRo-nvhOCB6w--TXswvP8wGa7l5ibr8I2NMRGiGDV65m97DRHXwyVI7NDiPw1mf5Zg4HsS8FOl7V7L32Rco7XCEyiOyaXEnFpvIPzdlw"
                    />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-label-sm text-[0.625rem] sm:text-[0.6875rem] tracking-wider uppercase font-medium border border-white/20">
                      Before: Brittle / Damaged
                    </div>
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] border border-[#ffe08d]/60 backdrop-blur-md text-black font-label-sm text-[0.625rem] sm:text-[0.6875rem] tracking-wider uppercase font-bold shadow-md">
                      After: Fakhama Russian Gel
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center lg:pl-4">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-[#ffe08d]/10 text-[#d4af37] border border-[#d4af37]/30 font-label-sm text-[0.6875rem] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 w-fit">
                      <span className="material-symbols-outlined text-sm text-[#d4af37]">verified</span> Clinical Health Guarantee
                    </div>
                    <h3 className={`font-headline-md text-xl sm:text-2xl lg:text-headline-md mb-2 sm:mb-3 font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                      6-Week Retention Without Plate Damage
                    </h3>
                    <p className={`font-body-md text-sm sm:text-body-md mb-5 sm:mb-6 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      See how our non-invasive dry e-file manicure gently removes keratin buildup while strengthening weak, brittle nails. Zero aggressive filing, zero peeling, and 100% breathable Japanese builder structure.
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                      <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border shadow-inner ${darkMode ? 'bg-[#181818]/90 border-[#d4af37]/35 text-white' : 'bg-white/80 border-[#d4af37]/30 text-zinc-900'
                        }`}>
                        <div className="font-headline-sm text-lg sm:text-xl font-bold text-[#d4af37] mb-1">0% Lifting</div>
                        <p className={`text-[0.7rem] sm:text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Flawless seamless cuticle edge for 4 to 6 weeks</p>
                      </div>
                      <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border shadow-inner ${darkMode ? 'bg-[#181818]/90 border-[#d4af37]/35 text-white' : 'bg-white/80 border-[#d4af37]/30 text-zinc-900'
                        }`}>
                        <div className="font-headline-sm text-lg sm:text-xl font-bold text-[#d4af37] mb-1">100% Intact</div>
                        <p className={`text-[0.7rem] sm:text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Natural nail keratin protected with botanical base</p>
                      </div>
                    </div>
                    <a
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black border border-[#ffe08d]/60 font-label-md text-xs sm:text-label-md uppercase tracking-wider font-bold hover:brightness-110 transition-all shadow-md w-full sm:w-fit text-center"
                      href="#services"
                    >
                      <span>Book Transformation Ritual</span>
                      <span className="material-symbols-outlined text-sm text-black">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 5: Press-On Nail Atelier (Ready-to-Wear Couture Preview) */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#0e0911] via-[#160f1b] to-[#0d0810] text-white'
            : 'bg-gradient-to-b from-[#fcf5f1] via-[#f7e9e1] to-[#faede6] text-zinc-900'
            }`} id="press-on-shop">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className={`p-6 sm:p-10 lg:p-16 rounded-2xl sm:rounded-3xl backdrop-blur-2xl border transition-all duration-500 ${darkMode
                ? 'bg-[#121212]/95 border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white'
                : 'bg-white/95 border-[#d4af37]/35 shadow-xl text-zinc-900'
                }`}>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start lg:items-center mb-10 sm:mb-14">
                  <div className="lg:col-span-8">
                    <span className="font-label-md text-[0.6875rem] sm:text-label-md uppercase tracking-[0.24em] text-[#d4af37] font-bold mb-1.5 sm:mb-2 block">
                      Couture Delivered
                    </span>
                    <h2 className={`font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg mb-3 sm:mb-4 font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                      The Ready-to-Wear Press-On Atelier
                    </h2>
                    <p className={`font-body-lg text-sm sm:text-base lg:text-body-lg max-w-2xl leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      Hand-painted by Fakhama master manicurists using our salon-grade 7-layer gel structure. Reusable up to 5 times with our hypoallergenic medical adhesive system.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex w-full sm:w-auto lg:justify-end">
                    <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-md sm:font-label-lg text-xs sm:text-label-lg uppercase tracking-wider font-bold shadow-lg border border-[#ffe08d]/80 hover:brightness-110 transition-all duration-300 text-center cursor-pointer" href="#press-on-shop">
                      Shop The Collection
                    </a>
                  </div>
                </div>

                {/* 3 Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {pressOnProducts.map((prod) => (
                    <div key={prod.id} className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 group shadow-lg ${darkMode
                      ? 'bg-[#171717] hover:bg-[#1f1f1f] border-[#d4af37]/30 hover:border-[#ffe08d]/70 text-white'
                      : 'bg-white hover:bg-amber-50/40 border-[#d4af37]/25 hover:border-[#d4af37]/70 text-zinc-900'
                      }`}>
                      <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-[#0d0d0d] border border-[#d4af37]/20">
                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={prod.title} src={prod.image} />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-title-md text-sm sm:text-title-md font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'
                          }`}>{prod.title}</h4>
                        <span className="font-headline-sm text-base sm:text-headline-sm text-[#d4af37] font-display-hero font-bold">{prod.price}</span>
                      </div>
                      <p className={`font-body-sm text-xs sm:text-body-sm mb-4 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>{prod.desc}</p>
                      <div className={`flex items-center justify-between pt-3.5 border-t ${darkMode ? 'border-[#d4af37]/20' : 'border-[#d4af37]/15'
                        }`}>
                        <span className={`font-label-sm text-[0.65rem] sm:text-label-sm uppercase tracking-wider ${darkMode ? 'text-zinc-500' : 'text-zinc-400'
                          }`}>Reusable 4+ Weeks</span>
                        <button
                          onClick={() => handleAddToCart(prod.title)}
                          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm ${darkMode
                            ? 'bg-[#242424] hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] text-[#ffe08d] hover:text-black border-[#d4af37]/35'
                            : 'bg-amber-50 hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] text-amber-900 hover:text-black border-[#d4af37]/30'
                            }`}
                          title="Add to luxury bag"
                        >
                          <span className="material-symbols-outlined text-base">shopping_bag</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 6: Uncompromising Hygiene & Safety Standards           */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#060a09] via-[#0a1210] to-[#060908] text-white'
            : 'bg-gradient-to-b from-[#f3f7f6] via-[#e8f1ef] to-[#f2f7f5] text-zinc-900'
            }`} id="hygiene">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">

                <div className="lg:col-span-5 flex flex-col">
                  <span className="font-label-md text-[0.6875rem] sm:text-label-md uppercase tracking-[0.24em] text-[#d4af37] font-bold mb-2 sm:mb-3">
                    Sanctuary Protocols
                  </span>
                  <h2 className={`font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg mb-4 sm:mb-6 leading-tight font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                    Medical-Grade Hygiene. Absolute Peace of Mind.
                  </h2>
                  <p className={`font-body-lg text-sm sm:text-base lg:text-body-lg mb-6 sm:mb-8 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                    Our atelier adheres to rigorous clinical safety benchmarks. We believe true luxury begins with transparent sterilization, non-toxic breathable botanicals, and zero compromises on nail plate integrity.
                  </p>

                  {/* Autoclave Tray Visual Proof */}
                  <div className={`rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl mb-6 group ${darkMode ? 'border-[#d4af37]/45 bg-[#121212]' : 'border-[#d4af37]/35 bg-white'
                    }`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        alt="Luxury medical-grade salon sterilization tray with gleaming rose gold stainless steel instruments"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHwk7EwqrMqIXy1lhnV2hXIcCTrTXxsinXiFNi0HWXJhbo-3vGD8WP_YabY4E3FNDN9zWaDBlUAwDuqFmh9LvMBK9CD7BQzm1bYAHm63PNQoR0_mJDScwQIfCGg5I77dJPBOmN-tp4D_gaSR5fTwm649jW0qWRzn92HxhppBAAOc2GAblgHrORBTTaguvQj9VXjMrpk_SDHNHDhy48fi4nsPsnxSYUcnmlfT5Sn2tOEnfZ3nXs54s3"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-1.5 font-label-sm text-[0.65rem] sm:text-xs font-semibold">
                          <span className="material-symbols-outlined text-sm sm:text-base text-[#ffe08d]">verified</span> Sealed Pouch Unsealed Before You
                        </div>
                        <span className="text-[0.55rem] sm:text-[0.625rem] uppercase tracking-widest text-black font-bold bg-gradient-to-r from-[#ffe08d] to-[#d4af37] px-2.5 py-0.5 rounded shadow-sm">
                          Lot: Class-B
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border shadow-md ${darkMode ? 'bg-[#141414] border-[#d4af37]/35 text-white' : 'bg-white border-[#d4af37]/25 text-zinc-900'
                    }`}>
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#d4af37] shrink-0">verified_user</span>
                      <div>
                        <h4 className={`font-title-md text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'
                          }`}>Clean Beauty Certified Formulations</h4>
                        <p className={`font-body-sm text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                          }`}>Every bottle is verified 10-Free, HEMA-Free, vegan, and certified cruelty-free for expectant mothers.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-lg hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode ? 'bg-[#121212] border-[#d4af37]/35 text-white' : 'bg-white border-[#d4af37]/25 text-zinc-900'
                    }`}>
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-[#d4af37] mb-3.5 sm:mb-4 shadow-sm ${darkMode ? 'bg-[#1a1a1a] border-[#d4af37]/40' : 'bg-amber-50 border-[#d4af37]/30'
                      }`}>
                      <span className="material-symbols-outlined text-xl sm:text-2xl text-[#d4af37]">sanitizer</span>
                    </div>
                    <h3 className={`font-title-md text-base sm:text-title-md font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>Hospital-Grade Autoclave</h3>
                    <p className={`font-body-sm text-xs sm:text-body-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      Medical-grade steam autoclaves sterilize all stainless steel instruments. Sealed indicator pouches are strictly unsealed before your eyes.
                    </p>
                  </div>

                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-lg hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode ? 'bg-[#121212] border-[#d4af37]/35 text-white' : 'bg-white border-[#d4af37]/25 text-zinc-900'
                    }`}>
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-[#d4af37] mb-3.5 sm:mb-4 shadow-sm ${darkMode ? 'bg-[#1a1a1a] border-[#d4af37]/40' : 'bg-amber-50 border-[#d4af37]/30'
                      }`}>
                      <span className="material-symbols-outlined text-xl sm:text-2xl text-[#d4af37]">recycling</span>
                    </div>
                    <h3 className={`font-title-md text-base sm:text-title-md font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>100% Single-Use Kits</h3>
                    <p className={`font-body-sm text-xs sm:text-body-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      Files, buffers, orange-wood sticks, and pedicure basin liners are strictly single-use and either gifted to you upon departure or responsibly recycled.
                    </p>
                  </div>

                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-lg hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode ? 'bg-[#121212] border-[#d4af37]/35 text-white' : 'bg-white border-[#d4af37]/25 text-zinc-900'
                    }`}>
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-[#d4af37] mb-3.5 sm:mb-4 shadow-sm ${darkMode ? 'bg-[#1a1a1a] border-[#d4af37]/40' : 'bg-amber-50 border-[#d4af37]/30'
                      }`}>
                      <span className="material-symbols-outlined text-xl sm:text-2xl text-[#d4af37]">eco</span>
                    </div>
                    <h3 className={`font-title-md text-base sm:text-title-md font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>10-Free & HEMA-Free</h3>
                    <p className={`font-body-sm text-xs sm:text-body-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      We eliminate toluene, formaldehyde, DBP, camphor, and harsh acrylic fumes in favor of gentle, nourishing Japanese builder gels.
                    </p>
                  </div>

                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-lg hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode ? 'bg-[#121212] border-[#d4af37]/35 text-white' : 'bg-white border-[#d4af37]/25 text-zinc-900'
                    }`}>
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center text-[#d4af37] mb-3.5 sm:mb-4 shadow-sm ${darkMode ? 'bg-[#1a1a1a] border-[#d4af37]/40' : 'bg-amber-50 border-[#d4af37]/30'
                      }`}>
                      <span className="material-symbols-outlined text-xl sm:text-2xl text-[#d4af37]">air</span>
                    </div>
                    <h3 className={`font-title-md text-base sm:text-title-md font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'
                      }`}>HEPA Air Filtration</h3>
                    <p className={`font-body-sm text-xs sm:text-body-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                      Each station is equipped with quiet, built-in microscopic dust extractors and high-efficiency particulate air purifying columns.
                    </p>
                  </div>
                </div>

              </div>
            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 7: Authentic Female Social Proof & Endorsements       */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#110e08] via-[#18130a] to-[#0f0c07] text-white'
            : 'bg-gradient-to-b from-[#f9f3ea] via-[#f3e7d5] to-[#f7eee1] text-zinc-900'
            }`}>
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <span className="font-label-md text-[0.6875rem] sm:text-label-md uppercase tracking-[0.24em] text-[#d4af37] font-bold mb-2 sm:mb-3 block">
                  Refined Endorsements
                </span>
                <h2 className={`font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg mb-2 sm:mb-3 font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                  }`}>
                  Adored by Connoisseurs & VIP Women
                </h2>
                <p className={`font-body-md text-sm sm:text-body-md ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                  The definitive destination for discerning patrons who value precision, discretion, and timeless aesthetics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

                {/* Review 1 */}
                <div className={`p-7 sm:p-9 rounded-2xl sm:rounded-3xl border shadow-xl flex flex-col justify-between hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode
                  ? 'bg-[#131313] border-[#d4af37]/35 text-white hover:shadow-[0_20px_45px_rgba(212,175,55,0.15)]'
                  : 'bg-white border-[#d4af37]/30 text-zinc-900 hover:shadow-xl'
                  }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-[#d4af37]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[0.625rem] font-bold uppercase tracking-wider ${darkMode
                        ? 'bg-[#1c1c1c] border border-[#d4af37]/40 text-[#ffe08d]'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                        <span className="material-symbols-outlined text-xs text-[#d4af37]">check_circle</span> Verified VIP
                      </span>
                    </div>
                    <p className={`font-body-md text-sm sm:text-body-md italic leading-relaxed mb-6 font-serif ${darkMode ? 'text-zinc-300' : 'text-zinc-700'
                      }`}>
                      "The cleanest cuticle work I have ever received in New York. My Russian manicure lasted over five weeks without lifting or chipping. The gold instruments sealed in pouches gave me total peace of mind."
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 pt-4 border-t ${darkMode ? 'border-[#d4af37]/20' : 'border-[#d4af37]/15'
                    }`}>
                    <img alt="Sophia Laurent" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#d4af37]/60 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCghbBmp5PC1SazlePSBTo3i2jdyaipwCiWPBL-cN0ahApERN-Az3MIepjp1GPt8uDCq8O2GauaCxT25SPui5PIM2nVbdtt1z0FA7XG0HhnUTGcG9Wd6-TfQZ0ELfajmYhx6bSQMOeo6qD3FxJNVtd6_HhURjxXP8AXbcIt7fMLDAAR0UEtfW3cGRdfz6P2WVNKsv9znLUHefpus7gJYkU4hVpsPbB_cPrS_3IK4z_Iq4QipWAbHKZ4" />
                    <div>
                      <h4 className={`font-title-sm text-sm sm:text-title-md font-semibold leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                        }`}>Sophia Laurent</h4>
                      <span className="font-label-sm text-xs text-[#d4af37] uppercase tracking-wider font-semibold">Vogue Contributor</span>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className={`p-7 sm:p-9 rounded-2xl sm:rounded-3xl border shadow-xl flex flex-col justify-between hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode
                  ? 'bg-[#131313] border-[#d4af37]/35 text-white hover:shadow-[0_20px_45px_rgba(212,175,55,0.15)]'
                  : 'bg-white border-[#d4af37]/30 text-zinc-900 hover:shadow-xl'
                  }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-[#d4af37]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[0.625rem] font-bold uppercase tracking-wider ${darkMode
                        ? 'bg-[#1c1c1c] border border-[#d4af37]/40 text-[#ffe08d]'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                        <span className="material-symbols-outlined text-xs text-[#d4af37]">check_circle</span> Verified VIP
                      </span>
                    </div>
                    <p className={`font-body-md text-sm sm:text-body-md italic leading-relaxed mb-6 font-serif ${darkMode ? 'text-zinc-300' : 'text-zinc-700'
                      }`}>
                      "Their Japanese builder gel completely repaired my damaged nails after years of acrylics. Stepping into Fakhama Nails feels like entering a private boutique suite in Paris."
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 pt-4 border-t ${darkMode ? 'border-[#d4af37]/20' : 'border-[#d4af37]/15'
                    }`}>
                    <img alt="Amara Kincaid" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#d4af37]/60 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD92bBFud4OtGbr44yl_m41Mn6NGxkMkk7O8KlUOGsvxDWdIX1Y6i_rzPnPKRyTARECLwtgZ8I9wR6_0MLgYXhhBR6SHkunl0LKJmRYZdMpSVvNu0uoHl4zT3b8zqZnrN8Z6Y6dWqTpqY76FZeQSHKr9x7rixmJVmLFNryk3QVFmyXCrbg3S_vUIQjEBpWAN0GIwfR_bJM-mmRnnn8MN2BPe8F5FgXcQ5Tc98lkkS9auIAkSgM9FAJn" />
                    <div>
                      <h4 className={`font-title-sm text-sm sm:text-title-md font-semibold leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                        }`}>Amara Kincaid</h4>
                      <span className="font-label-sm text-xs text-[#d4af37] uppercase tracking-wider font-semibold">Interior Architect</span>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className={`p-7 sm:p-9 rounded-2xl sm:rounded-3xl border shadow-xl flex flex-col justify-between hover:border-[#ffe08d]/80 transition-all duration-300 ${darkMode
                  ? 'bg-[#131313] border-[#d4af37]/35 text-white hover:shadow-[0_20px_45px_rgba(212,175,55,0.15)]'
                  : 'bg-white border-[#d4af37]/30 text-zinc-900 hover:shadow-xl'
                  }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-[#d4af37]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[0.625rem] font-bold uppercase tracking-wider ${darkMode
                        ? 'bg-[#1c1c1c] border border-[#d4af37]/40 text-[#ffe08d]'
                        : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                        <span className="material-symbols-outlined text-xs text-[#d4af37]">check_circle</span> Verified VIP
                      </span>
                    </div>
                    <p className={`font-body-md text-sm sm:text-body-md italic leading-relaxed mb-6 font-serif ${darkMode ? 'text-zinc-300' : 'text-zinc-700'
                      }`}>
                      "The bridal pearl and 24K gold foil nail set was extraordinary for my wedding weekend. Every guest asked where I got them done. Truly the gold standard in Manhattan."
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 pt-4 border-t ${darkMode ? 'border-[#d4af37]/20' : 'border-[#d4af37]/15'
                    }`}>
                    <img alt="Charlotte Dubois" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#d4af37]/60 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3dG-zxXH3p2LFdHbbgOqyqMKPYU9lEm8awhIVUOGudtTfhcV5poxkFZmnOQPzcv6qcMoTPrLBO8ryZvgh-Ip988i9dNe65mNROD0LoYmK-wFzNi4ezoJ5DE0dwGKkLLKoAeWDO_Rs9AQYYNLniX0NrtG0VBVHq0M9SGdVezAaB288z8bGnwHHXKM-tIv6MNEqEK-lqsbiJgH-UcBlN1z9oYeBQ75juR56SyuImNK58hROKHaVVQwh" />
                    <div>
                      <h4 className={`font-title-sm text-sm sm:text-title-md font-semibold leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'
                        }`}>Charlotte Dubois</h4>
                      <span className="font-label-sm text-xs text-[#d4af37] uppercase tracking-wider font-semibold">Fashion Director</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <SectionDivider darkMode={darkMode} />
          </section>

          {/* ============================================================== */}
          {/* SECTION 8: VIP Concierge & Atelier Visit Banner                */}
          {/* ============================================================== */}
          <section className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-500 ${darkMode
            ? 'bg-gradient-to-b from-[#08070a] via-[#0d0c11] to-[#060608] text-white'
            : 'bg-gradient-to-b from-[#f6efe8] via-[#ebe0d4] to-[#f4ece2] text-zinc-900'
            }`} id="sanctuary">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#141414] via-[#181818] to-[#0d0d0d] p-7 sm:p-12 lg:p-20 border border-[#d4af37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

                  <div className="lg:col-span-8">
                    <span className="font-label-sm text-[0.6875rem] sm:text-label-sm uppercase tracking-[0.24em] text-[#d4af37] font-bold mb-2 sm:mb-3 block">
                      Private Sanctuary
                    </span>
                    <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg text-white mb-3 sm:mb-4 font-semibold tracking-tight">
                      Experience the Sanctuary at 482 Broome Street
                    </h2>
                    <p className="font-body-lg text-sm sm:text-base lg:text-body-lg text-zinc-300 max-w-xl mb-6 leading-relaxed">
                      Discreetly positioned on the second floor in the heart of SoHo. Indulge in complimentary champagne, botanical herbal infusions, and bespoke couture manicures.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-body-sm text-xs sm:text-body-sm text-white mb-10">
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1f1f]/80 border border-[#d4af37]/25 shadow-sm">
                        <span className="font-bold block text-[#ffe08d] text-xs uppercase tracking-wider mb-1">Tuesday – Saturday</span>
                        <span className="text-zinc-300">10:00 AM – 8:00 PM</span>
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1f1f]/80 border border-[#d4af37]/25 shadow-sm">
                        <span className="font-bold block text-[#ffe08d] text-xs uppercase tracking-wider mb-1">Sunday</span>
                        <span className="text-zinc-300">9:30 AM – 7:00 PM</span>
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#1f1f1f]/80 border border-[#d4af37]/25 shadow-sm">
                        <span className="font-bold block text-[#ffe08d] text-xs uppercase tracking-wider mb-1">Private VIP Suites</span>
                        <span className="text-zinc-300">Available upon request</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <a
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] text-black font-label-md sm:font-label-lg text-xs sm:text-label-lg uppercase tracking-wider font-bold shadow-lg border border-[#ffe08d]/80 hover:brightness-110 transition-all duration-300 text-center cursor-pointer"
                        href="#services"
                      >
                        Reserve An Appointment
                      </a>
                      <button
                        onClick={() => handleBooking('Private VIP Gift Card')}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-full bg-[#1f1f1f] text-white font-label-md sm:font-label-lg text-xs sm:text-label-lg uppercase tracking-wider border border-[#d4af37]/50 shadow-md hover:bg-[#282828] transition-all duration-300 cursor-pointer text-center"
                      >
                        Acquire Gift Card
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center mt-4 lg:mt-0">
                    <div className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center relative group">
                      {/* Ambient Golden Halo Glow */}
                      <div className="absolute inset-2 bg-[#d4af37]/20 rounded-full blur-2xl group-hover:bg-[#d4af37]/30 transition-all duration-500 pointer-events-none"></div>

                      <img
                        src="/logo.png"
                        alt="Fakhama Nails Emblem"
                        className="w-full h-full object-contain rounded-full drop-shadow-[0_10px_35px_rgba(212,175,55,0.45)] transition-transform duration-500 group-hover:scale-105 relative z-10"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ============================================================== */}
      {/* EXPANSIVE FULL-WIDTH HAUTE COUTURE FOOTER                      */}
      {/* ============================================================== */}
      <footer className={`w-full transition-colors duration-500 pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 border-t-2 relative ${darkMode
        ? 'bg-gradient-to-b from-[#080808] via-[#040404] to-[#000000] text-white border-[#d4af37]/40 shadow-[0_-20px_50px_rgba(0,0,0,0.95)]'
        : 'bg-gradient-to-b from-[#eee4d7] via-[#e5d7c6] to-[#dbcab6] text-zinc-900 border-[#d4af37]/40 shadow-xl'
        }`}>

        {/* Full-Width Expansive Container (Edge-to-Edge with Generous Luxury Margins) */}
        <div className="w-full px-5 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-28">

          {/* Main 4-Column Luxury Grid Across Full Page Width */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 pb-12 sm:pb-16 border-b ${darkMode ? 'border-[#d4af37]/25' : 'border-[#d4af37]/20'
            }`}>

            {/* Column 1: Maison Brand & Heritage */}
            <div className="flex flex-col items-start pr-0 lg:pr-4">
              <div className="flex items-center gap-3.5 mb-5 w-auto">
                <div
                  style={{ width: '3.75rem', height: '3.75rem', minWidth: '3.75rem', minHeight: '3.75rem', maxWidth: '3.75rem', maxHeight: '3.75rem' }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border shadow-md flex items-center justify-center p-1.5 shrink-0 overflow-hidden ${darkMode ? 'bg-[#141414] border-[#d4af37]/60' : 'bg-white border-[#d4af37]/40 shadow-sm'}`}
                >
                  <img
                    src="/logo.png"
                    alt="Fakhama Nails Logo"
                    style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                  />
                </div>
                <div className="flex flex-col shrink">
                  <span className={`font-display-hero text-xl xs:text-2xl sm:text-2xl tracking-tight font-bold block leading-none ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                    Fakhama Nails
                  </span>
                  <span className="font-label-sm text-[0.625rem] tracking-[0.22em] uppercase text-[#d4af37] font-bold mt-1.5 block">
                    Haute Atelier • SoHo
                  </span>
                </div>
              </div>
              <p className={`font-body-md text-sm leading-relaxed mb-6 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                Haute couture nail artistry, botanical-infused manicure spa rituals, and bespoke reusable press-on collections handcrafted by master artisans in our SoHo sanctuary.
              </p>

              {/* Luxury Social Icons */}
              <div className={`flex items-center gap-2.5 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <a
                  aria-label="Instagram"
                  className={`w-10 h-10 rounded-full border shadow-xs flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] hover:text-black hover:border-[#ffe08d] transition-all duration-300 transform hover:-translate-y-0.5 ${darkMode ? 'bg-[#161616] border-[#d4af37]/35' : 'bg-white border-[#d4af37]/30 shadow-xs'
                    }`}
                  href="https://instagram.com/fakhama.nails"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                >
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                </a>
                <a
                  aria-label="Pinterest"
                  className={`w-10 h-10 rounded-full border shadow-xs flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] hover:text-black hover:border-[#ffe08d] transition-all duration-300 transform hover:-translate-y-0.5 ${darkMode ? 'bg-[#161616] border-[#d4af37]/35' : 'bg-white border-[#d4af37]/30 shadow-xs'
                    }`}
                  href="#"
                  title="Pinterest Lookbook"
                >
                  <span className="material-symbols-outlined text-lg">collections_bookmark</span>
                </a>
                <a
                  aria-label="TikTok"
                  className={`w-10 h-10 rounded-full border shadow-xs flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] hover:text-black hover:border-[#ffe08d] transition-all duration-300 transform hover:-translate-y-0.5 ${darkMode ? 'bg-[#161616] border-[#d4af37]/35' : 'bg-white border-[#d4af37]/30 shadow-xs'
                    }`}
                  href="#"
                  title="TikTok Runway"
                >
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </a>
                <a
                  aria-label="Concierge Email"
                  className={`w-10 h-10 rounded-full border shadow-xs flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ffe08d] hover:to-[#d4af37] hover:text-black hover:border-[#ffe08d] transition-all duration-300 transform hover:-translate-y-0.5 ${darkMode ? 'bg-[#161616] border-[#d4af37]/35' : 'bg-white border-[#d4af37]/30 shadow-xs'
                    }`}
                  href={`mailto:${siteSettings.email}`}
                  title="Concierge Email"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                </a>
              </div>
            </div>

            {/* Column 2: Sanctuary Hours */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg text-[#d4af37]">schedule</span>
                <h4 className="font-label-lg text-xs uppercase tracking-widest text-[#d4af37] font-bold">Sanctuary Hours</h4>
              </div>
              <div className={`space-y-3 font-body-sm text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                <div className={`p-3.5 rounded-xl border shadow-xs ${darkMode ? 'bg-[#141414] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/25 shadow-xs'
                  }`}>
                  <span className="font-bold text-[#d4af37] block text-xs uppercase tracking-wider mb-0.5">Tuesday – Friday</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{siteSettings.sanctuaryHoursWeekdays}</span>
                </div>
                <div className={`p-3.5 rounded-xl border shadow-xs ${darkMode ? 'bg-[#141414] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/25 shadow-xs'
                  }`}>
                  <span className="font-bold text-[#d4af37] block text-xs uppercase tracking-wider mb-0.5">Saturday & Sunday</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{siteSettings.sanctuaryHoursWeekends}</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-[#181818] border-[#d4af37]/25' : 'bg-amber-50/80 border-[#d4af37]/25'
                  }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${darkMode ? 'text-[#ffe08d]' : 'text-amber-900'
                    }`}>{siteSettings.sanctuaryHoursMonday}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Flagship SoHo Atelier & Direct Concierge */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg text-[#d4af37]">location_on</span>
                <h4 className="font-label-lg text-xs uppercase tracking-widest text-[#d4af37] font-bold">Flagship Atelier</h4>
              </div>
              <div className={`font-body-sm text-xs sm:text-sm leading-relaxed space-y-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                <div className={`p-3.5 rounded-xl border shadow-xs ${darkMode ? 'bg-[#141414] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/25 shadow-xs'
                  }`}>
                  <span className="font-bold text-[#d4af37] block text-xs uppercase tracking-wider mb-1">SoHo Flagship</span>
                  <p className={`font-medium leading-snug ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{siteSettings.address}</p>
                </div>

                <div className={`p-3.5 rounded-xl border shadow-xs space-y-1.5 ${darkMode ? 'bg-[#141414] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/25 shadow-xs'
                  }`}>
                  <span className="font-bold text-[#d4af37] block text-xs uppercase tracking-wider mb-0.5">Direct Concierge</span>
                  <p className="text-xs">
                    <a href={`mailto:${siteSettings.email}`} className={`transition-colors break-all flex items-center gap-1.5 ${darkMode ? 'text-zinc-300 hover:text-[#ffe08d]' : 'text-zinc-700 hover:text-[#d4af37]'
                      }`}>
                      <span className="material-symbols-outlined text-sm text-[#d4af37]">mail</span>
                      <span>{siteSettings.email}</span>
                    </a>
                  </p>
                  <p className="text-xs">
                    <a href={`tel:${siteSettings.phoneRaw}`} className="text-[#d4af37] font-bold hover:brightness-125 transition-colors flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#d4af37]">call</span>
                      <span>{siteSettings.phone}</span>
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Column 4: Le Cercle VIP Salon (Newsletter & Privilege Access) */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg text-[#d4af37]">auto_awesome</span>
                <h4 className="font-label-lg text-xs uppercase tracking-widest text-[#d4af37] font-bold">Le Cercle VIP Salon</h4>
              </div>
              <p className={`font-body-sm text-xs sm:text-sm mb-4 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                Receive privileged access to seasonal capsule drops, private masterclass invites, and 15% off your first bespoke service.
              </p>

              {newsletterSubscribed ? (
                <div className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm mb-4 animate-fadeIn flex items-center gap-2 ${darkMode
                  ? 'bg-[#1c1c1c] border-[#ffe08d]/60 text-[#ffe08d]'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                  <span className="material-symbols-outlined text-base text-[#d4af37]">verified</span>
                  <span>Welcome to Le Cercle VIP. Check your inbox soon!</span>
                </div>
              ) : (
                <form className="flex flex-col gap-2.5 mb-3" onSubmit={handleNewsletterSubmit}>
                  <div className="relative w-full">
                    <input
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-full font-body-sm text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#ffe08d]/40 focus:border-[#ffe08d] shadow-inner ${darkMode
                        ? 'bg-[#161616] text-white placeholder:text-zinc-500 border-[#d4af37]/40'
                        : 'bg-white text-zinc-900 placeholder:text-zinc-400 border-[#d4af37]/40 shadow-sm'
                        }`}
                      placeholder="Your email address..."
                      type="email"
                    />
                  </div>
                  <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffe08d] via-[#d4af37] to-[#b38f26] hover:brightness-110 text-black font-label-md text-xs uppercase tracking-widest border border-[#ffe08d]/80 shadow-lg transition-all font-bold cursor-pointer flex items-center justify-center gap-2" type="submit">
                    <span>Join Le Cercle Privé</span>
                    <span className="material-symbols-outlined text-sm text-black">arrow_forward</span>
                  </button>
                </form>
              )}
              <p className={`font-label-sm text-[0.625rem] leading-tight ${darkMode ? 'text-zinc-500' : 'text-zinc-400'
                }`}>Discreet unsubscribe at any time. We honor your personal sanctuary.</p>
            </div>

          </div>

          {/* Bottom Row: Full-Width Clinical Trust Standards & Copyright Bar */}
          <div className={`pt-8 flex flex-col xl:flex-row items-center justify-between gap-5 font-label-sm text-[0.7rem] sm:text-xs text-center xl:text-left ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6">
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="material-symbols-outlined text-base text-[#d4af37]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Hospital-Grade Autoclave Sterilization
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="material-symbols-outlined text-base text-[#d4af37]">eco</span>
                10-Free & Vegan Japanese Gel
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="material-symbols-outlined text-base text-[#d4af37]">spa</span>
                100% Non-Toxic & Plate-Safe
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="material-symbols-outlined text-base text-[#d4af37]">lock</span>
                Encrypted Concierge Protocol
              </span>
            </div>

            {/* Copyright & Quick Navigation */}
            <div className={`flex flex-wrap items-center justify-center xl:justify-end gap-4 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
              <span>© 2025 Fakhama Nails Haute Atelier Inc. All rights reserved.</span>
              <span className="text-[#d4af37]/50 hidden sm:inline">•</span>
              <a className="hover:text-[#d4af37] transition-colors" href="#">Privacy Policy</a>
              <span className="text-[#d4af37]/50 hidden sm:inline">•</span>
              <a className="hover:text-[#d4af37] transition-colors" href="#">Atelier Protocol</a>
              <span className="text-[#d4af37]/50 hidden sm:inline">•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-bold transition-colors inline-flex items-center gap-1 cursor-pointer text-[#d4af37] hover:brightness-125"
                title="Return to top of page"
              >
                <span>Back to Top</span>
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
              </button>
            </div>

          </div>

        </div>
      </footer>

      {/* Quick Floating Theme Switcher Button */}
      <aside aria-label="Theme mode switcher" className="fixed bottom-6 left-6 z-40">
        <button
          id="theme-toggle-floating"
          onClick={toggleTheme}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer ${darkMode
            ? 'bg-[#121212]/92 hover:bg-[#1a1a1a] text-white border-[#d4af37]/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 hover:bg-amber-50/90 text-zinc-900 border-[#d4af37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.25)]'
            }`}
          title={darkMode ? 'Switch to Champagne Light Mode' : 'Switch to Haute Dark Mode'}
        >
          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 ${darkMode ? 'bg-white/10 text-[#ffe08d]' : 'bg-amber-100 text-amber-900'
            }`}>
            <span className="material-symbols-outlined text-sm sm:text-base">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </div>
          <span className="font-label-sm text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </aside>

      {/* ============================================================== */}
      {/* FIXED LUXURY WHATSAPP CONCIERGE BUTTON (Bottom Right)          */}
      {/* ============================================================== */}
      <aside aria-label="Direct WhatsApp Concierge" className="fixed bottom-6 right-6 z-50">
        <a
          id="fixed-whatsapp-button"
          href={`https://wa.me/${(siteSettings.whatsapp || siteSettings.phoneRaw || '+21692760840').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً Fakhama Nails، أود الاستفسار وحجز موعد VIP في الأتيليه.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Fakhama Nails via WhatsApp"
          className="group relative flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-3.5 pr-3.5 sm:pr-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#128C7E] via-[#25D366] to-[#20ba5a] text-white shadow-[0_12px_35px_rgba(37,211,102,0.45)] hover:shadow-[0_16px_45px_rgba(37,211,102,0.65)] border-2 border-[#ffe08d] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Direct VIP Concierge on WhatsApp"
        >
          {/* Subtle Ambient Pulse Ping Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping -z-10 pointer-events-none"></span>

          {/* WhatsApp Brand Icon with Online Status Badge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            {/* Live Online Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 border-2 border-white animate-pulse"></span>
          </div>
        </a>
      </aside>

    </div>
  );
}
