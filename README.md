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
## 📷Screenshots


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f70ac18c-d2c1-4ac5-9b7d-7b5b2b244852" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5a390bd4-0ffd-4d37-8164-7ee15af52c88" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dc30a9f4-dd17-4090-857a-125ed0126dd5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2dc8d7a1-24ec-4343-881a-e59667dde6d5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2ff8ea0e-84a0-451d-bdb5-dd537e8ccaff" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/97ee36ae-6e11-4301-b9ed-9b93b759a6d1" />

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

# Frontend URL
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

## ➕ Add products to the database for testing

- Seed sample products (recommended):
  - From `backend-nodejs/` run:
  ```bash
  npm run seed
  ```
  - This clears the `products` collection and inserts sample items.

- Add a single product via API (optional):
  - POST `http://localhost:3000/api/v1/products`
  - Body:
  ```json
  { "barcode": "12345678", "name": "Sample Product", "price": 99.99 }
  ```

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

create a barcode image using any online generator for products in db(see seedDatabase.js).
See Example below for Apple.

![barcode (4)](https://github.com/user-attachments/assets/71e68629-55c8-40e4-9b37-24ecb5c937a2)


