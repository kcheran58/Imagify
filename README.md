# Imagify

## Overview
Imagify is a **SaaS-based image generation and enhancement application** that utilizes **ClipDrop API** for AI-powered image generation. It features **secure authentication with JWT, seamless payment integration with Razorpay, and a responsive UI built with React.js and Tailwind CSS.**

## Tech Stack
### **Frontend:**
- React.js
- Tailwind CSS
- React Toastify (for notifications)

### **Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- ClipDrop API (Image Generation)
- Razorpay (Payment Gateway)

---

## Features
- **AI-powered image generation** using ClipDrop API
- **User authentication** with JWT
- **Credit-based system** for image generation
- **Seamless payment gateway** using Razorpay
- **Modern UI with Tailwind CSS**
- **Toast notifications** for feedback and alerts
- **Responsive design** for all devices

---

## Folder Structure
### **Frontend** (`frontend/`)
```
│   App.jsx
│   index.css
│   main.jsx
│
├───assets
│       (Contains icons, logos, and sample images)
│
├───components
│       Description.jsx
│       Footer.jsx
│       GenerateBtn.jsx
│       Header.jsx
│       Login.jsx
│       NavBar.jsx
│       Steps.jsx
│       Testimonials.jsx
│
├───context
│       AppContext.jsx (Manages global state)
│
└───pages
        BuyCredit.jsx
        Home.jsx
        Result.jsx
```
### **Backend** (`backend/`)
```
├───controllers
│       userController.js
│       imageController.js
│
├───models
│       userModel.js
│       transactionModel.js
│
├───config
│       mongodb.js (Database configuration)
│
├───routes
│       userRoutes.js
│       imageRoutes.js
│
├───middleware
│       userAuth.js (Authentication middleware)
│
└───server.js (Entry point for backend)
```

---

## Installation & Setup
### Prerequisites
Ensure you have **Node.js** and **MongoDB** installed.

### **1. Clone the repository**
```bash
git clone https://github.com/kcheran58/imagify.git
cd imagify
```

### **2. Install Dependencies**
#### **Frontend**
```bash
cd frontend
npm install
```
#### **Backend**
```bash
cd backend
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the **backend** directory and add:
```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIPDROP_API_KEY=your_clipdrop_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### **4. Start the Application**
#### **Run Backend**
```bash
cd backend
npm start
```
#### **Run Frontend**
```bash
cd frontend
npm run dev
```

---

## API Endpoints
### **Authentication**
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user & return JWT

### **Image Generation**
- `POST /api/images/generate` - Generate an image using ClipDrop API

### **Transactions & Payments**
- `POST /api/user/razor-pay` - Create an order for Razorpay
- `POST /api/user/verify-razorpay` - Verify payment & update credits

---

## Screenshots
### **Home Page**
![image](https://github.com/user-attachments/assets/58291299-a498-42bc-83df-602c5d0882f7)

### **Login Page**
![image](https://github.com/user-attachments/assets/c8da9d0b-3ccd-4730-a79c-0c2696867756)


### **Image Generation Page**
![image](https://github.com/user-attachments/assets/22cab7a0-51bb-4a3e-9e46-797ee7a193a3)

### **BuyCredits Page**
![image](https://github.com/user-attachments/assets/c1ded457-fe0f-4f45-8769-cc9c4a5fcc5e)

---



## License
This project is licensed under the **MIT License**.

---

## Support
For any issues, reach out via [kseran58@example.com] or create an issue on GitHub.

