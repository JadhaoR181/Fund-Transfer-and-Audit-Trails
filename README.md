# LenDenClub – Real-time Transaction & Audit Log System

## 📌 Project Overview
This project is an implementation of **Assignment 2: Real-time Transaction & Audit Log System**.  
It simulates a **peer-to-peer fund transfer system** with **atomic transactions**, **immutable audit logging**, and a **clean frontend dashboard** for transfers and history viewing.

The system is designed to demonstrate **backend correctness, data integrity, and clear engineering decisions**, rather than overengineering.

---

## ✨ Key Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication
- Secure access to all protected APIs

### 💸 Fund Transfer
- Single `POST /transfer` endpoint
- Atomic database transaction (debit + credit succeed or fail together)
- Validation for balance, sender/receiver, and amount

### 📜 Audit Logging
- Immutable `audit_logs` table
- Logs: sender, receiver, amount, timestamp, status
- Separate from transaction records (compliance-focused design)

### 📊 Transaction & Audit History
- Authenticated APIs to fetch:
  - User-facing transaction history
  - Audit logs for traceability
- Frontend toggle between **Transactions** and **Audit Logs**

### ⚡ Real-time UI Updates (Action-based)
- After a successful transfer, the **initiating user’s dashboard updates immediately**


---

## 🧱 Tech Stack

### Backend
- **FastAPI**
- **SQLAlchemy**
- **PostgreSQL**
- **JWT Authentication**

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Axios**

---

## 🗄️ Database Schema

### Users
- `id`
- `name`
- `email`
- `password_hash`
- `balance`
- `created_at`

### Transactions
- `id`
- `sender_id`
- `receiver_id`
- `amount`
- `status`
- `created_at`

### Audit Logs (Immutable)
- `id`
- `sender_id`
- `receiver_id`
- `amount`
- `status`
- `timestamp`

---

## 📁 Project Structure

```
Fund-Transfer-and-Audit-Trails/
├── backend/
│   ├── app/
│   │   ├── core/               # Core logic (security, auth dependencies)
│   │   │   ├── auth_dependency.py
│   │   │   └── security.py
│   │   ├── db/                 # Database models and session management
│   │   │   ├── __init__.py
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── routes/             # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── audit_logs.py
│   │   │   ├── transfer.py
│   │   │   └── users.py
│   │   ├── schemas/            # Pydantic schemas for data validation
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── audit_logs.py
│   │   │   ├── transfer.py
│   │   │   └── users.py
│   │   ├── main.py             # FastAPI application entry point
│   │   └── __init__.py
│   ├── .env.example            # Example environment file
│   ├── .gitignore
│   ├── requirements.txt
│   └── README.md               # Backend README (if any)
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/                    # Frontend source code
│   │   ├── assets/             # Images, icons, etc.
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages/views
│   │   ├── services/           # API interaction logic
│   │   ├── App.jsx
│   │   ├── main.jsx            # Frontend entry point
│   │   └── index.css
│   ├── .eslintrc.cjs           # ESLint configuration
│   ├── .gitignore
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies and scripts
│   ├── postcss.config.js       # PostCSS configuration
│   ├── README.md               # Frontend README (from Vite template)
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite configuration
└── README.md                   # Main project README (this file)
```

---

## 🔌 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Transfer
- `POST /transfer` – Atomic fund transfer

### Read APIs
- `GET /transactions/me` – User-facing transaction history
- `GET /audit-logs/me` – Audit log history for the user
- `GET /users/me` – Current user details

---
---

## 🚀 Setup Instructions

### Backend Setup
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create a `.env` file with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lendenclub
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440 // 24 hours
```

### Frontend Setup
```bash
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🧠 Design Decisions

### Atomic Transactions
All fund transfers are wrapped in a database transaction to ensure **data integrity**.

### Audit Logs vs Transactions
- **Transactions table** → user-facing history
- **Audit logs table** → immutable, compliance-focused records

This separation mirrors real-world financial systems.

### Real-time Updates (Scope-aware)
The system updates the UI immediately after a user performs a transfer.  
Cross-client live synchronization (WebSockets/SSE) was intentionally avoided as it was outside the assignment scope.

---

## 🤖 AI Tool Usage Log (MANDATORY)

### AI-Assisted Tasks
- Used ChatGPT to:
  - Design atomic transfer logic with SQLAlchemy
  - Structure audit logging as an immutable table
  - Refine frontend UI/UX and compact the dashboard
  - Add audit-log toggle and ensure assignment compliance

### Effectiveness Score
**4 / 5**

AI tools significantly reduced development time, while core logic, integration, debugging and design decisions were implemented manually.

---

## 🎥 Demo Video
A short demo video showcasing:
- Login & Registration
- Fund transfer
- Real-time balance & history update
- Transaction vs Audit Log toggle
- Logout

*(Demo video link to be added)*

---


---

## 👤 Developed By
**Ravindra Jadhav**
