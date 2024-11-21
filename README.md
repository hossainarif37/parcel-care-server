# ParcelCare Backend

## 🚀 Project Overview
Backend service for ParcelCare, a comprehensive parcel delivery management system built with Node.js and Express.js.

## 🛠️ Technologies
- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Passport.js
- **Payment Integration**: Stripe

## 📦 Core Features
- User & Agent Management
- Parcel Booking System
- Real-time Shipment Tracking
- Secure Payment Processing
- Admin Dashboard Backend

## 🔗 Project Links
- **Frontend Repository**: [https://github.com/hossainarif37/parcel-care-client](https://github.com/hossainarif37/parcel-care-client)
- **Live Demo**: [ParcelCare Live Demo](https://parcel-care.vercel.app)

## ⚙️ Local Setup

### **Backend Installation**
1. **Clone the repository**:
    ```bash
    git clone https://github.com/hossainarif37/parcel-care-server.git
    cd parcel-care-server
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment**:
    Create a `.env` file with:
    ```bash
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    CLIENT_URL=http://localhost:3000
    DB_CONNECTION_URL=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/parcel-care
    JWT_SECRET_KEY=your_long_and_secure_jwt_secret_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

4. **Run the server**:
    ```bash
    npm run dev
    ```

### **Prerequisites**
- Node.js (v18.18.0+)
- MongoDB Database
- Stripe Account
- Cloudinary Account

## 📂 Project Structure
```
├── config/
├── controllers/
├── errorHandlers/
├── middlewares/
├── models/
├── routes/
├── types/
```

### **Troubleshooting**
- Verify MongoDB connection
- Check environment variables
- Ensure Stripe credentials are correct

## 📝 Notes
- Backend runs on port 5000 by default
- Requires frontend to be running simultaneously
- Internet connection needed for external services