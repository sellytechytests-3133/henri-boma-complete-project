# Henri Boma Resort - Installation Guide

This guide will help you set up and run all three components of the Henri Boma Resort project locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 📦 Project Structure

After extracting the zip file, you'll have:
```
henri-boma-project/
├── henri-boma-resort/          # Public Website
├── henri-boma-admin/           # Admin Dashboard  
├── henri-boma-api/             # Backend API
├── README.md
└── INSTALLATION_GUIDE.md
```

## 🚀 Quick Start

### 1. Extract the Project
```bash
unzip henri-boma-complete-project.zip
cd henri-boma-project
```

### 2. Set Up MongoDB
Start your MongoDB service:

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. Set Up Backend API

```bash
# Navigate to API directory
cd henri-boma-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
python src/main.py
```

The API will be available at: `http://localhost:5000`

### 4. Set Up Public Website

Open a new terminal:
```bash
# Navigate to public website directory
cd henri-boma-resort

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at: `http://localhost:5173`

### 5. Set Up Admin Dashboard

Open another new terminal:
```bash
# Navigate to admin dashboard directory
cd henri-boma-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin dashboard will be available at: `http://localhost:5174`

## 🔧 Detailed Setup Instructions

### Backend API Configuration

1. **Environment Variables**
   Create a `.env` file in the `henri-boma-api` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/henri_boma_db
   
   # JWT
   JWT_SECRET_KEY=your-secret-key-here-change-this-in-production
   
   # Email Service (Optional - for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_EMAIL=noreply@henriboma.com
   FROM_NAME=Henri Boma Resort
   
   # SMS Service (Optional - Africa's Talking)
   SMS_API_KEY=your-sms-api-key
   SMS_USERNAME=sandbox
   
   # M-Pesa (Optional - for payments)
   MPESA_CONSUMER_KEY=your-consumer-key
   MPESA_CONSUMER_SECRET=your-consumer-secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your-passkey
   MPESA_ENVIRONMENT=sandbox
   
   # API Configuration
   API_BASE_URL=http://localhost:5000
   ADMIN_EMAIL=admin@henriboma.com
   ```

2. **Create Admin User**
   After starting the API, create an admin user by making a POST request to `/api/auth/register`:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@henriboma.com",
       "password": "admin123",
       "full_name": "Admin User",
       "role": "admin"
     }'
   ```

### Frontend Configuration

Both React applications should work out of the box. If you need to change the API URL:

1. **Public Website** - Update `src/config.js` (if exists) or create it:
   ```javascript
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. **Admin Dashboard** - Update `src/config.js` (if exists) or create it:
   ```javascript
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

## 🧪 Testing the Setup

### 1. Test Backend API
Visit `http://localhost:5000` - You should see the API documentation page.

### 2. Test Public Website
Visit `http://localhost:5173` - You should see the Henri Boma Resort homepage.

### 3. Test Admin Dashboard
Visit `http://localhost:5174` - You should see the admin login page.

### 4. Test Admin Login
Use the credentials you created:
- Username: `admin`
- Password: `admin123`

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: MongoDB connection failed
   ```
   **Solution:** Ensure MongoDB is running and accessible at `mongodb://localhost:27017`

2. **Port Already in Use**
   ```
   Error: Port 5000 is already in use
   ```
   **Solution:** Kill the process using the port or change the port in the Flask app

3. **Node Modules Missing**
   ```
   Error: Cannot find module
   ```
   **Solution:** Run `npm install` in the respective directory

4. **Python Dependencies Missing**
   ```
   ModuleNotFoundError: No module named 'flask'
   ```
   **Solution:** Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Checking Services

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   tasklist /FI "IMAGENAME eq mongod.exe"
   
   # macOS/Linux
   ps aux | grep mongod
   ```

2. **Check if ports are available:**
   ```bash
   # Windows
   netstat -an | findstr :5000
   netstat -an | findstr :5173
   netstat -an | findstr :5174
   
   # macOS/Linux
   lsof -i :5000
   lsof -i :5173
   lsof -i :5174
   ```

## 🌐 Production Deployment

### Backend API
1. Set up a production MongoDB instance (MongoDB Atlas recommended)
2. Configure environment variables for production
3. Deploy to Heroku, DigitalOcean, or AWS
4. Update CORS settings for your domain

### Frontend Applications
1. Build the applications:
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API URLs to point to your production backend

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter any issues:

1. Check the console logs in your browser (F12)
2. Check the terminal output for error messages
3. Ensure all services are running
4. Verify environment variables are set correctly

## 📞 Support

For technical support:
- Email: tech@henriboma.com
- Phone: +254 117 951 228

---

**Happy coding! 🚀**

