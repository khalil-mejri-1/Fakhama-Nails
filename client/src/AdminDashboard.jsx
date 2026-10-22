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
  onNavigateToStore 
}) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('site'); // 'site' | 'products' | 'orders' | 'dashboard'
  
  // Local form state for Site Settings
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

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
      
      {/* Toast Notification */}
      {settingsSavedToast && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#080808] border-2 border-emerald-500/80 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-200">Enregistrement Réussi !</div>
            <div className="text-xs text-emerald-100/80">Le numéro de téléphone et les paramètres sont mis à jour sur tout le site.</div>
          </div>
        </div>
      )}

      {/* TOP ATELIER EXECUTIVE HEADER */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-b border-[#d4af37]/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display-hero text-xl font-bold tracking-tight text-white">
                  Fakhama Nails
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffe08d] text-[0.625rem] font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[0.6875rem] text-[#ffe08d]/70 tracking-widest uppercase font-semibold">
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

          {/* Actions & Storefront Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToStore}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#ffe08d]/10 hover:from-[#d4af37]/30 hover:to-[#ffe08d]/20 text-[#ffe08d] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer group"
              title="Retourner vers le site public"
            >
              <span>Voir le Site Client</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                open_in_new
              </span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 flex items-center gap-2 sm:gap-4 overflow-x-auto border-t border-white/5 py-2.5 no-scrollbar">
          
          <button
            onClick={() => setActiveTab('site')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'site'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">tune</span>
            <span>Gestion de Site</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">diamond</span>
            <span>Gestion de Produits</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[0.625rem] text-white">
              {products.length + services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">shopping_bag</span>
            <span>Gestion de Commandes</span>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[0.625rem] font-extrabold animate-pulse">
                {pendingOrdersCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-black text-[#ffe08d] border border-[#d4af37]/70 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">monitoring</span>
            <span>Tableau de Bord</span>
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
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <button
                onClick={() => setActiveTab('orders')}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl text-[#d4af37] mb-2 block">receipt_long</span>
                <h4 className="text-sm font-bold text-white mb-1">Consulter les Commandes</h4>
                <p className="text-xs text-white/60">Gérer les réservations et commandes clientes en direct.</p>
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

    </div>
  );
}
