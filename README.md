
# 🛒 Supermarket Self-Checkout App

A full-stack self-checkout solution for supermarkets built with modern technologies:

- **Frontend**: React + Vite + Firebase + Razorpay + QR Code Scanner
- **Backend**: FastAPI (Python)

---

## ⚙️ Setup Instructions

### 🖥️ Frontend Setup (React + Vite)

1. **Install dependencies**:

```bash
git clone https://github.com/Rohit-rk07/supermarket-self-checkout.git
cd frontend
npm install
```

2. **Create a `.env` file in `frontend/`**:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

3. **Start the frontend**:

```bash
npm run dev
```

App will run at: [http://localhost:5173](http://localhost:5173)

---

### 🐍 Backend Setup (FastAPI + Python)

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

3. **Create a `.env` file in `backend/`**:

```env
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
FIREBASE_PROJECT_ID=your_firebase_project_id

Note I did not set up razorpay. If u wish u can do it.
```

4. **Run the backend server**:

```bash
uvicorn app.main:app --reload
```

Backend runs at: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔐 Authentication

- Firebase Authentication
  - Email & Password
  - Google Sign-In
- Email verification
- Password reset

---

## 💡 Features

- 🔍 **QR Code Scanning** for product detection  
- 🛒 **Add to Cart & Checkout** system  
- 💳 **Razorpay Payment Integration**  
- 📊 **Order history & tracking**  
- 🔐 **User Authentication** (Firebase + Google)  

---

## 🧩 Technologies Used

### Frontend:
- React + Vite
- Firebase (Auth, Firestore, Storage)
- Razorpay JS SDK
- MUI
- QR Code Scanner (`html5-qrcode`, `react-qr-barcode-scanner`)

### Backend:
- FastAPI
- Razorpay SDK (Python)
- Firebase Admin SDK
- Pydantic, SQLAlchemy
- Python dotenv
