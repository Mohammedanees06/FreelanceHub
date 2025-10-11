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


## 🚀 Installation & Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

---

### 📦 Quick Start Guide

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/freelancehub.git
cd freelancehub
```

---

#### Step 2: Backend Setup

**Navigate to server directory and install dependencies:**
```bash
cd server
npm install
```

**Create a `.env` file in the `server` directory with the following content:**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/freelancehub
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Start MongoDB service:**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

**Start the backend server:**
```bash
npm run dev
# or
node server.js
```

✅ **Backend is now running on** `http://localhost:5000`

---

#### Step 3: Frontend Setup

**Open a new terminal, navigate to client directory and install dependencies:**
```bash
cd client
npm install
```

**Create a `.env` file in the `client` directory with the following content:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Start the frontend development server:**
```bash
npm run dev
```

✅ **Frontend is now running on** `http://localhost:5173`

---

### 🔑 Getting API Keys

#### **Cloudinary Setup** (Required for file uploads)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your **Dashboard**
3. Copy the following credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Add these to your `server/.env` file

#### **Google OAuth Setup** (Optional - for Google login)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:5173`
7. Copy the **Client ID**
8. Add it to your `client/.env` file as `VITE_GOOGLE_CLIENT_ID`

---

### 🎉 You're All Set!

Open your browser and visit `http://localhost:5173` to see FreelanceHub in action!

**Test the application:**
- ✅ Register a new account
- ✅ Login with your credentials
- ✅ Create a job post (as employer)
- ✅ Apply to jobs (as freelancer)
- ✅ Send messages in real-time

---

### 🐛 Troubleshooting

#### **Port Already in Use**
```bash
# Kill process on port 5000 (Backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Frontend)
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

#### **MongoDB Connection Error**
- Make sure MongoDB service is running
- Verify `MONGO_URI` in your `.env` file is correct
- Check MongoDB logs for errors

#### **Module Not Found Error**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **CORS Issues**
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that `REACT_APP_API_URL` in frontend `.env` points to the correct backend

---

### 📂 Project Structure

```
freelancehub/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── redux/            # Redux store
│   │   └── App.jsx
│   ├── .env                  # Frontend environment variables
│   └── package.json
│
├── server/                    # Node.js Backend (Express)
│   ├── controllers/          # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

### 🙏 Acknowledgments

- Inspired by [Upwork](https://www.upwork.com/) and [Fiverr](https://www.fiverr.com/)
- Built with the MERN stack
- Socket.io for real-time messaging
- Cloudinary for file storage

---

### ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️ on GitHub!

---

### 📞 Support

For support, email me at mohammedanees0606@gmail.com

