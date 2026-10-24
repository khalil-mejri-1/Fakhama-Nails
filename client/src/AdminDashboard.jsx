import React, { useState } from 'react';

const ensureDT = (price) => {
  if (!price) return '0 DT';
  let s = String(price).replace('$', '').trim();
  if (!s.toUpperCase().includes('DT')) {
    s = `${s} DT`;
  }
  return s;
};

export default function AdminDashboard({ 
  siteSettings, 
  onUpdateSiteSettings, 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder,
  onAddOrder, 
  appointments = [],
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onNavigateToStore 
}) {
  // Navigation tab state - default to 'appointments' for immediate mobile access
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'site' | 'products' | 'orders' | 'dashboard'
  
  // Local form state for Site Settings
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Appointments & Revenues Filter & Search state
  const [apptSearchQuery, setApptSearchQuery] = useState('');
  const [apptStatusFilter, setApptStatusFilter] = useState('ALL'); // 'ALL' | 'confirmed' | 'completed' | 'pending' | 'cancelled'
  const [revenueDateFilter, setRevenueDateFilter] = useState('today'); // 'today' | 'this_week' | 'this_month' | 'custom_date' | 'all'
  const [selectedCustomDate, setSelectedCustomDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // Card Collapsible state for Appointments (hide/show details to save mobile space)
  const [collapsedCards, setCollapsedCards] = useState({}); // { [apptId]: boolean }
  const [allCardsCollapsed, setAllCardsCollapsed] = useState(false); // Global toggle state

  const toggleCardCollapse = (apptId) => {
    setCollapsedCards((prev) => {
      const current = prev[apptId] !== undefined ? prev[apptId] : allCardsCollapsed;
      return { ...prev, [apptId]: !current };
    });
  };

  const toggleAllCardsCollapse = () => {
    setAllCardsCollapsed((prev) => {
      const next = !prev;
      setCollapsedCards({}); // Reset individual overrides so all sync with new global mode
      return next;
    });
  };

  const isCardCollapsed = (apptId) => {
    if (collapsedCards[apptId] !== undefined) {
      return collapsedCards[apptId];
    }
    return allCardsCollapsed;
  };

  // Appointment Modal state (New or Edit)
  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [apptFormData, setApptFormData] = useState({
    clientName: '',
    clientPhone: '',
    date: '',
    duration: '',
    price: '120',
    serviceName: 'The Signature Russian Manicure',
    status: 'confirmed',
    notes: ''
  });

  // Delete appointment confirmation modal state
  const [apptToDelete, setApptToDelete] = useState(null);

  // Quick Action Celebration Toast
  const [apptToastMessage, setApptToastMessage] = useState(null);

  const triggerApptToast = (msg) => {
    setApptToastMessage(msg);
    setTimeout(() => setApptToastMessage(null), 4000);
  };

  // Search & Filter state for Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Product tab filter state ('press-on' | 'services')
  const [productCategoryTab, setProductCategoryTab] = useState('press-on');
  
  // Product Add / Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for new, object for edit
  const [productFormData, setProductFormData] = useState({
    title: '',
    price: '',
    desc: '',
    category: 'Press-On',
    image: '',
    inStock: true
  });

  // Manual Order Modal state
  const [manualOrderModalOpen, setManualOrderModalOpen] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    clientName: '',
    clientPhone: '',
    item: 'The Signature Russian Manicure',
    type: 'Service',
    price: '120 DT',
    date: 'Demain, 14:00',
    notes: 'Réservation manuelle Atelier'
  });

  // Handle saving Site Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3500);
  };

  // Open Product Modal (New or Edit)
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      title: '',
      price: '95 DT',
      desc: 'Création artisanale sur mesure Fakhama Atelier',
      category: productCategoryTab === 'press-on' ? 'Press-On' : 'Russian Manicure',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800',
      inStock: true
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      title: prod.title,
      price: ensureDT(prod.price),
      desc: prod.desc || prod.description || '',
      category: prod.category || 'Press-On',
      image: prod.image || '',
      inStock: prod.inStock !== false
    });
    setProductModalOpen(true);
  };

  const handleSaveProductModal = (e) => {
    e.preventDefault();
    const formattedPrice = ensureDT(productFormData.price);
    if (editingProduct) {
      if (editingProduct.duration) {
        // It's a service
        onUpdateService(editingProduct.id, {
          title: productFormData.title,
          price: formattedPrice,
          description: productFormData.desc,
          category: productFormData.category,
          image: productFormData.image
        });
      } else {
        // It's a press-on product
        onUpdateProduct(editingProduct.id, {
          title: productFormData.title,
          price: formattedPrice,
          desc: productFormData.desc,
          category: productFormData.category,
          image: productFormData.image,
          inStock: productFormData.inStock
        });
      }
    } else {
      if (productCategoryTab === 'services') {
        onAddService({
          title: productFormData.title,
          price: formattedPrice,
          description: productFormData.desc,
          category: productFormData.category,
          image: productFormData.image,
          duration: '75 Mins',
          tag: 'Haute Prestation',
          features: ['Soin des cuticules haute précision', 'Renforcement apex sur mesure']
        });
      } else {
        onAddProduct({
          title: productFormData.title,
          price: formattedPrice,
          desc: productFormData.desc,
          category: 'Press-On',
          image: productFormData.image,
          inStock: productFormData.inStock
        });
      }
    }
    setProductModalOpen(false);
  };

  const handleSaveManualOrder = (e) => {
    e.preventDefault();
    onAddOrder({
      ...manualOrderForm,
      price: ensureDT(manualOrderForm.price),
      status: 'Confirmée'
    });
    setManualOrderModalOpen(false);
    setManualOrderForm({
      clientName: '',
      clientPhone: '',
      item: 'The Signature Russian Manicure',
      type: 'Service',
      price: '120 DT',
      date: 'Demain, 14:00',
      notes: ''
    });
  };

  // ==============================================================
  // APPOINTMENT HANDLERS & REVENUE CALCULATIONS
  // ==============================================================

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const getNowDateTimeLocal = () => {
    const now = new Date();
    const Y = now.getFullYear();
    const M = String(now.getMonth() + 1).padStart(2, '0');
    const D = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${Y}-${M}-${D}T${h}:${m}`;
  };

  const openNewApptModal = () => {
    setEditingAppt(null);
    setApptFormData({
      clientName: '',
      clientPhone: '',
      date: getNowDateTimeLocal(),
      duration: '60 min',
      price: '120',
      serviceName: 'The Signature Russian Manicure',
      status: 'confirmed',
      notes: ''
    });
    setApptModalOpen(true);
  };

  const openEditApptModal = (appt) => {
    setEditingAppt(appt);
    setApptFormData({
      clientName: appt.clientName || '',
      clientPhone: appt.clientPhone || '',
      date: appt.date || getNowDateTimeLocal(),
      duration: appt.duration || '',
      price: String(appt.price || '120'),
      serviceName: appt.serviceName || 'The Signature Russian Manicure',
      status: appt.status || 'confirmed',
      notes: appt.notes || ''
    });
    setApptModalOpen(true);
  };

  const handleSaveApptModal = (e) => {
    e.preventDefault();
    if (!apptFormData.clientName || !apptFormData.date) {
      alert('Veuillez renseigner le nom de la cliente et la date de la séance');
      return;
    }

    const numericPrice = parseFloat(String(apptFormData.price).replace(/[^0-9.]/g, '')) || 0;

    if (editingAppt) {
      onUpdateAppointment(editingAppt.id, {
        clientName: apptFormData.clientName,
        clientPhone: apptFormData.clientPhone,
        date: apptFormData.date,
        duration: apptFormData.duration,
        price: numericPrice,
        serviceName: apptFormData.serviceName,
        status: apptFormData.status,
        notes: apptFormData.notes
      });
      triggerApptToast(`Rendez-vous pour ${apptFormData.clientName} mis à jour avec succès !`);
    } else {
      onAddAppointment({
        clientName: apptFormData.clientName,
        clientPhone: apptFormData.clientPhone,
        date: apptFormData.date,
        duration: apptFormData.duration,
        price: numericPrice,
        serviceName: apptFormData.serviceName,
        status: apptFormData.status,
        notes: apptFormData.notes
      });
      triggerApptToast(`Nouveau rendez-vous pour ${apptFormData.clientName} enregistré en BD !`);
    }
    setApptModalOpen(false);
  };

  const handleToggleApptCompleted = (appt) => {
    if (appt.status === 'completed') {
      onUpdateAppointment(appt.id, { status: 'confirmed' });
      triggerApptToast(`Statut de la séance réinitialisé à Confirmée.`);
    } else if (appt.status === 'pending') {
      onUpdateAppointment(appt.id, { status: 'confirmed' });
      triggerApptToast(`Séance de ${appt.clientName} confirmée !`);
    } else if (appt.status === 'cancelled') {
      onUpdateAppointment(appt.id, { status: 'confirmed' });
      triggerApptToast(`Séance de ${appt.clientName} réactivée (Confirmée).`);
    } else {
      onUpdateAppointment(appt.id, { status: 'completed' });
      triggerApptToast(`Séance de ${appt.clientName} marquée comme complétée (${appt.price} DT encaissés) ! 💰`);
    }
  };

  const handleConfirmDeleteAppt = () => {
    if (apptToDelete) {
      onDeleteAppointment(apptToDelete.id);
      triggerApptToast(`Rendez-vous de ${apptToDelete.clientName} supprimé avec succès.`);
      setApptToDelete(null);
    }
  };

  const formatFrenchDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatArabicDate = formatFrenchDate;

  const formatTimeOnly = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split('T');
        return parts[1] || dateStr;
      }
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const todayStr = getTodayStr();

  const isSameWeek = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return d >= startOfWeek && d < endOfWeek;
  };

  const isSameMonth = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const dateFilteredAppointments = appointments.filter((appt) => {
    const apptDate = (appt.date || '').slice(0, 10);
    if (revenueDateFilter === 'today') {
      return apptDate === todayStr;
    }
    if (revenueDateFilter === 'this_week') {
      return isSameWeek(appt.date);
    }
    if (revenueDateFilter === 'this_month') {
      return isSameMonth(appt.date);
    }
    if (revenueDateFilter === 'custom_date') {
      return apptDate === selectedCustomDate;
    }
    return true; // 'all'
  });

  const realizedRevenue = dateFilteredAppointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);

  const projectedRevenue = dateFilteredAppointments
    .filter((a) => a.status === 'confirmed' || a.status === 'pending')
    .reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);

  const totalPeriodRevenue = realizedRevenue + projectedRevenue;

  const completedCount = dateFilteredAppointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = dateFilteredAppointments.filter((a) => a.status === 'confirmed').length;
  const totalPeriodCount = dateFilteredAppointments.length;

  const averageTicket = completedCount > 0
    ? Math.round(realizedRevenue / completedCount)
    : (totalPeriodCount > 0 ? Math.round(totalPeriodRevenue / totalPeriodCount) : 0);

  const displayedAppointments = dateFilteredAppointments.filter((appt) => {
    const matchesStatus = apptStatusFilter === 'ALL' || appt.status === apptStatusFilter;
    const q = apptSearchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      appt.clientName?.toLowerCase().includes(q) ||
      appt.clientPhone?.includes(q) ||
      appt.serviceName?.toLowerCase().includes(q) ||
      appt.notes?.toLowerCase().includes(q) ||
      appt.date?.includes(q);
    return matchesStatus && matchesSearch;
  });

  const sortedAppointments = [...displayedAppointments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const appointmentsByDay = sortedAppointments.reduce((acc, appt) => {
    const dayKey = (appt.date || '').slice(0, 10) || 'Sans date';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(appt);
    return acc;
  }, {});

  // Today count badge
  const todayAppointmentsCount = appointments.filter(a => (a.date || '').slice(0, 10) === todayStr).length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;
    const matchesSearch = 
      order.clientName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.clientPhone?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.item?.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingOrdersCount = orders.filter(o => o.status === 'En attente').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'Confirmée').length;

  return (
    <div className="min-h-screen bg-[#080808] text-[#f7efe9] font-sans antialiased flex flex-col selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* Toast Notification: Settings (Compact Green Background) */}
      {settingsSavedToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-50 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border border-emerald-400/70 text-white shadow-[0_8px_25px_rgba(16,185,129,0.35)] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 max-w-[92vw] sm:max-w-md">
          <div className="w-5 h-5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold text-[0.65rem] shrink-0">
            ✓
          </div>
          <div className="text-xs font-bold text-emerald-50 truncate">
            Paramètres enregistrés avec succès !
          </div>
        </div>
      )}

      {/* Appointment Action Toast (Compact Luxury Green Background) */}
      {apptToastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-50 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border border-emerald-400/70 text-white shadow-[0_8px_25px_rgba(16,185,129,0.35)] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 max-w-[92vw] sm:max-w-md">
          <div className="w-5 h-5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center font-black text-[0.65rem] shrink-0">
            ✓
          </div>
          <div className="text-xs font-bold text-emerald-50 truncate">
            {apptToastMessage}
          </div>
          <button
            type="button"
            onClick={() => setApptToastMessage(null)}
            className="text-emerald-200/60 hover:text-white text-xs ml-1 cursor-pointer shrink-0"
            title="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP ATELIER EXECUTIVE HEADER */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-b border-[#d4af37]/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink">
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display-hero text-base sm:text-xl font-bold tracking-tight text-white leading-none truncate">
                  Fakhama Nails
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffe08d] text-[0.55rem] sm:text-[0.625rem] font-bold uppercase tracking-wider shrink-0">
                  Admin
                </span>
              </div>
              <p className="text-[0.58rem] sm:text-[0.6875rem] text-[#ffe08d]/70 tracking-wider sm:tracking-widest uppercase font-semibold truncate hidden xs:block mt-0.5">
                Haute Atelier SoHo Executive Suite
              </p>
            </div>
          </div>

          {/* Quick Stats Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#d4af37]/20 text-xs text-white/80">
            <div className="flex items-center gap-1.5 text-[#ffe08d]">
              <span className="material-symbols-outlined text-sm">phone</span>
              <span>Tél Actuel : <strong className="text-white">{siteSettings.phone}</strong></span>
            </div>
          </div>

          {/* Actions & Storefront Link (Mobile-friendly) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToStore}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#ffe08d]/10 hover:from-[#d4af37]/30 hover:to-[#ffe08d]/20 text-[#ffe08d] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer group shrink-0 whitespace-nowrap"
              title="Retourner vers le site public"
            >
              <span className="hidden sm:inline">Voir le Site Client</span>
              <span className="sm:hidden text-[0.6875rem]">Site Public</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                open_in_new
              </span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS BAR (Smooth Mobile Scrolling) */}
        <div className="max-w-[1500px] mx-auto px-3 sm:px-8 flex items-center gap-1.5 sm:gap-3 overflow-x-auto border-t border-white/5 py-2 no-scrollbar touch-pan-x">
          
          {/* TAB 0: APPOINTMENTS & REVENUES (USER PRIORITY) */}
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-[#d4af37]/30 to-[#ffe08d]/20 text-[#ffe08d] border-2 border-[#d4af37] shadow-[0_4px_16px_rgba(212,175,55,0.35)]'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">calendar_month</span>
            <span className="hidden xs:inline">Rendez-vous & Revenus</span>
            <span className="xs:hidden">Rendez-vous</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#d4af37]/30 text-[#ffe08d] text-[0.625rem] font-extrabold border border-[#d4af37]/40">
              {appointments.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('site')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'site'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">tune</span>
            <span className="hidden xs:inline">Gestion de Site</span>
            <span className="xs:hidden">Site</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">diamond</span>
            <span className="hidden xs:inline">Gestion de Produits</span>
            <span className="xs:hidden">Produits</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[0.625rem] text-white">
              {products.length + services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">shopping_bag</span>
            <span className="hidden xs:inline">Commandes</span>
            <span className="xs:hidden">Cmd</span>
            {pendingOrdersCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[0.625rem] font-extrabold animate-pulse">
                {pendingOrdersCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[0.625rem] text-white">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">monitoring</span>
            <span className="hidden xs:inline">Tableau de Bord</span>
            <span className="xs:hidden">Stats</span>
          </button>

        </div>
      </header>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 py-8">
        
        {/* ============================================================== */}
        {/* TAB 1: GESTION DE SITE (Configuration Globale & Numéro de Tél) */}
        {/* ============================================================== */}
        {activeTab === 'site' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffe08d] text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  Paramètres Globaux du Site
                </div>
                <h2 className="font-display-hero text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gestion de Site & Coordonnées
                </h2>
                <p className="text-sm text-white/70 mt-1 max-w-2xl">
                  Modifiez ici le numéro de téléphone, l'adresse ou les horaires d'un seul endroit : les modifications s'appliquent immédiatement sur l'ensemble du site web.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffe08d] to-[#d4af37] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Enregistrer & Diffuser</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Formulaire Principal (Left Column) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. SECTION CRITIQUE : NUMÉRO DE TÉLÉPHONE (USER REQUEST) */}
                <div className="p-6 rounded-2xl bg-[#121212] border-2 border-[#d4af37]/50 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-gradient-to-l from-[#d4af37] to-[#ffe08d] text-black text-[0.625rem] font-black uppercase tracking-wider">
                    ★ Modification Globale
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-black text-[#ffe08d] border border-[#d4af37]/60 flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-xl">call</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Numéro de Téléphone Officiel</h3>
                      <p className="text-xs text-white/60">S'actualise dans la Navbar, le Hero, le Footer et les boutons d'appel.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#ffe08d] font-bold mb-1.5">
                        Numéro Affiché (Format Texte)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="(212) 555-FAKHAMA"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#d4af37]/40 text-white font-mono text-sm focus:outline-none focus:border-[#ffe08d] focus:ring-1 focus:ring-[#ffe08d]"
                      />
                      <span className="text-[0.6875rem] text-white/50 mt-1 block">Exemple: (212) 555-FAKHAMA ou +33 1 42 68 55 00</span>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#ffe08d] font-bold mb-1.5">
                        Lien d'Appel Direct (tel:)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneRaw}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneRaw: e.target.value })}
                        placeholder="+12125553254"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#d4af37]/40 text-white font-mono text-sm focus:outline-none focus:border-[#ffe08d] focus:ring-1 focus:ring-[#ffe08d]"
                      />
                      <span className="text-[0.6875rem] text-white/50 mt-1 block">Sans espaces pour le clic mobile (ex: +12125553254)</span>
                    </div>
                  </div>
                </div>

                {/* 2. ADRESSE & EMAIL CONCIERGE */}
                <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-white/5 text-[#ffe08d] border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Atelier & Conciergerie</h3>
                      <p className="text-xs text-white/50">Adresse physique et contact officiel.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                        Adresse de l'Atelier
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                        Email Concierge
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                      Sous-titre / En-tête de marque
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      placeholder="Haute Atelier • SoHo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* 3. HORAIRES DU SANCTUAIRE */}
                <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-white/5 text-[#ffe08d] border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Horaires d'Ouverture</h3>
                      <p className="text-xs text-white/50">Affichés dans la section Atelier SoHo et le Footer.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                        Mardi – Vendredi
                      </label>
                      <input
                        type="text"
                        value={settingsForm.sanctuaryHoursWeekdays}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sanctuaryHoursWeekdays: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                        Samedi & Dimanche
                      </label>
                      <input
                        type="text"
                        value={settingsForm.sanctuaryHoursWeekends}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sanctuaryHoursWeekends: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Aperçu Visuel En Direct (Right Column) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#d4af37]/30 shadow-xl">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#ffe08d] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">visibility</span>
                    <span>Aperçu En Direct sur le Site</span>
                  </h4>

                  {/* 1. Aperçu Navbar */}
                  <div className="p-4 rounded-xl bg-white/95 text-black mb-4 border border-[#d4af37]/30 shadow-sm">
                    <span className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      1. Navbar En-Tête (Haut du site) :
                    </span>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="text-xs font-bold font-serif">Fakhama Nails</span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
                        <span className="material-symbols-outlined text-sm text-[#d4af37]">call</span>
                        <span>{settingsForm.phone || '(Numéro)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Aperçu Footer */}
                  <div className="p-4 rounded-xl bg-white/95 text-black mb-4 border border-[#d4af37]/30 shadow-sm">
                    <span className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      2. Footer • Direct Concierge :
                    </span>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
                      <p className="font-bold text-gray-800">Direct Concierge</p>
                      <p className="text-gray-600">{settingsForm.email}</p>
                      <p className="text-black font-bold font-mono">{settingsForm.phone}</p>
                    </div>
                  </div>

                  {/* Bouton d'action direct */}
                  <button
                    onClick={handleSaveSettings}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-black via-[#1c1c1c] to-black hover:brightness-125 text-[#ffe08d] text-xs font-bold uppercase tracking-widest border border-[#d4af37]/50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Valider les Coordonnées</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GESTION DE PRODUITS & RITUELS                         */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffe08d] text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  Catalogue Haute Joaillerie & Soins
                </div>
                <h2 className="font-display-hero text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gestion de Produits & Rituels
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Ajoutez, modifiez le prix, les descriptions ou supprimez les sets Press-On et les rituels de manucure.
                </p>
              </div>

              <button
                onClick={openNewProductModal}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Ajouter un Article</span>
              </button>
            </div>

            {/* Category Sub-tabs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProductCategoryTab('press-on')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  productCategoryTab === 'press-on'
                    ? 'bg-black text-[#ffe08d] border border-[#d4af37]/60 shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Press-On Nails Boutique ({products.length})
              </button>
              <button
                onClick={() => setProductCategoryTab('services')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  productCategoryTab === 'services'
                    ? 'bg-black text-[#ffe08d] border border-[#d4af37]/60 shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Rituels & Soins Atelier ({services.length})
              </button>
            </div>

            {/* Press-On Products Grid */}
            {productCategoryTab === 'press-on' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/30 shadow-lg flex flex-col justify-between group">
                    <div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10 relative">
                        <img src={prod.image} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider ${
                          prod.inStock !== false ? 'bg-emerald-500/90 text-black' : 'bg-rose-500/90 text-white'
                        }`}>
                          {prod.inStock !== false ? 'En Stock' : 'Épuisé'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-white text-base truncate">{prod.title}</h4>
                        <span className="font-display-hero text-lg font-bold text-[#ffe08d]">{prod.price}</span>
                      </div>
                      
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                        {prod.desc || 'Création couture sur mesure'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm text-[#d4af37]">edit</span>
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-2 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Salon Services Grid */}
            {productCategoryTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/30 shadow-lg flex flex-col justify-between group">
                    <div>
                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10 relative">
                        <img src={srv.image} alt={srv.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-[#ffe08d] text-[0.625rem] font-bold">
                          {srv.duration}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-white text-sm truncate">{srv.title}</h4>
                        <span className="font-display-hero text-base font-bold text-[#ffe08d]">{srv.price}</span>
                      </div>
                      
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => openEditProductModal(srv)}
                        className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm text-[#d4af37]">edit</span>
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => onDeleteService(srv.id)}
                        className="p-2 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: GESTION DE COMMANDES (Réservations & Achats)           */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffe08d] text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  Flux de Réservations & Commandes
                </div>
                <h2 className="font-display-hero text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gestion des Commandes Atelier
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Suivez en direct les demandes de rendez-vous et commandes passées par vos clientes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setManualOrderModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Nouvelle Commande</span>
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { key: 'ALL', label: 'Toutes', count: orders.length },
                  { key: 'En attente', label: 'En attente', count: pendingOrdersCount, badgeColor: 'bg-amber-500 text-black' },
                  { key: 'Confirmée', label: 'Confirmées', count: confirmedOrdersCount, badgeColor: 'bg-emerald-500 text-black' },
                  { key: 'Complétée', label: 'Complétées', count: orders.filter(o => o.status === 'Complétée').length }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setOrderStatusFilter(item.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === item.key
                        ? 'bg-black text-[#ffe08d] border border-[#d4af37]/60 shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[0.625rem] ${item.badgeColor || 'bg-white/10 text-white'}`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Rechercher par cliente, tél ou ID..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-[#121212] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 text-white/50 uppercase tracking-widest text-[0.65rem] border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Cliente</th>
                      <th className="py-3.5 px-4 font-bold">Prestation / Produit</th>
                      <th className="py-3.5 px-4 font-bold">Montant</th>
                      <th className="py-3.5 px-4 font-bold">Date & Heure</th>
                      <th className="py-3.5 px-4 font-bold">Statut</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-white/50 text-sm">
                          Aucune commande trouvée dans cette catégorie.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusStyles = {
                          'En attente': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
                          'Confirmée': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
                          'Complétée': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
                          'Annulée': 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        }[order.status] || 'bg-white/10 text-white border-white/20';

                        return (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Client */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-white">{order.clientName}</div>
                              <a href={`tel:${order.clientPhone}`} className="text-white/60 hover:text-[#ffe08d] text-[0.6875rem] flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[0.75rem]">phone</span>
                                <span>{order.clientPhone}</span>
                              </a>
                            </td>

                            {/* Item */}
                            <td className="py-4 px-4 max-w-[240px]">
                              <div className="font-semibold text-white truncate">{order.item}</div>
                              <span className="text-[0.625rem] text-[#ffe08d]/70 uppercase tracking-wider">
                                {order.type || 'Prestation'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-4 px-4 font-display-hero text-sm font-bold text-white">
                              {order.price}
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 text-white/70">
                              {order.date}
                            </td>

                            {/* Status Selector */}
                            <td className="py-4 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-bold border focus:outline-none cursor-pointer bg-black/60 ${statusStyles}`}
                              >
                                <option value="En attente">🟡 En attente</option>
                                <option value="Confirmée">🟢 Confirmée</option>
                                <option value="Complétée">🔵 Complétée</option>
                                <option value="Annulée">🔴 Annulée</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                                  title="Détails de la commande"
                                >
                                  <span className="material-symbols-outlined text-sm">visibility</span>
                                </button>
                                <button
                                  onClick={() => onDeleteOrder(order.id)}
                                  className="p-1.5 rounded-lg bg-rose-900/20 hover:bg-rose-900/50 text-rose-300 transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: GESTION DES RENDEZ-VOUS ET REVENUS (مواعيد الجلسات والمداخيل) */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-left" dir="ltr">
            
            {/* Header info & Add Button (Mobile-first) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#d4af37]/20">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffe08d] text-[0.625rem] sm:text-xs font-bold uppercase tracking-widest mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                  Atelier Haute Manucure & Finance Suite
                </div>
                <h2 className="font-display-hero text-xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  Planning des Rendez-vous & Chiffre d'Affaires
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
                  Organisation des séances clientes, suivi en temps réel des encaissements par date et synchronisation en base de données (BD).
                </p>
              </div>

              <button
                onClick={openNewApptModal}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffe08d] to-[#d4af37] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">add_circle</span>
                <span>Nouveau Rendez-vous</span>
              </button>
            </div>

            {/* ============================================================== */}
            {/* FINANCIAL REVENUE ANALYTICS PANEL (COMPACT & SLEEK)           */}
            {/* ============================================================== */}
            <div className="p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-[#d4af37]/35 shadow-xl space-y-2.5 sm:space-y-3.5">
              
              {/* Filter by Date Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4af37] text-base sm:text-xl">insights</span>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                      Analyse des Revenus par Date
                    </h3>
                    <p className="text-[0.625rem] sm:text-[0.6875rem] text-white/60">
                      Calcul automatique selon la période choisie
                    </p>
                  </div>
                </div>

                {/* Date Filter Buttons (Smooth Mobile Scroll) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x pr-2">
                  {[
                    { id: 'today', label: 'Aujourd\'hui' },
                    { id: 'this_week', label: 'Cette Semaine' },
                    { id: 'this_month', label: 'Ce Mois' },
                    { id: 'custom_date', label: 'Date Précise' },
                    { id: 'all', label: 'Tout l\'Historique' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setRevenueDateFilter(btn.id)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        revenueDateFilter === btn.id
                          ? 'bg-[#d4af37] text-black shadow-sm font-extrabold'
                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Picker Bar (Compact) */}
              {revenueDateFilter === 'custom_date' && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ffe08d] text-sm">calendar_today</span>
                    <span className="text-xs font-bold text-white">Date à analyser :</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="date"
                      value={selectedCustomDate}
                      onChange={(e) => setSelectedCustomDate(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#d4af37]/50 text-white text-xs font-bold focus:outline-none focus:border-[#d4af37] [color-scheme:dark]"
                    />
                    <button
                      onClick={() => setSelectedCustomDate(todayStr)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-bold transition-colors cursor-pointer"
                    >
                      Aujourd'hui
                    </button>
                  </div>
                </div>
              )}

              {/* Period Summary Indicator Ribbon (Mobile-friendly, no ugly cutoffs) */}
              <div className="flex items-center justify-between text-[0.6875rem] sm:text-xs text-[#ffe08d]/90 bg-[#d4af37]/10 px-3 py-1.5 rounded-lg border border-[#d4af37]/20 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-xs sm:text-sm text-[#d4af37] shrink-0">schedule</span>
                  <span className="truncate">
                    Période :{' '}
                    <strong className="text-white">
                      {revenueDateFilter === 'today'
                        ? `Aujourd'hui`
                        : revenueDateFilter === 'this_week'
                        ? 'Cette Semaine'
                        : revenueDateFilter === 'this_month'
                        ? 'Ce Mois'
                        : revenueDateFilter === 'custom_date'
                        ? `${selectedCustomDate}`
                        : 'Tout l\'historique'}
                    </strong>
                  </span>
                </div>
                <div className="text-emerald-400 font-bold shrink-0 text-right">
                  {completedCount} / {totalPeriodCount} complétée{completedCount > 1 ? 's' : ''}
                </div>
              </div>

              {/* 4 Financial KPI Cards (2x2 on Mobile, 4 columns on Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                
                {/* 1. Realized Revenue */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/60 shadow-[0_4px_16px_rgba(212,175,55,0.12)] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wider text-emerald-400 font-bold truncate">
                      Encaissé
                    </span>
                    <span className="material-symbols-outlined text-xs sm:text-sm text-emerald-400 shrink-0">
                      payments
                    </span>
                  </div>
                  <div className="font-display-hero text-lg sm:text-2xl font-extrabold text-[#ffe08d] my-0.5 tracking-tight truncate">
                    {realizedRevenue.toLocaleString()} DT
                  </div>
                  <div className="text-[0.625rem] sm:text-xs text-white/50 truncate">
                    {completedCount} séance{completedCount > 1 ? 's' : ''} terminée{completedCount > 1 ? 's' : ''}
                  </div>
                </div>

                {/* 2. Projected / Total Revenue */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wider text-amber-300 font-bold truncate">
                      Prévisionnel
                    </span>
                    <span className="material-symbols-outlined text-xs sm:text-sm text-amber-400 shrink-0">
                      hourglass_top
                    </span>
                  </div>
                  <div className="font-display-hero text-lg sm:text-2xl font-bold text-white my-0.5 tracking-tight truncate">
                    {totalPeriodRevenue.toLocaleString()} DT
                  </div>
                  <div className="text-[0.625rem] sm:text-xs text-white/50 truncate">
                    {confirmedCount} confirmée{confirmedCount > 1 ? 's' : ''} ({projectedRevenue} DT)
                  </div>
                </div>

                {/* 3. Session Count */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wider text-white/70 font-bold truncate">
                      Séances
                    </span>
                    <span className="material-symbols-outlined text-xs sm:text-sm text-[#d4af37] shrink-0">
                      event_available
                    </span>
                  </div>
                  <div className="font-display-hero text-lg sm:text-2xl font-bold text-white my-0.5 tracking-tight truncate">
                    {totalPeriodCount}
                  </div>
                  <div className="text-[0.625rem] sm:text-xs text-white/50 truncate">
                    {completedCount} faite • {confirmedCount} prévue
                  </div>
                </div>

                {/* 4. Average Ticket */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wider text-white/70 font-bold truncate">
                      Panier Moyen
                    </span>
                    <span className="material-symbols-outlined text-xs sm:text-sm text-cyan-400 shrink-0">
                      query_stats
                    </span>
                  </div>
                  <div className="font-display-hero text-lg sm:text-2xl font-bold text-white my-0.5 tracking-tight truncate">
                    {averageTicket} DT
                  </div>
                  <div className="text-[0.625rem] sm:text-xs text-white/50 truncate">
                    Moyenne par séance
                  </div>
                </div>

              </div>

              {/* Progress bar towards completed revenue (Slim & Sleek) */}
              <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[0.6875rem] sm:text-xs font-bold text-white/80">
                  <span>Taux d'encaissement sur la période :</span>
                  <span className="text-emerald-400 font-extrabold">
                    {totalPeriodRevenue > 0 ? Math.round((realizedRevenue / totalPeriodRevenue) * 100) : 0}% encaissé
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalPeriodRevenue > 0 ? Math.min(100, Math.round((realizedRevenue / totalPeriodRevenue) * 100)) : 0}%`
                    }}
                  ></div>
                </div>
              </div>

            </div>

            {/* ============================================================== */}
            {/* SEARCH & STATUS FILTER TOOLBAR (MOBILE OPTIMIZED)              */}
            {/* ============================================================== */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#121212] border border-white/10">
              
              {/* Search input */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base sm:text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={apptSearchQuery}
                  onChange={(e) => setApptSearchQuery(e.target.value)}
                  placeholder="Rechercher cliente, tél, rituel..."
                  className="w-full pl-9 pr-14 py-2 sm:py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] placeholder:text-white/40"
                />
                {apptSearchQuery && (
                  <button
                    onClick={() => setApptSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-[0.6875rem] cursor-pointer px-1.5 py-0.5 rounded bg-white/10"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Status filter chips & Compact Mode Toggle (Smooth Mobile Scroll) */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x pr-2">
                
                {/* Global Compact Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleAllCardsCollapse}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border shadow-xs active:scale-95 ${
                    allCardsCollapsed
                      ? 'bg-[#d4af37] text-black border-[#d4af37] font-extrabold'
                      : 'bg-white/5 text-[#ffe08d] hover:bg-white/10 border-[#d4af37]/40'
                  }`}
                  title={allCardsCollapsed ? "Déplier toutes les séances" : "Mode compact : masquer les détails pour gagner de l'espace"}
                >
                  <span className="material-symbols-outlined text-sm">
                    {allCardsCollapsed ? 'unfold_more' : 'unfold_less'}
                  </span>
                  <span>{allCardsCollapsed ? 'Tout Déplier' : 'Mode Compact'}</span>
                </button>

                <div className="w-[1px] h-5 bg-white/15 shrink-0 mx-0.5"></div>

                {[
                  { id: 'ALL', label: 'Toutes', count: dateFilteredAppointments.length },
                  { id: 'confirmed', label: 'Confirmées', count: dateFilteredAppointments.filter(a => a.status === 'confirmed').length },
                  { id: 'completed', label: 'Complétées', count: dateFilteredAppointments.filter(a => a.status === 'completed').length },
                  { id: 'pending', label: 'En attente', count: dateFilteredAppointments.filter(a => a.status === 'pending').length },
                  { id: 'cancelled', label: 'Annulées', count: dateFilteredAppointments.filter(a => a.status === 'cancelled').length }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setApptStatusFilter(st.id)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      apptStatusFilter === st.id
                        ? 'bg-black text-[#ffe08d] border border-[#d4af37] shadow-sm'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[0.625rem]">
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* ============================================================== */}
            {/* APPOINTMENTS LIST (DAY-BY-DAY GROUPED TIMELINE FOR MOBILE)      */}
            {/* ============================================================== */}
            {Object.keys(appointmentsByDay).length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#121212] border border-white/10 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#d4af37]/10 text-[#ffe08d] flex items-center justify-center text-2xl sm:text-3xl">
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">event_busy</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1">
                    Aucun rendez-vous trouvé
                  </h3>
                  <p className="text-xs text-white/60 max-w-md mx-auto">
                    Aucune séance ne correspond aux critères sélectionnés. Vous pouvez modifier le filtre ou ajouter un nouveau rendez-vous.
                  </p>
                </div>
                <button
                  onClick={openNewApptModal}
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
                >
                  ➕ Nouveau Rendez-vous Maintenant
                </button>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {Object.keys(appointmentsByDay).map((dayKey) => {
                  const dayAppts = appointmentsByDay[dayKey];
                  const dayRealized = dayAppts
                    .filter((a) => a.status === 'completed')
                    .reduce((s, a) => s + (parseFloat(a.price) || 0), 0);
                  const dayTotal = dayAppts.reduce((s, a) => s + (parseFloat(a.price) || 0), 0);
                  const isToday = dayKey === todayStr;

                  return (
                    <div key={dayKey} className="space-y-3 sm:space-y-4">
                      
                      {/* Day Header & Day Revenue Pill (Mobile Optimized) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-4 rounded-2xl bg-[#141414] border border-[#d4af37]/30 shadow-md">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="material-symbols-outlined text-[#d4af37] text-lg sm:text-xl">event</span>
                          <span className="font-display-hero text-sm sm:text-lg font-bold text-white capitalize">
                            {formatFrenchDate(dayKey)}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-black text-[0.625rem] sm:text-xs font-black animate-pulse">
                              Aujourd'hui
                            </span>
                          )}
                        </div>

                        {/* Day Revenue Badge (Wrap-safe on mobile) */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[0.6875rem] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 border border-[#d4af37]/40 text-[#ffe08d] flex-wrap">
                          <span className="text-emerald-400">
                            💰 Encaissé : {dayRealized.toLocaleString()} DT
                          </span>
                          <span className="text-white/40">•</span>
                          <span>Total : {dayTotal.toLocaleString()} DT</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/80">({dayAppts.length})</span>
                        </div>
                      </div>

                      {/* Sessions Grid for this day (Compact & Mobile-First) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {dayAppts.map((appt) => {
                          const cleanPhone = (appt.clientPhone || '').replace(/[^0-9]/g, '');
                          const waReminderMsg = encodeURIComponent(
                            `Bonjour ${appt.clientName}, nous vous rappelons votre rendez-vous chez Fakhama Nails Haute Atelier le ${formatFrenchDate(appt.date)} à ${formatTimeOnly(appt.date)}. Au plaisir de vous accueillir !`
                          );
                          const waUrl = cleanPhone
                            ? `https://wa.me/${cleanPhone}?text=${waReminderMsg}`
                            : null;
                          const isCollapsed = isCardCollapsed(appt.id);

                          return (
                            <div
                              key={appt.id}
                              className={`rounded-xl bg-[#111111] border transition-all duration-200 relative flex flex-col justify-between hover:border-[#d4af37]/60 shadow-md ${
                                isCollapsed ? 'p-2.5 sm:p-3 gap-1.5' : 'p-3.5 sm:p-4 gap-2.5'
                              } ${
                                appt.status === 'completed'
                                  ? 'border-emerald-500/40 bg-gradient-to-b from-[#111111] to-emerald-950/15'
                                  : appt.status === 'confirmed'
                                  ? 'border-[#d4af37]/40 bg-gradient-to-b from-[#111111] to-[#1c1809]/20'
                                  : appt.status === 'pending'
                                  ? 'border-amber-500/40 bg-gradient-to-b from-[#111111] to-amber-950/15'
                                  : appt.status === 'cancelled'
                                  ? 'border-rose-500/35 bg-gradient-to-b from-[#111111] to-rose-950/15 opacity-80'
                                  : 'border-white/10'
                              }`}
                            >
                              <div>
                                {/* Header Row: Time, Name, Price & Expand/Collapse Toggle */}
                                <div
                                  onClick={() => toggleCardCollapse(appt.id)}
                                  className="flex items-center justify-between gap-2 cursor-pointer select-none group/hdr"
                                  title={isCollapsed ? "Cliquer pour afficher les détails" : "Cliquer pour masquer les détails"}
                                >
                                  <div className="min-w-0 flex-1 flex items-center gap-2">
                                    {/* Time badge */}
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 font-bold text-white text-[0.6875rem] shrink-0">
                                      <span className="material-symbols-outlined text-[0.7rem] text-[#d4af37]">schedule</span>
                                      <span>{formatTimeOnly(appt.date)}</span>
                                    </span>

                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug truncate group-hover/hdr:text-[#ffe08d] transition-colors">
                                        {appt.clientName}
                                      </h4>
                                      {!isCollapsed && (
                                        <p className="text-[0.6875rem] text-[#ffe08d]/90 font-medium truncate mt-0.5">
                                          {appt.serviceName || 'Séance Haute Manucure'}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <div className="px-2 py-0.5 rounded-lg bg-black/80 border border-[#d4af37]/50 text-[#ffe08d] font-bold text-xs shadow-xs">
                                      {appt.price} DT
                                    </div>

                                    {/* Expand/Collapse Chevron Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardCollapse(appt.id);
                                      }}
                                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                                      title={isCollapsed ? "Afficher les détails" : "Masquer les détails"}
                                    >
                                      <span className="material-symbols-outlined text-sm sm:text-base">
                                        {isCollapsed ? 'expand_more' : 'expand_less'}
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                {/* COLLAPSED VIEW: Minimal 1-tap Status & Details Trigger */}
                                {isCollapsed && (
                                  <div className="flex items-center justify-between gap-2 pt-1 mt-1 border-t border-white/5 text-[0.6875rem]">
                                    {/* 1-tap quick status toggle in collapsed view */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const statusFlow = {
                                          pending: 'confirmed',
                                          confirmed: 'completed',
                                          completed: 'confirmed',
                                          cancelled: 'confirmed'
                                        };
                                        const nextStatus = statusFlow[appt.status] || 'confirmed';
                                        onUpdateAppointment(appt.id, { status: nextStatus });
                                        triggerApptToast(
                                          nextStatus === 'completed'
                                            ? `Séance de ${appt.clientName} encaissée (${appt.price} DT) ! 💰`
                                            : `Statut changé à : ${nextStatus === 'confirmed' ? 'Confirmée' : nextStatus}`
                                        );
                                      }}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                        appt.status === 'completed'
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                          : appt.status === 'confirmed'
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                          : appt.status === 'cancelled'
                                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                          : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                                      }`}
                                      title="Changer le statut en 1 clic"
                                    >
                                      <span>
                                        {appt.status === 'completed'
                                          ? '✓ Complétée'
                                          : appt.status === 'confirmed'
                                          ? '● Confirmée'
                                          : appt.status === 'cancelled'
                                          ? '✕ Annulée'
                                          : '⏳ En attente'}
                                      </span>
                                      <span className="material-symbols-outlined text-[0.6rem] opacity-50">sync</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardCollapse(appt.id);
                                      }}
                                      className="text-white/40 hover:text-white/80 text-[0.6875rem] flex items-center gap-0.5 cursor-pointer font-medium"
                                    >
                                      <span>Détails & Actions</span>
                                      <span className="material-symbols-outlined text-xs">expand_more</span>
                                    </button>
                                  </div>
                                )}

                                {/* EXPANDED VIEW: Full Details (Duration, Phone, Notes) */}
                                {!isCollapsed && (
                                  <div className="space-y-2 mt-2 pt-2 border-t border-white/5 animate-in fade-in duration-150">
                                    {/* Info Badges Row */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
                                      {/* Duration badge (optional) */}
                                      {appt.duration && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
                                          <span className="material-symbols-outlined text-[0.75rem]">timer</span>
                                          <span>{appt.duration}</span>
                                        </span>
                                      )}

                                      {/* Status badge with 1-tap quick cycle */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const statusFlow = {
                                            pending: 'confirmed',
                                            confirmed: 'completed',
                                            completed: 'confirmed',
                                            cancelled: 'confirmed'
                                          };
                                          const nextStatus = statusFlow[appt.status] || 'confirmed';
                                          onUpdateAppointment(appt.id, { status: nextStatus });
                                          triggerApptToast(
                                            nextStatus === 'completed'
                                              ? `Séance de ${appt.clientName} encaissée (${appt.price} DT) ! 💰`
                                              : `Statut changé à : ${nextStatus === 'confirmed' ? 'Confirmée' : nextStatus}`
                                          );
                                        }}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                          appt.status === 'completed'
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                            : appt.status === 'confirmed'
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            : appt.status === 'cancelled'
                                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                            : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                                        }`}
                                        title="Changer le statut en 1 clic"
                                      >
                                        <span>
                                          {appt.status === 'completed'
                                            ? '✓ Complétée'
                                            : appt.status === 'confirmed'
                                            ? '● Confirmée'
                                            : appt.status === 'cancelled'
                                            ? '✕ Annulée'
                                            : '⏳ En attente'}
                                        </span>
                                        <span className="material-symbols-outlined text-[0.6rem] opacity-50">sync</span>
                                      </button>
                                    </div>

                                    {/* Phone number link if available */}
                                    {appt.clientPhone && (
                                      <div className="text-[0.6875rem] text-white/70 flex items-center gap-1 font-mono">
                                        <span className="material-symbols-outlined text-[0.75rem] text-emerald-400">call</span>
                                        <a href={`tel:${appt.clientPhone}`} className="hover:text-white underline">
                                          {appt.clientPhone}
                                        </a>
                                      </div>
                                    )}

                                    {/* Notes if any - compact 1-line */}
                                    {appt.notes && (
                                      <p className="px-2 py-1 rounded-lg bg-black/40 border border-white/5 text-[0.6875rem] text-white/60 italic truncate leading-snug" title={appt.notes}>
                                        "{appt.notes}"
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* EXPANDED VIEW: Action Buttons (Hidden when collapsed!) */}
                              {!isCollapsed && (
                                <div className="pt-2 border-t border-white/10 space-y-1.5 animate-in fade-in duration-150">
                                  
                                  {/* 1. Primary Action Button: Colored dynamically by Status */}
                                  {appt.status === 'completed' ? (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleApptCompleted(appt)}
                                        className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-950/80 via-[#0d2a1d] to-emerald-950/80 hover:bg-emerald-900/60 border border-emerald-500/70 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                                        title="Séance encaissée. Cliquez pour modifier le statut."
                                      >
                                        <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                                        <span className="truncate">Séance Encaissée • {appt.price} DT ✓</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleApptCompleted(appt)}
                                        className="px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                                        title="Rétablir en séance confirmée"
                                      >
                                        <span className="material-symbols-outlined text-sm">undo</span>
                                      </button>
                                    </div>
                                  ) : appt.status === 'pending' ? (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleApptCompleted(appt)}
                                        className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-950/80 via-[#2a1b06] to-amber-950/80 hover:from-amber-900/80 hover:to-amber-950/80 border border-amber-500/70 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                                        title="Confirmer cette séance en attente"
                                      >
                                        <span className="material-symbols-outlined text-sm text-amber-400">hourglass_top</span>
                                        <span className="truncate">Confirmer la Séance</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onUpdateAppointment(appt.id, { status: 'completed' });
                                          triggerApptToast(`Séance de ${appt.clientName} confirmée et encaissée (${appt.price} DT) ! 💰`);
                                        }}
                                        className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black text-xs font-black uppercase tracking-wider shadow-xs hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
                                        title="Encaisser directement"
                                      >
                                        <span className="material-symbols-outlined text-sm">payments</span>
                                      </button>
                                    </div>
                                  ) : appt.status === 'cancelled' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleApptCompleted(appt)}
                                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-rose-950/70 via-[#2e0b12] to-rose-950/70 hover:from-rose-900/80 hover:to-rose-950/80 border border-rose-500/70 text-rose-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                                      title="Réactiver cette séance annulée"
                                    >
                                      <span className="material-symbols-outlined text-sm text-rose-400">event_busy</span>
                                      <span className="truncate">Séance Annulée • Réactiver</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleApptCompleted(appt)}
                                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#ffe08d] to-[#d4af37] hover:brightness-110 active:scale-[0.98] text-black text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_3px_14px_rgba(212,175,55,0.35)] group"
                                      title="Valider la prestation et enregistrer les revenus"
                                    >
                                      <span className="material-symbols-outlined text-sm transition-transform group-hover:scale-110">
                                        payments
                                      </span>
                                      <span className="truncate">Encaisser • {appt.price} DT</span>
                                    </button>
                                  )}

                                  {/* 2. Secondary Row: Compact Icons Bar (WhatsApp, Appel, Modifier, Supprimer) */}
                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    
                                    {/* Direct WhatsApp Concierge Button */}
                                    {cleanPhone ? (
                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-[2] py-1.5 px-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs truncate"
                                        title="Envoyer un rappel WhatsApp"
                                      >
                                        <span className="material-symbols-outlined text-sm">chat</span>
                                        <span>WhatsApp</span>
                                      </a>
                                    ) : (
                                      <div className="flex-[2] py-1.5 px-2 rounded-lg bg-white/5 text-white/30 text-[0.6875rem] font-medium text-center flex items-center justify-center">
                                        Pas de tél
                                      </div>
                                    )}

                                    {/* Direct Phone Call Button */}
                                    {appt.clientPhone ? (
                                      <a
                                        href={`tel:${appt.clientPhone}`}
                                        className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center"
                                        title="Appeler la cliente"
                                      >
                                        <span className="material-symbols-outlined text-sm text-[#ffe08d]">call</span>
                                      </a>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled
                                        className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 text-white/20 text-xs flex items-center justify-center cursor-not-allowed"
                                        title="Aucun numéro"
                                      >
                                        <span className="material-symbols-outlined text-sm">call_end</span>
                                      </button>
                                    )}

                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => openEditApptModal(appt)}
                                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#ffe08d] border border-[#d4af37]/30 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                                      title="Modifier la séance"
                                    >
                                      <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => setApptToDelete(appt)}
                                      className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/25 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                                      title="Supprimer la séance"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>

                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TABLEAU DE BORD (Statistiques & Vue d'ensemble)       */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div>
              <h2 className="font-display-hero text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Vue d'Ensemble de l'Atelier
              </h2>
              <p className="text-sm text-white/70 mt-1">
                Métriques clés de performance, chiffre d'affaires et activité récente.
              </p>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="p-6 rounded-2xl bg-[#121212] border border-[#d4af37]/35 shadow-lg relative overflow-hidden">
                <div className="text-[0.65rem] uppercase tracking-widest text-[#ffe08d] font-bold mb-1">
                  Chiffre d'Affaires Atelier
                </div>
                <div className="font-display-hero text-3xl font-bold text-white mb-2">
                  {(() => {
                    const total = orders.reduce((sum, ord) => {
                      const num = parseFloat(String(ord.price || '').replace(/[^0-9.]/g, '')) || 0;
                      return sum + num;
                    }, 0);
                    return total > 0 ? `${total.toLocaleString()} DT` : '4,860 DT';
                  })()}
                </div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  ↑ +18% ce mois • Prestations VIP
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#121212] border border-[#d4af37]/35 shadow-lg relative overflow-hidden">
                <div className="text-[0.65rem] uppercase tracking-widest text-[#ffe08d] font-bold mb-1">
                  Commandes en Cours
                </div>
                <div className="font-display-hero text-3xl font-bold text-white mb-2">
                  {pendingOrdersCount + confirmedOrdersCount}
                </div>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  ● {pendingOrdersCount} en attente d'attribution suite
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#121212] border border-[#d4af37]/35 shadow-lg relative overflow-hidden">
                <div className="text-[0.65rem] uppercase tracking-widest text-[#ffe08d] font-bold mb-1">
                  Catalogue Actif
                </div>
                <div className="font-display-hero text-3xl font-bold text-white mb-2">
                  {products.length + services.length}
                </div>
                <span className="text-xs text-white/60 font-medium">
                  {products.length} Press-On • {services.length} Rituels
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#121212] border border-[#d4af37]/35 shadow-lg relative overflow-hidden">
                <div className="text-[0.65rem] uppercase tracking-widest text-[#ffe08d] font-bold mb-1">
                  Satisfaction Atelier
                </div>
                <div className="font-display-hero text-3xl font-bold text-white mb-2">
                  4.99 ★
                </div>
                <span className="text-xs text-emerald-400 font-semibold">
                  12,000+ Manucures d'Exception
                </span>
              </div>

            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => { setActiveTab('appointments'); openNewApptModal(); }}
                className="p-4 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#ffe08d]/10 hover:from-[#d4af37]/30 hover:to-[#ffe08d]/20 border border-[#d4af37]/50 text-left transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-2xl text-[#ffe08d] mb-2 block">event_available</span>
                <h4 className="text-sm font-bold text-white mb-1">Nouveau Rendez-vous</h4>
                <p className="text-xs text-[#ffe08d]/70">Planifier une séance avec la cliente, date, tarif et enregistrement BD.</p>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl text-[#d4af37] mb-2 block">calendar_month</span>
                <h4 className="text-sm font-bold text-white mb-1">Planning & Revenus</h4>
                <p className="text-xs text-white/60">Suivi du chiffre d'affaires par date et gestion des séances ({appointments.length} rdv).</p>
              </button>

              <button
                onClick={() => setActiveTab('site')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl text-[#d4af37] mb-2 block">phone_in_talk</span>
                <h4 className="text-sm font-bold text-white mb-1">Modifier le Numéro de Tél</h4>
                <p className="text-xs text-white/60">Actualise le numéro partout sur le site instantanément.</p>
              </button>

              <button
                onClick={() => { setActiveTab('products'); openNewProductModal(); }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl text-[#d4af37] mb-2 block">add_box</span>
                <h4 className="text-sm font-bold text-white mb-1">Ajouter un Produit Press-On</h4>
                <p className="text-xs text-white/60">Créer un nouveau modèle de faux ongles réutilisables.</p>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: AJOUTER / MODIFIER UN PRODUIT                         */}
      {/* ============================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#d4af37]/50 shadow-2xl relative text-left">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/10 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display-hero text-xl font-bold text-white mb-1">
              {editingProduct ? 'Modifier l\'Article' : 'Nouveau Produit / Rituel'}
            </h3>
            <p className="text-xs text-white/60 mb-6">
              Remplissez les détails du produit. Ils seront visibles immédiatement sur la boutique client.
            </p>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Titre du Produit / Rituel
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.title}
                  onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                  placeholder="ex: Café au Lait Ombré"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                    Prix (DT)
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    placeholder="95 DT"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                    Catégorie
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Press-On">Press-On Nails</option>
                    <option value="Russian Manicure">Russian Manicure</option>
                    <option value="Foot Spa & Pedicure">Foot Spa & Pedicure</option>
                    <option value="Apres Gel-X Sculpting">Apres Gel-X Sculpting</option>
                    <option value="Haute 3D Art">Haute 3D Art</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  URL de l'Image
                </label>
                <input
                  type="url"
                  required
                  value={productFormData.image}
                  onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={productFormData.desc}
                  onChange={(e) => setProductFormData({ ...productFormData, desc: e.target.value })}
                  placeholder="Détails du produit ou de la formule..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productFormData.inStock}
                  onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37]"
                />
                <label htmlFor="inStockCheck" className="text-xs text-white/80 font-semibold cursor-pointer">
                  Produit en stock et disponible à la commande
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black text-xs font-extrabold uppercase tracking-widest hover:brightness-110 shadow-md transition-all cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: DÉTAILS D'UNE COMMANDE                                */}
      {/* ============================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#d4af37]/50 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/10 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-xl bg-black text-[#ffe08d] border border-[#d4af37]/60 flex items-center justify-center shadow-md mb-4">
              <span className="material-symbols-outlined text-2xl">receipt</span>
            </div>

            <div className="text-[0.65rem] text-[#ffe08d] uppercase tracking-widest font-mono font-bold mb-1">
              Commande #{selectedOrderDetails.id}
            </div>
            <h3 className="font-display-hero text-xl font-bold text-white mb-4">
              {selectedOrderDetails.item}
            </h3>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5 text-xs text-white/80 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Cliente :</span>
                <span className="font-bold text-white">{selectedOrderDetails.clientName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Téléphone :</span>
                <a href={`tel:${selectedOrderDetails.clientPhone}`} className="text-[#ffe08d] font-bold underline">
                  {selectedOrderDetails.clientPhone}
                </a>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Montant :</span>
                <span className="font-display-hero text-sm font-bold text-white">{selectedOrderDetails.price}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Date :</span>
                <span>{selectedOrderDetails.date}</span>
              </div>
              <div>
                <span className="text-white/50 block mb-1">Instructions / Notes :</span>
                <p className="p-2.5 rounded-lg bg-white/5 text-white/90 text-xs italic">
                  "{selectedOrderDetails.notes || 'Aucune note spécifique'}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${selectedOrderDetails.clientPhone}`}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Appeler Cliente</span>
              </a>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: AJOUTER COMMANDE MANUELLE (WALK-IN CLIENT)            */}
      {/* ============================================================== */}
      {manualOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#d4af37]/50 shadow-2xl relative text-left">
            <button
              onClick={() => setManualOrderModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/10 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-display-hero text-xl font-bold text-white mb-1">
              Créer une Commande / Réservation
            </h3>
            <p className="text-xs text-white/60 mb-6">
              Enregistrez manuellement une cliente venue à l'Atelier ou par téléphone.
            </p>

            <form onSubmit={handleSaveManualOrder} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Nom de la Cliente
                </label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.clientName}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, clientName: e.target.value })}
                  placeholder="ex: Céline Dion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Téléphone Cliente
                </label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.clientPhone}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, clientPhone: e.target.value })}
                  placeholder="+1 (212) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                    Prestation / Produit
                  </label>
                  <input
                    type="text"
                    required
                    value={manualOrderForm.item}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, item: e.target.value })}
                    placeholder="Signature Russian Manicure"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                    Prix (DT)
                  </label>
                  <input
                    type="text"
                    required
                    value={manualOrderForm.price}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, price: e.target.value })}
                    placeholder="120 DT"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Date / Heure demandée
                </label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.date}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, date: e.target.value })}
                  placeholder="Demain, 14:00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-bold mb-1">
                  Notes spéciales
                </label>
                <textarea
                  rows="2"
                  value={manualOrderForm.notes}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, notes: e.target.value })}
                  placeholder="Suite VIP, thé blanc..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setManualOrderModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffe08d] text-black text-xs font-extrabold uppercase tracking-widest hover:brightness-110 shadow-md transition-all cursor-pointer"
                >
                  Créer la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AJOUTER / MODIFIER UN RENDEZ-VOUS                     */}
      {/* ============================================================== */}
      {apptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#121212] rounded-3xl p-5 sm:p-8 max-w-lg w-full border-2 border-[#d4af37]/60 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-left my-8 max-h-[90vh] overflow-y-auto" dir="ltr">
            
            {/* Close Button */}
            <button
              onClick={() => setApptModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white text-xl w-9 h-9 flex items-center justify-center rounded-full bg-white/10 cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] text-[#ffe08d] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  {editingAppt ? 'edit_calendar' : 'add_circle'}
                </span>
              </div>
              <div>
                <h3 className="font-display-hero text-xl font-bold text-white">
                  {editingAppt ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous Atelier'}
                </h3>
                <p className="text-xs text-[#ffe08d]/80">
                  Enregistrement et synchronisation automatique en base de données (BD)
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveApptModal} className="space-y-4 mt-5">
              
              {/* 1. Client Name (Nom de la cliente - obligatoire) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5">
                  Nom de la Cliente <span className="text-[#d4af37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={apptFormData.clientName}
                  onChange={(e) => setApptFormData({ ...apptFormData, clientName: e.target.value })}
                  placeholder="Ex: Mouna Ben Salem"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              {/* 2. Client Phone (Téléphone de la cliente - optionnel) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5 flex items-center justify-between">
                  <span>Numéro de Téléphone (Appels & WhatsApp)</span>
                  <span className="text-[0.6875rem] text-white/50">Optionnel</span>
                </label>
                <input
                  type="tel"
                  value={apptFormData.clientPhone}
                  onChange={(e) => setApptFormData({ ...apptFormData, clientPhone: e.target.value })}
                  placeholder="Ex: +216 98 123 456"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* 3. Date & Time (Date et heure de la séance - obligatoire) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5">
                  Date et Heure de la Séance <span className="text-[#d4af37]">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={apptFormData.date}
                  onChange={(e) => setApptFormData({ ...apptFormData, date: e.target.value })}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors [color-scheme:dark]"
                />
              </div>

              {/* 4. Price & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Price (Tarif de la séance - obligatoire) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5">
                    Tarif de la Séance (DT) <span className="text-[#d4af37]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="5"
                      required
                      value={apptFormData.price}
                      onChange={(e) => setApptFormData({ ...apptFormData, price: e.target.value })}
                      placeholder="120"
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37] font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#ffe08d]">
                      DT
                    </span>
                  </div>
                </div>

                {/* Service Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5">
                    Type de Prestation / Rituel
                  </label>
                  <select
                    value={apptFormData.serviceName}
                    onChange={(e) => {
                      const val = e.target.value;
                      let suggestedPrice = apptFormData.price;
                      if (val.includes('Russian Manicure')) suggestedPrice = '120';
                      else if (val.includes('Pedicure')) suggestedPrice = '145';
                      else if (val.includes('Gel-X')) suggestedPrice = '175';
                      else if (val.includes('3D')) suggestedPrice = '210';
                      setApptFormData({ ...apptFormData, serviceName: val, price: suggestedPrice });
                    }}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="The Signature Russian Manicure">The Signature Russian Manicure (120 DT)</option>
                    <option value="Royal Rose Petal & Milk Pedicure">Royal Rose Petal & Milk Pedicure (145 DT)</option>
                    <option value="Apres Gel-X & Sculpted Extensions">Apres Gel-X & Extensions (175 DT)</option>
                    <option value="Couture 3D & Chrome Artistry">Couture 3D & Chrome Artistry (210 DT)</option>
                    <option value="Soin Manucure & Pédicure VIP">Soin Manucure & Pédicure VIP (180 DT)</option>
                    <option value="Prestation Personnalisée Sur Mesure">Prestation Personnalisée Sur Mesure</option>
                  </select>
                </div>

              </div>

              {/* 5. Expected Duration (Durée estimée de la séance - optionnelle) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5 flex items-center justify-between">
                  <span>Durée Estimée de la Séance</span>
                  <span className="text-[0.6875rem] text-[#ffe08d]">Optionnelle</span>
                </label>
                <input
                  type="text"
                  value={apptFormData.duration}
                  onChange={(e) => setApptFormData({ ...apptFormData, duration: e.target.value })}
                  placeholder="Ex: 60 min ou 1h30"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-sm focus:outline-none focus:border-[#d4af37]"
                />
                
                {/* Fast 1-Tap Duration Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[0.6875rem] text-white/50 mr-1">Sélection rapide :</span>
                  {['30 min', '45 min', '60 min', '75 min', '90 min', '120 min'].map((dur) => (
                    <button
                      type="button"
                      key={dur}
                      onClick={() => setApptFormData({ ...apptFormData, duration: dur })}
                      className={`px-2.5 py-1 rounded-lg text-[0.6875rem] font-bold transition-all cursor-pointer ${
                        apptFormData.duration === dur
                          ? 'bg-[#d4af37] text-black font-extrabold shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                  {apptFormData.duration && (
                    <button
                      type="button"
                      onClick={() => setApptFormData({ ...apptFormData, duration: '' })}
                      className="text-[0.6875rem] text-rose-400 hover:underline ml-1 cursor-pointer"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {/* 6. Status Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5">
                  Statut de la Séance
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'confirmed', label: 'Confirmée', color: 'border-amber-500 text-amber-300' },
                    { id: 'completed', label: 'Complétée (Encaissée)', color: 'border-emerald-500 text-emerald-300' },
                    { id: 'pending', label: 'En attente', color: 'border-slate-500 text-slate-300' },
                    { id: 'cancelled', label: 'Annulée', color: 'border-rose-500 text-rose-300' }
                  ].map((st) => (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => setApptFormData({ ...apptFormData, status: st.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                        apptFormData.status === st.id
                          ? `bg-black ${st.color} shadow-md border-2`
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Special Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 font-bold mb-1.5 flex items-center justify-between">
                  <span>Notes & Préférences Particulières</span>
                  <span className="text-[0.6875rem] text-white/50">Optionnel</span>
                </label>
                <textarea
                  rows="2"
                  value={apptFormData.notes}
                  onChange={(e) => setApptFormData({ ...apptFormData, notes: e.target.value })}
                  placeholder="Ex: Suite VIP 1, préférence teinte nude classique, thé menthe..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setApptModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffe08d] to-[#d4af37] text-black text-xs font-extrabold uppercase tracking-widest hover:brightness-110 shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>{editingAppt ? 'Enregistrer les Modifications' : 'Confirmer le Rendez-vous en BD'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CONFIRMATION DE SUPPRESSION DE RENDEZ-VOUS              */}
      {/* ============================================================== */}
      {apptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-rose-500/60 shadow-2xl relative text-left" dir="ltr">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <h3 className="font-display-hero text-xl font-bold text-white mb-2">
              Confirmer la Suppression du Rendez-vous
            </h3>
            
            <p className="text-xs sm:text-sm text-white/70 mb-4 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le rendez-vous de la cliente{' '}
              <strong className="text-white font-bold">{apptToDelete.clientName}</strong> prévu le{' '}
              <span className="text-[#ffe08d] font-bold">{formatFrenchDate(apptToDelete.date)}</span> au tarif de{' '}
              <span className="text-[#ffe08d] font-bold">{apptToDelete.price} DT</span> ?
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-rose-300/90 mb-6">
              ⚠️ Cette séance sera définitivement supprimée de la base de données (BD) et le calcul du chiffre d'affaires sera réactualisé.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setApptToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAppt}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-widest shadow-lg transition-all cursor-pointer"
              >
                Oui, Supprimer Définitivement
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
