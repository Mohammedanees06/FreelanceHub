<div align="center">
  <h1>🚀 FreelanceHub</h1>
  <p><strong>A Modern Full-Stack Freelance Marketplace Built with MERN Stack</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#installation">Installation</a> •
    <a href="#api-endpoints">API</a>
  </p>
</div>

---

## 📋 Overview

FreelanceHub is a comprehensive freelance marketplace platform that connects clients with talented freelancers. Inspired by industry leaders like Upwork and Fiverr, this platform provides a seamless experience for posting jobs, submitting proposals, and managing projects—all built with modern web technologies.

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based secure authentication system
- Role-based access control (Client, Freelancer, Admin)
- Google OAuth integration for quick sign-up/login
- Protected routes and API endpoints
- Session management with refresh tokens

### 💼 **Job Management**
- **For Clients:**
  - Create detailed job postings with requirements and budget
  - Edit and update job listings
  - Set job visibility and deadlines
  - Close or delete job postings
  - Track job analytics and views

- **For Freelancers:**
  - Browse and filter available jobs
  - Search by skills, budget, and timeline
  - Save jobs for later consideration
  - View detailed job requirements

### 📝 **Application System**
- **Freelancer Features:**
  - Submit detailed proposals with cover letters
  - Attach portfolio samples
  - Set competitive bidding rates
  - Track application status
  - Withdraw applications if needed

- **Client Features:**
  - Review all received applications
  - Filter applications by experience and rate
  - Shortlist promising candidates
  - Accept or reject proposals
  - Compare freelancer profiles side-by-side

### 💬 **Real-Time Messaging**
- Instant messaging using Socket.io
- Real-time notifications for new messages
- Message read receipts
- File and document sharing
- Typing indicators
- Chat history persistence
- Online/offline status indicators

### 📊 **Additional Features**
- **Dashboard Analytics** - Track jobs, applications, and earnings
- **Profile Management** - Comprehensive user profiles with portfolios
- **Rating & Reviews** - Build trust with feedback system
- **Payment Integration** - Secure escrow system (coming soon)
- **Advanced Search** - Filter by skills, location, and availability
- **Responsive Design** - Seamless experience across all devices

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library with hooks and context
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client
- **React Hook Form** - Form validation


### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - WebSocket implementation
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service

### **Tools**
- **Prettier** - Code formatting
- **Git** - Version control
- **Postman** - API testing
- **MongoDB Atlas** - Cloud database

## 📸 Screenshots

<div align="center">

### 🏠 Login Page
<img src="https://github.com/user-attachments/assets/77372dfb-07c9-4d0a-a747-f7d35447dc59" alt="Landing Page" width="90%" />

### 💼 Register Page
<img src="https://github.com/user-attachments/assets/dec69479-ff7b-4490-bf0b-bf414fdd159c" alt="Job Listings" width="90%" />

### 📋 Home Page
<img src="https://github.com/user-attachments/assets/263f0608-24a2-4bff-bb62-cf26cff9a750" alt="Job Application" width="90%" />

### 📊 Freelancer Dashboard
<img src="https://github.com/user-attachments/assets/7d72ed17-d625-4886-a578-153b39a72312" alt="Freelancer Dashboard" width="90%" />

### 👤 User Profile
<img src="https://github.com/user-attachments/assets/fb082098-4a55-45da-8723-80fd889ff593" alt="User Profile" width="90%" />

### 📊 Admin Dashboard
<img src="https://github.com/user-attachments/assets/d55d2938-8def-45aa-86bd-44677d42279b" alt="Messaging System" width="90%" />

### 📑 Add Job
<img src="https://github.com/user-attachments/assets/15d2658d-d337-41ca-bfa2-5e19eda4a2dc" alt="Application Management" width="90%" />

### 📑 Application Management
<img src="https://github.com/user-attachments/assets/f458333d-d2c7-4b22-8f9d-6d7115d84bdf" alt="Login Page" width="90%" />

### 📑 Jobs Applied
<img width="1871" height="874" alt="image" src="https://github.com/user-attachments/assets/b3503c91-fdef-414a-932e-7f5d9488371e" />

### 💬 **Real-Time Messaging**
<img width="1625" height="865" alt="image" src="https://github.com/user-attachments/assets/41bec902-3b44-4027-8d28-e1d2c40c8437" />

Here's the improved and formatted installation section:

```markdown
## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

---

### 📦 Quick Start

#### 1️⃣ **Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/yourusername/freelancehub.git

# Navigate to project directory
cd freelancehub
```

#### 2️⃣ **Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

**Create `.env` file in server directory:**

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/db_name
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=Cloud_name_from_Cloudinary
CLOUDINARY_API_KEY=Cloud_API_Key_from_Cloudinary
CLOUDINARY_API_SECRET=Cloud_API_Secret_Key_from_Cloudinary
```

**Start MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**Start the backend server:**
```bash
node server.js
```

✅ Backend will run on `http://localhost:5000`

#### 3️⃣ **Frontend Setup**

**Open a new terminal and run:**

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
```

**Create `.env` file in client directory:**

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Start the frontend server:**
```bash
npm run dev
```

✅ Frontend will run on `http://localhost:5173`

---

### 🔑 Getting API Keys

<details>
<summary><b>📸 Cloudinary Setup</b> (Required for file uploads)</summary>

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard** → Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your backend `.env` file

</details>

<details>
<summary><b>🔐 Google OAuth Setup</b> (Optional for social login)</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:5173`
5. Copy Client ID and add to frontend `.env` file

</details>

---

### ✅ Verify Installation

| Step | Check | URL |
|------|-------|-----|
| 1 | MongoDB is running | Check terminal for connection, Add cluster in .env file |
| 2 | Backend is running | http://localhost:5000/api/health |
| 3 | Frontend is running | http://localhost:5173 |

---



### 🎯 Quick Commands Reference

```bash
# Start everything at once (from root directory)
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm run dev

# Terminal 3 - MongoDB
mongod
```

---

### 📝 Default Test Accounts

After setup, you can register new accounts or use these for testing:

| Role | Email | Password |
|------|-------|----------|
| **Client** | client@test.com | Test@123 |
| **Freelancer** | freelancer@test.com | Test@123 |
| **Admin** | admin@test.com | Admin@123 |

---

<div align="center">
  
**🎉 Setup Complete! Your application should now be running.**

Frontend: http://localhost:5173 | Backend: http://localhost:5000

</div>
