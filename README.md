# Henri Boma Resort & Cultural Heritage - Complete Project

This project contains three main components for Henri Boma Resort & Cultural Heritage:

1. **Public Website** - Modern React website for customers
2. **Admin Dashboard** - React-based admin panel for management
3. **Backend API** - Flask API with MongoDB integration

## 🏗️ Project Structure

```
henri-boma-project/
├── henri-boma-resort/          # Public Website (React + Vite + TailwindCSS)
├── henri-boma-admin/           # Admin Dashboard (React + Vite + TailwindCSS)
├── henri-boma-api/             # Backend API (Flask + MongoDB)
└── README.md                   # This file
```

## 🌐 Public Website (henri-boma-resort)

### Features
- **Modern One-Page Design** with smooth scrolling navigation
- **Hero Section** with resort branding and call-to-action buttons
- **Services Overview** with interactive cards
- **Accommodation Section** with room booking modals
- **Day Experiences** (Pool, Museum, Animal Farm, Botanical Garden)
- **Events Management** (Private events and resort-hosted events)
- **Food Delivery System** with full cart functionality
- **Gallery** with photos, videos, and articles
- **Contact Section** with forms and Google Maps
- **Dark/Light Mode Toggle**
- **Mobile-First Responsive Design**

### Technology Stack
- React 18 with Vite
- TailwindCSS for styling
- shadcn/ui components
- Context API for state management
- Responsive design with animations

### Setup & Installation
```bash
cd henri-boma-resort
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Admin Dashboard (henri-boma-admin)

### Features
- **Dashboard Overview** with real-time statistics and charts
- **Booking Management** - View, edit, and manage room bookings
- **Room Management** - Manage room types, pricing, and availability
- **Menu & Orders** - Food menu management and order tracking
- **Day Passes** - Manage facility passes and visitor tracking
- **Events Management** - Handle private inquiries and resort events
- **Content Management** - Gallery, articles, and media management
- **Payments Dashboard** - Transaction tracking and payment analytics
- **Analytics & Reports** - Comprehensive charts and performance metrics
- **User Management** - Admin users, customers, roles, and permissions
- **Settings** - Resort configuration and system preferences

### Technology Stack
- React 18 with Vite
- TailwindCSS for styling
- shadcn/ui components
- Chart.js for data visualization
- Dark/Light mode support

### Setup & Installation
```bash
cd henri-boma-admin
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Backend API (henri-boma-api)

### Features
- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with role-based access control
- **MongoDB Integration** with flexible data models
- **Payment Processing** with M-Pesa integration
- **Email & SMS Notifications** for bookings and orders
- **File Upload Support** for images and documents
- **API Documentation** with interactive testing interface
- **CORS Support** for frontend integration
- **Error Handling** with detailed logging

### API Endpoints

#### Public Endpoints
- `GET /api/health` - API health status
- `GET /api/rooms` - Get available rooms
- `GET /api/menu` - Get menu items
- `POST /api/bookings` - Create booking
- `POST /api/orders` - Create food order
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/events/rsvp` - RSVP for events
- `POST /api/events/private-inquiries` - Submit private event inquiry

#### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/bookings` - Manage bookings
- `GET /api/payments` - View payments
- `GET /api/events/resort-events` - Manage resort events

### Technology Stack
- Python 3.11 with Flask
- MongoDB with PyMongo
- JWT for authentication
- Flask-CORS for cross-origin requests
- Email and SMS services integration
- M-Pesa payment gateway integration

### Setup & Installation
```bash
cd henri-boma-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### Environment Variables
Create a `.env` file in the `henri-boma-api` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/henri_boma_db

# JWT
JWT_SECRET_KEY=your-secret-key-here

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@henriboma.com
FROM_NAME=Henri Boma Resort

# SMS Service (Africa's Talking)
SMS_API_KEY=your-sms-api-key
SMS_USERNAME=sandbox

# M-Pesa (Safaricom)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-passkey
MPESA_ENVIRONMENT=sandbox

# API Configuration
API_BASE_URL=http://localhost:5000
ADMIN_EMAIL=admin@henriboma.com
```

## 🎨 Design System

### Color Scheme
- **Primary**: Sky Blue (#4BA3C3)
- **Accent**: Earth Brown (#7B4B3A)
- **Background Light**: Light Gray (#F5F5F5)
- **Background Dark**: Dark Gray (#1E1E1E)
- **Text Light**: Black (#333333)
- **Text Dark**: White (#FFFFFF)

### Features
- Rounded corners and soft shadows
- Smooth hover animations
- Consistent spacing and typography
- Mobile-first responsive design
- Dark/light mode support

## 🚀 Deployment

### Frontend Deployment
Both React applications can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Backend Deployment
The Flask API can be deployed to:
- Heroku
- DigitalOcean
- AWS EC2
- Google Cloud Platform

### Database
- MongoDB Atlas (recommended for production)
- Local MongoDB instance
- Docker MongoDB container

## 📱 Mobile Support

All applications are fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Password hashing
- Rate limiting (basic implementation)

## 📊 Analytics & Monitoring

- API request logging
- Error tracking
- Performance monitoring
- User activity auditing
- Payment transaction logging

## 🧪 Testing

### Frontend Testing
```bash
# Run tests for public website
cd henri-boma-resort
npm test

# Run tests for admin dashboard
cd henri-boma-admin
npm test
```

### Backend Testing
```bash
# Run API tests
cd henri-boma-api
python -m pytest tests/
```

## 📚 Documentation

- API documentation available at `/` when running the Flask server
- Interactive API testing interface included
- Comprehensive code comments
- Type hints for Python code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for Henri Boma Resort & Cultural Heritage.

## 📞 Support

For technical support or questions:
- Email: tech@henriboma.com
- Phone: +2547852595158

## 🔄 Version History

- **v1.0.0** - Initial release with all core features
  - Public website with booking system
  - Admin dashboard with full management capabilities
  - Backend API with payment integration
  - Mobile-responsive design
  - Dark/light mode support

---

**Built with ❤️ for Henri Boma Resort & Cultural Heritage**

