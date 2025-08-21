# 🛒 Supermarket Self‑Checkout (Node.js + React)

A modern self‑checkout web app with phone OTP auth, demo mode, barcode scanning, cart, Razorpay payments, and purchase history.

- **Frontend**: React + Vite + Material‑UI, code‑split via `React.lazy()`
- **Backend**: Node.js + Express + MongoDB (Mongoose), JWT auth, Twilio SMS, Razorpay
- **Payments**: Razorpay Orders + Checkout (Test Mode ready)

---

## ✨ Features

- __Phone OTP authentication__ (Twilio) + __Demo user mode__
- __QR/Barcode scanning__ and __smart cart__ with localStorage persistence
- __Razorpay checkout__ (Cards, NetBanking, Wallets, UPI when enabled)
- __Purchase history__ with detailed receipt + print dialog
- __Lazy loading__ and polished UI theme

---

## 📁 Project Structure

```
root/
├─ backend-nodejs/
│  ├─ app/
│  ├─ node_modules/
│  ├─ .env                 # backend environment (see below)
│  └─ package.json
└─ frontend/
   ├─ src/
   ├─ .env                 # frontend environment (see below)
   └─ package.json
```

---

## ⚙️ Environment Variables

Create these files before running locally or deploying.

### backend-nodejs/.env
```
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/supermarket-checkout

# JWT
JWT_SECRET=change_me_to_a_secure_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d

# Razorpay (Test Mode keys from dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Frontend URL (for CORS and links)
FRONTEND_URL=http://localhost:5173

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Logging
LOG_LEVEL=INFO
```

### frontend/.env
```
# Backend base URL used by the app
VITE_SERVER_URL=http://localhost:3000

# Optional: expose Razorpay key for fallback (backend already sends key in response)
# VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

> Security note: never commit real secrets. Use environment settings in your hosting provider.

---

## 🧑‍💻 Local Development

### 1) Backend
```bash
cd backend-nodejs
npm install
npm start
# Server: http://localhost:3000
# Health: http://localhost:3000/
# API Doc (summary): http://localhost:3000/api
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

### Test Payment (Razorpay Test Mode)
- Open Checkout → Pay with Razorpay
- Card: `4111 1111 1111 1111`, any future expiry, any CVV
- UPI (if enabled in dashboard): `success@razorpay`

---

## 🔐 Authentication
- Phone OTP with Twilio (dev fallback supported)
- JWT tokens for API
- Demo mode with a special demo token header for quick testing

---

## 🧾 Purchase Flow
1. Frontend creates order via `POST /api/v1/payments/create-order`
2. Razorpay Checkout completes payment
3. Frontend verifies via `POST /api/v1/payments/verify-payment`
4. App saves purchase to DB and shows printable receipt

---

## 🚀 Deployment Guide

### Prerequisites
- MongoDB Atlas cluster (connection string)
- Razorpay account (Test Mode keys for staging; Live Mode for production)
- Twilio account (or disable OTP for staging and use demo user)

### Backend (Render)
1. Create a new Web Service on Render. Repository: this project
2. Root: `backend-nodejs/`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment (Render → Settings → Environment): set all vars from `backend-nodejs/.env`
6. Add `FRONTEND_URL` to your deployed frontend URL(s)

### Frontend (Vercel or Netlify)
- Vercel
  1. Import project → select `frontend/` as root
  2. Set `VITE_SERVER_URL` to your Render backend URL (e.g., `https://your-api.onrender.com`)
  3. Deploy

- Netlify
  1. New site → Deploy from Git → Base directory: `frontend/`
  2. Environment: `VITE_SERVER_URL=https://your-api.onrender.com`
  3. Build command: `npm run build` ; Publish directory: `dist`

### Razorpay (Live readiness)
- Switch Razorpay to Live Mode
- Replace keys in backend `.env`
- Enable desired payment methods (UPI, Cards, Wallets, etc.) in Dashboard → Payment Methods
- Update allowed domains/callbacks if using webhooks later

### CORS
- Backend `app/main.js` allows: `http://localhost:5173` and production domain(s)
- Update `FRONTEND_URL` or CORS list if your domain changes

---

## 🧪 Useful Endpoints
- `GET /` → health
- `GET /api` → API summary
- `POST /api/v1/payments/create-order` → create Razorpay order
- `POST /api/v1/payments/verify-payment` → verify signature
- Orders CRUD under `/api/v1/orders`

---

## 🛡️ Production Checklist
- __Rotate secrets__ (JWT, Razorpay, Twilio)
- __Set NODE_ENV=production__
- __Point to MongoDB Atlas__ (not local)
- __Enable UPI / methods in Razorpay Live__
- __Add rate limiting__ (already enabled) and input validation (Joi)
- __Configure logging__ (log level/file as needed)
- __Set CORS to explicit domains__

---

## 📜 License
MIT
