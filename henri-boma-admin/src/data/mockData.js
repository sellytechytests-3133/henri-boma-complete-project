// Mock data for Henri Boma Resort Admin Dashboard

// Dashboard Stats
export const dashboardStats = {
  totalBookings: 156,
  totalRevenue: 2450000, // KSH
  activeGuests: 89,
  pendingOrders: 23,
  dayPassVisitors: 145,
  occupancyRate: 78
}

// Recent bookings
export const recentBookings = [
  {
    id: 'BK001',
    guestName: 'John Kamau',
    roomType: 'Heritage Suite',
    checkIn: '2025-08-22',
    checkOut: '2025-08-25',
    status: 'confirmed',
    amount: 75000,
    phone: '+2547852595158'
  },
  {
    id: 'BK002',
    guestName: 'Mary Wanjiku',
    roomType: 'Deluxe Garden View',
    checkIn: '2025-08-23',
    checkOut: '2025-08-26',
    status: 'pending',
    amount: 45000,
    phone: '+254723456789'
  },
  {
    id: 'BK003',
    guestName: 'David Ochieng',
    roomType: 'Family Villa',
    checkIn: '2025-08-24',
    checkOut: '2025-08-28',
    status: 'confirmed',
    amount: 140000,
    phone: '+254734567890'
  },
  {
    id: 'BK004',
    guestName: 'Grace Akinyi',
    roomType: 'Presidential Suite',
    checkIn: '2025-08-25',
    checkOut: '2025-08-30',
    status: 'checked-in',
    amount: 250000,
    phone: '+254745678901'
  }
]

// Room types
export const roomTypes = [
  {
    id: 'room-1',
    name: 'Deluxe Garden View',
    description: 'Spacious room with beautiful garden views',
    price: 2500, // KSH per night
    amenities: ['King Size Bed', 'Garden View', 'Free WiFi'],
    image: 'https://media.thehenriboma.com/accomodation.jpg?w=400',
    status: 'available',
    totalRooms: 8,
    availableRooms: 5
  },
  {
    id: 'room-2',
    name: 'Heritage Suite',
    description: 'Luxurious suite with cultural elements',
    price: 1500,
    amenities: ['Cultural huts', 'Cultural Decor', 'Garden View', 'Free WiFi'],
    image: 'https://media.thehenriboma.com/huts1.jpg?w=400',
    status: 'available',
    totalRooms: 6,
    availableRooms: 3
  }
]

// Menu categories and items
export const menuCategories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    items: [
      {
        id: 'app-1',
        name: 'Heritage Spring Rolls',
        description: 'Traditional spring rolls with local vegetables',
        price: 1200,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300',
        available: true,
        tags: ['vegetarian', 'local']
      },
      {
        id: 'app-2',
        name: 'Cultural Sampler Platter',
        description: 'Assorted local delicacies and dips',
        price: 1800,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=300',
        available: true,
        tags: ['local', 'sharing']
      }
    ]
  },
  {
    id: 'mains',
    name: 'Main Courses',
    items: [
      {
        id: 'main-1',
        name: 'Nyama Choma Platter',
        description: 'Grilled meat with traditional sides',
        price: 2500,
        category: 'mains',
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300',
        available: true,
        tags: ['meat', 'local', 'grilled']
      },
      {
        id: 'main-2',
        name: 'Tilapia Fish Curry',
        description: 'Fresh tilapia in coconut curry sauce',
        price: 2200,
        category: 'mains',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
        available: true,
        tags: ['fish', 'curry', 'local']
      }
    ]
  }
]

// Recent orders
export const recentOrders = [
  {
    id: 'ORD001',
    customerName: 'Alice Muthoni',
    customerPhone: '+2547852595158',
    items: [
      { name: 'Heritage Spring Rolls', quantity: 2, price: 1200 },
      { name: 'Nyama Choma Platter', quantity: 1, price: 2500 }
    ],
    total: 4900,
    status: 'preparing',
    orderTime: '2025-08-20T14:30:00Z',
    deliveryAddress: 'Room 205',
    assignedStaff: 'Peter Kiprotich'
  },
  {
    id: 'ORD002',
    customerName: 'Robert Otieno',
    customerPhone: '+254723456789',
    items: [
      { name: 'Tilapia Fish Curry', quantity: 2, price: 2200 }
    ],
    total: 4400,
    status: 'out-for-delivery',
    orderTime: '2025-08-20T13:45:00Z',
    deliveryAddress: 'Poolside Table 3',
    assignedStaff: 'Jane Wanjiru'
  }
]

// Day passes
export const dayPasses = [
  {
    id: 'pass-1',
    name: 'Swimming Pool Day Pass',
    description: 'Access to Olympic-sized pool with poolside service',
    price: 2500,
    type: 'pool',
    availability: 50,
    dailyVisitors: 23,
    features: ['Pool Access', 'Poolside Service', 'Towels Included']
  },
  {
    id: 'pass-2',
    name: 'Cultural Museum Tour',
    description: 'Guided tour of local artifacts and heritage displays',
    price: 1500,
    type: 'museum',
    availability: 30,
    dailyVisitors: 18,
    features: ['Guided Tour', 'Audio Guide', 'Historical Artifacts']
  },
  {
    id: 'pass-3',
    name: 'Animal Farm Experience',
    description: 'Interactive experience with friendly farm animals',
    price: 2000,
    type: 'farm',
    availability: 40,
    dailyVisitors: 15,
    features: ['Animal Feeding', 'Educational Tour', 'Photo Opportunities']
  },
  {
    id: 'pass-4',
    name: 'Botanical Garden Walk',
    description: 'Self-guided tour through exotic plants and flowers',
    price: 1200,
    type: 'garden',
    availability: 60,
    dailyVisitors: 12,
    features: ['Self-Guided Tour', 'Plant Identification', 'Photography Spots']
  }
]

// Events
export const privateEventInquiries = [
  {
    id: 'PE001',
    eventType: 'Wedding',
    clientName: 'Sarah & Michael',
    clientEmail: 'sarah.michael@email.com',
    clientPhone: '+2547852595158',
    eventDate: '2025-09-15',
    guestCount: 150,
    budget: 500000,
    status: 'pending',
    inquiryDate: '2025-08-15',
    requirements: 'Outdoor ceremony, traditional decorations, catering for 150 guests'
  },
  {
    id: 'PE002',
    eventType: 'Corporate Conference',
    clientName: 'Tech Solutions Ltd',
    clientEmail: 'events@techsolutions.co.ke',
    clientPhone: '+254723456789',
    eventDate: '2025-09-20',
    guestCount: 80,
    budget: 300000,
    status: 'confirmed',
    inquiryDate: '2025-08-10',
    requirements: 'Conference hall, AV equipment, lunch and coffee breaks'
  }
]

export const resortEvents = [
  {
    id: 'RE001',
    name: 'Cultural Heritage Festival',
    description: 'Celebrate local traditions with music, dance, and food',
    date: '2025-09-01',
    time: '18:00',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    rsvpCount: 45,
    maxCapacity: 100,
    status: 'upcoming'
  },
  {
    id: 'RE002',
    name: 'Traditional Cooking Workshop',
    description: 'Learn to prepare authentic local dishes',
    date: '2025-09-08',
    time: '10:00',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    rsvpCount: 20,
    maxCapacity: 25,
    status: 'upcoming'
  }
]

// Gallery content
export const galleryContent = {
  photos: [
    {
      id: 'photo-1',
      title: 'Resort Exterior',
      category: 'Resort',
      url: 'https://media.thehenriboma.com/top%20view.jpg',
      uploadDate: '2025-08-15'
    },
    {
      id: 'photo-2',
      title: 'Swimming Pool',
      category: 'Facilities',
      url: '	https://media.thehenriboma.com/pool%20aerial%20view.jpg',
      uploadDate: '2025-08-14'
    }
  ],
  videos: [
    {
      id: 'video-1',
      title: 'Resort Tour',
      category: 'Promotional',
      url: 'https://www.facebook.com/reel/963707481446012',
      thumbnail: 'https://media.thehenriboma.com/traditional%20event.jpg',
      uploadDate: '2025-08-10'
    }
  ],
  articles: [
    {
      id: 'article-1',
      title: 'The History of Henri Boma Resort',
      excerpt: 'Discover the rich heritage behind our resort...',
      content: 'Full article content here...',
      author: 'Resort Management',
      publishDate: '2025-08-01',
      category: 'History'
    }
  ]
}

// Payments data
export const paymentsData = {
  summary: {
    totalRevenue: 2450000,
    pendingPayments: 125000,
    failedPayments: 15000,
    successRate: 94.2
  },
  recentPayments: [
    {
      id: 'PAY001',
      amount: 75000,
      method: 'M-Pesa',
      status: 'completed',
      customer: 'John Kamau',
      reference: 'BK001',
      timestamp: '2025-08-20T10:30:00Z'
    },
    {
      id: 'PAY002',
      amount: 4900,
      method: 'Cash',
      status: 'completed',
      customer: 'Alice Muthoni',
      reference: 'ORD001',
      timestamp: '2025-08-20T14:45:00Z'
    }
  ]
}

// Users and roles
export const users = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@thehenriboma.com',
    role: 'Administrator',
    status: 'active',
    lastLogin: '2025-08-20T09:00:00Z',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    username: 'manager',
    email: 'manager@thehenriboma.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-08-20T08:30:00Z',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'user-3',
    username: 'receptionist',
    email: 'reception@thehenriboma.com',
    role: 'Receptionist',
    status: 'active',
    lastLogin: '2025-08-19T17:00:00Z',
    createdAt: '2025-02-01T00:00:00Z'
  }
]

export const roles = [
  {
    id: 'role-1',
    name: 'Administrator',
    permissions: ['all']
  },
  {
    id: 'role-2',
    name: 'Manager',
    permissions: ['bookings', 'rooms', 'menu', 'orders', 'events', 'reports']
  },
  {
    id: 'role-3',
    name: 'Receptionist',
    permissions: ['bookings', 'rooms', 'day-passes']
  },
  {
    id: 'role-4',
    name: 'Kitchen Staff',
    permissions: ['menu', 'orders']
  }
]

// Settings data
export const settingsData = {
  general: {
    resortName: 'The Henri Boma Resort & Cultural Heritage',
    address: '40500, 1306 Henri Gardens and Cultural Heritage Nyamira District, Kenya',
    phone: '+2547852595158',
    email: 'henriresort@gmail.com',
    website: 'https://thehenriboma.com/',
    currency: 'KSH',
    timezone: 'Africa/Nairobi',
    operatingHours: {
      reception: '24/7',
      restaurant: '07:00 - 23:00',
      pool: '06:00 - 22:00',
      museum: '09:00 - 18:00'
    }
  },
  branding: {
    primaryColor: '#4BA3C3',
    accentColor: '#7B4B3A',
    logo: null // Placeholder for logo upload
  },
  payments: {
    mpesa: {
      enabled: true,
      consumerKey: 'your_consumer_key',
      consumerSecret: 'your_consumer_secret',
      shortcode: '174379',
      passkey: 'your_passkey'
    },
    stripe: {
      enabled: false,
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...'
    }
  },
  notifications: {
    email: {
      enabled: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      username: 'notifications@thehenriboma.com',
      password: 'your_password'
    },
    sms: {
      enabled: true,
      provider: 'AfricasTalking',
      apiKey: 'your_api_key',
      username: 'your_username'
    }
  }
}

// Chart data for analytics
export const chartData = {
  dailyBookings: [
    { date: '2025-08-14', bookings: 12 },
    { date: '2025-08-15', bookings: 15 },
    { date: '2025-08-16', bookings: 8 },
    { date: '2025-08-17', bookings: 18 },
    { date: '2025-08-18', bookings: 22 },
    { date: '2025-08-19', bookings: 16 },
    { date: '2025-08-20', bookings: 14 }
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 1800000 },
    { month: 'Feb', revenue: 2100000 },
    { month: 'Mar', revenue: 2400000 },
    { month: 'Apr', revenue: 2200000 },
    { month: 'May', revenue: 2600000 },
    { month: 'Jun', revenue: 2800000 },
    { month: 'Jul', revenue: 3100000 },
    { month: 'Aug', revenue: 2450000 }
  ],
  roomOccupancy: [
    { roomType: 'Deluxe Garden View', occupancy: 75 },
    { roomType: 'Heritage Suite', occupancy: 85 }
  ]
}


// End of mock data exports

