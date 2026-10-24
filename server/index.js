import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Data Store (with persistence defaults)
let siteSettings = {
  phone: '(212) 555-FAKHAMA',
  phoneRaw: '+12125553254',
  email: 'concierge@fakhama.nails',
  address: '482 Broome Street, 2nd Fl, New York, NY 10013',
  sanctuaryHoursWeekdays: '10:00 AM – 8:00 PM',
  sanctuaryHoursWeekends: '9:30 AM – 7:00 PM',
  sanctuaryHoursMonday: 'Private Atelier VIP Suites by Reservation Only',
  announcement: 'Haute Atelier • SoHo',
  instagram: '@fakhama.nails',
  vipDiscount: '15%'
};

let products = [
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

let orders = [
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

// Hello World & Status
app.get('/', (req, res) => {
  res.send('Fakhama Nails Haute Atelier API is Running! v1');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Fakhama Nails API Active', status: 'success' });
});

// 1. Site Settings API
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: siteSettings });
});

app.post('/api/settings', (req, res) => {
  siteSettings = { ...siteSettings, ...req.body };
  res.json({ success: true, message: 'Paramètres du site mis à jour avec succès', settings: siteSettings });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  res.json({ success: true, products });
});

app.post('/api/products', (req, res) => {
  const rawPrice = req.body.price ? String(req.body.price).replace('$', '').trim() : '95';
  const formattedPrice = rawPrice.toUpperCase().includes('DT') ? rawPrice : `${rawPrice} DT`;

  const newProduct = {
    id: Date.now(),
    title: req.body.title || 'Nouveau Produit Haute Couture',
    price: formattedPrice,
    desc: req.body.desc || 'Création artisanale sur mesure Fakhama Atelier',
    category: req.body.category || 'Press-On',
    inStock: req.body.inStock !== false,
    image: req.body.image || 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800'
  };
  products.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, product: products[index] });
  } else {
    res.status(404).json({ success: false, message: 'Produit non trouvé' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: 'Produit supprimé avec succès' });
});

// 3. Orders API
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `FKN-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: req.body.clientName || 'Cliente VIP',
    clientPhone: req.body.clientPhone || siteSettings.phone,
    item: req.body.item || 'Bespoke Atelier Service',
    type: req.body.type || 'Service',
    price: req.body.price || '$120',
    date: req.body.date || 'Aujourd\'hui, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: req.body.status || 'En attente',
    notes: req.body.notes || 'Réservé via le site client'
  };
  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);
  if (order) {
    if (req.body.status) order.status = req.body.status;
    if (req.body.notes) order.notes = req.body.notes;
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Commande non trouvée' });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  orders = orders.filter(o => o.id !== id);
  res.json({ success: true, message: 'Commande supprimée avec succès' });
});

// ==============================================================
// 4. APPOINTMENTS & SESSIONS API (مواعيد الجلسات والمداخيل - BD)
// ==============================================================

// Mongoose Schema for MongoDB Atlas
const appointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, default: '' },
  date: { type: String, required: true }, // e.g. "2026-10-24T14:30"
  duration: { type: String, default: '' }, // e.g. "60 min" (اختيارية)
  price: { type: Number, required: true, default: 0 },
  priceFormatted: { type: String, default: '' },
  serviceName: { type: String, default: 'The Signature Russian Manicure' },
  status: { type: String, enum: ['confirmed', 'completed', 'pending', 'cancelled'], default: 'confirmed' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// Helper: load appointments from MongoDB or file-based DB
const getAppointmentsData = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await Appointment.find().sort({ date: 1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map(d => ({
          id: d.id,
          clientName: d.clientName,
          clientPhone: d.clientPhone || '',
          date: d.date,
          duration: d.duration || '',
          price: d.price,
          priceFormatted: d.priceFormatted || `${d.price} DT`,
          serviceName: d.serviceName || 'The Signature Russian Manicure',
          status: d.status || 'confirmed',
          notes: d.notes || '',
          createdAt: d.createdAt
        }));
      }
    } catch (e) {
      console.warn('MongoDB appointments query warning:', e.message);
    }
  }

  // Fallback to persistent file
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('File DB read error:', err.message);
  }
  return [];
};

// Helper: save appointments to persistent file
const saveAppointmentsToFile = (list) => {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('File DB write error:', err.message);
  }
};

// GET all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const list = await getAppointmentsData();
    res.json({ success: true, appointments: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      clientName,
      clientPhone = '',
      date,
      duration = '',
      price = 0,
      serviceName = 'The Signature Russian Manicure',
      status = 'confirmed',
      notes = ''
    } = req.body;

    if (!clientName || !date) {
      return res.status(400).json({ success: false, message: 'Le nom de la cliente et la date de la séance sont obligatoires' });
    }

    const numericPrice = typeof price === 'number'
      ? price
      : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
    const priceFormatted = `${numericPrice} DT`;
    const newId = req.body.id || `APP-${Date.now().toString().slice(-6)}`;

    const newAppointment = {
      id: newId,
      clientName,
      clientPhone,
      date,
      duration,
      price: numericPrice,
      priceFormatted,
      serviceName,
      status,
      notes,
      createdAt: new Date().toISOString()
    };

    // Save to persistent file
    const currentList = await getAppointmentsData();
    const updatedList = [newAppointment, ...currentList.filter(a => a.id !== newId)];
    saveAppointmentsToFile(updatedList);

    // Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Appointment.findOneAndUpdate(
          { id: newId },
          { ...newAppointment, updatedAt: new Date() },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.warn('MongoDB appointment save warning:', dbErr.message);
      }
    }

    res.status(201).json({ success: true, appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentList = await getAppointmentsData();
    const index = currentList.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Rendez-vous introuvable' });
    }

    const current = currentList[index];
    const numericPrice = req.body.price !== undefined
      ? (typeof req.body.price === 'number' ? req.body.price : parseFloat(String(req.body.price).replace(/[^0-9.]/g, '')) || 0)
      : current.price;

    const updated = {
      ...current,
      ...req.body,
      id,
      price: numericPrice,
      priceFormatted: `${numericPrice} DT`,
      updatedAt: new Date().toISOString()
    };

    currentList[index] = updated;
    saveAppointmentsToFile(currentList);

    if (mongoose.connection.readyState === 1) {
      try {
        await Appointment.findOneAndUpdate({ id }, updated, { new: true });
      } catch (dbErr) {
        console.warn('MongoDB appointment update warning:', dbErr.message);
      }
    }

    res.json({ success: true, appointment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update appointment partial
app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentList = await getAppointmentsData();
    const index = currentList.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Rendez-vous introuvable' });
    }

    const current = currentList[index];
    const numericPrice = req.body.price !== undefined
      ? (typeof req.body.price === 'number' ? req.body.price : parseFloat(String(req.body.price).replace(/[^0-9.]/g, '')) || 0)
      : current.price;

    const updated = {
      ...current,
      ...req.body,
      id,
      price: numericPrice,
      priceFormatted: `${numericPrice} DT`,
      updatedAt: new Date().toISOString()
    };

    currentList[index] = updated;
    saveAppointmentsToFile(currentList);

    if (mongoose.connection.readyState === 1) {
      try {
        await Appointment.findOneAndUpdate({ id }, updated, { new: true });
      } catch (dbErr) {
        console.warn('MongoDB appointment patch warning:', dbErr.message);
      }
    }

    res.json({ success: true, appointment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentList = await getAppointmentsData();
    const filtered = currentList.filter(a => a.id !== id);
    saveAppointmentsToFile(filtered);

    if (mongoose.connection.readyState === 1) {
      try {
        await Appointment.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('MongoDB appointment delete warning:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'تم حذف الموعد بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Connect to MongoDB Atlas (Graceful Fallback & Serverless Connection Re-use)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
      console.warn('⚠️  MONGODB_URI is not configured yet with valid credentials in .env (Running in in-memory mode)');
      return;
    }
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
  }
};

// Middleware to ensure DB connection on serverless invocations (e.g., Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0 && MONGODB_URI && !MONGODB_URI.includes('<username>')) {
    await connectDB();
  }
  next();
});

// Start Server locally if not running in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    await connectDB();
  });
}

// Export for Vercel Serverless Function
export default app;
