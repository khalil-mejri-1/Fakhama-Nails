# Fakhama Nails — Haute Nail Atelier SoHo

A luxury full-stack web boutique and atelier booking application for **Fakhama Nails**, featuring haute couture aesthetics, interactive services menu, ready-to-wear press-on nail boutique, dynamic dark/light luxury modes, and a comprehensive real-time Admin Management Dashboard.

## 💎 Features

- **Haute Couture Storefront**: Designed with luxury typography (Playfair Display & Plus Jakarta Sans), curated royal jewel color palettes, and glassmorphic micro-animations.
- **Dual Luxury Themes**: Dynamic Haute Dark Mode & Champagne Light Mode with seamless theme persistence.
- **Off-Canvas Luxury Side Drawer**: Fluid, animated side navigation drawer on mobile and tablet with brand monogram, numbered sections, and concierge quick-links.
- **Real-Time Booking & Bag Concierge**: Interactive booking of atelier rituals and press-on nail checkout directly integrated with the backend.
- **Full-Featured Admin Dashboard** (`/admin`):
  - Live revenue analytics, order volume metrics, and status monitors.
  - Complete CRUD for Press-On products, atelier service rituals, and live orders.
  - Live boutique phone and announcement banner configuration.
- **Backend API**: Node.js & Express server connected to MongoDB Atlas for persistent storage of site settings, products, services, and client appointments.

---

## 🛠️ Tech Stack

- **Client**: React 18, Vite, Tailwind CSS, Material Symbols Outlined, Google Fonts.
- **Server**: Node.js, Express, Mongoose / MongoDB Atlas, CORS, Dotenv.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # configure your MongoDB connection string
node index.js
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:5174`.

---

## 🏛️ Project Structure

```
fakhama-nails/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── index.js
│   ├── .env.example
│   └── package.json
└── README.md
```
