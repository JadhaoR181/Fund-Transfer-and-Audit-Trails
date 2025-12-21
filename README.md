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

## 🔌 API Documentation

### 🔐 Authentication APIs

#### `POST /auth/register`
Registers a new user in the system.

- **Access:** Public  
- **Description:**  
  Creates a new user account using name, email, and password.  
  Passwords are securely hashed before being stored in the database.
- **Used in:** Frontend Registration Page

---

#### `POST /auth/login`
Authenticates an existing user.

- **Access:** Public  
- **Description:**  
  Validates user credentials and returns a JWT access token on successful authentication.
- **Used in:** Frontend Login Page  
- **Response:** JWT access token required for all protected APIs

---

### 💸 Transaction API

#### `POST /transfer`
Executes a peer-to-peer fund transfer.

- **Access:** Authenticated  
- **Description:**  
  Transfers funds from the logged-in user (sender) to another user (receiver).  
  The operation is wrapped inside a database transaction to ensure **atomicity** —  
  both debit and credit either succeed together or fail together.
- **Side Effects:**  
  - Deducts balance from sender  
  - Credits balance to receiver  
  - Creates a transaction record  
  - Writes an immutable audit log entry
- **Used in:** Frontend Transfer Form

---

### 📊 Read APIs

#### `GET /transactions/me`
Fetches transaction history for the logged-in user.

- **Access:** Authenticated  
- **Description:**  
  Returns a list of transactions where the user is either the sender or receiver.  
  This data is optimized for frontend display and user clarity.
- **Used in:** Transaction History Table (Frontend)

---

#### `GET /audit-logs/me`
Fetches audit log records related to the logged-in user.

- **Access:** Authenticated  
- **Description:**  
  Returns immutable audit log entries for traceability and compliance.  
  These logs are stored separately from user-facing transaction records.
- **Used in:** Audit Logs Toggle View (Frontend)

---

#### `GET /users/me`
Fetches current user details.

- **Access:** Authenticated  
- **Description:**  
  Returns profile information of the logged-in user, including current balance.
- **Used in:**  
  - Dashboard balance display  
  - User avatar and profile section

---

## 🧠 API Design Rationale

- **Clear separation of concerns**
  - Transactions → User experience  
  - Audit Logs → Compliance and traceability
- **Atomic database operations** ensure financial correctness
- **JWT-based authentication** secures all sensitive endpoints

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
