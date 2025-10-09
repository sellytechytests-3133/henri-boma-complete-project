// Mock data for Henri Boma Resort website

export const roomTypes = [
  {
    id: 1,
    name: "Deluxe Garden View",
    description: "Spacious room with beautiful garden views, perfect for couples seeking tranquility.",
    price: "$150/night",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["King Size Bed", "Garden View", "Free WiFi", "Air Conditioning", "Mini Bar", "Room Service"]
  },
  {
    id: 2,
    name: "Heritage Suite",
    description: "Luxurious suite showcasing local cultural elements with modern comfort.",
    price: "$250/night",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Separate Living Area", "Cultural Decor", "Premium Amenities", "Balcony", "Complimentary Breakfast", "Butler Service"]
  },
  {
    id: 3,
    name: "Family Villa",
    description: "Perfect for families with children, featuring multiple bedrooms and play area.",
    price: "$350/night",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["3 Bedrooms", "Kids Play Area", "Kitchen", "Private Pool", "Family Activities", "Babysitting Service"]
  },
  {
    id: 4,
    name: "Presidential Suite",
    description: "The ultimate luxury experience with panoramic views and exclusive services.",
    price: "$500/night",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["Panoramic Views", "Private Terrace", "Jacuzzi", "Personal Chef", "Concierge Service", "Helicopter Transfer"]
  }
]

export const dayExperiences = [
  {
    id: 1,
    name: "Swimming Pool Day Pass",
    description: "Enjoy our Olympic-sized pool with poolside service and stunning mountain views.",
    price: "$25/person",
    image: "https://media.thehenriboma.com/pool%20aerial%20view.jpg",
    features: ["Pool Access", "Poolside Service", "Towels Included", "Changing Rooms", "Pool Bar Access"]
  },
  {
    id: 2,
    name: "Cultural Museum Tour",
    description: "Explore our extensive collection of local artifacts and cultural heritage displays.",
    price: "$15/person",
    image: "https://media.thehenriboma.com/view%20museum.jpg",
    features: ["Guided Tour", "Audio Guide", "Historical Artifacts", "Interactive Displays", "Gift Shop Access"]
  },
  {
    id: 3,
    name: "Animal Farm Experience",
    description: "Meet and interact with friendly farm animals in our educational petting zoo.",
    price: "$20/person",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Animal Feeding", "Educational Tour", "Photo Opportunities", "Kids Activities", "Farm Fresh Products"]
  },
  {
    id: 4,
    name: "Botanical Garden Walk",
    description: "Stroll through our beautiful botanical gardens featuring exotic plants and flowers.",
    price: "$12/person",
    image: "https://media.thehenriboma.com/view7.jpg",
    features: ["Self-Guided Tour", "Plant Identification", "Photography Spots", "Meditation Areas", "Garden Map"]
  }
]

export const menuCategories = [
  {
    id: 1,
    name: "Appetizers",
    items: [
      { id: 1, name: "Heritage Spring Rolls", description: "Traditional spring rolls with local vegetables", price: 12, image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 2, name: "Cultural Sampler Platter", description: "Assorted local delicacies and dips", price: 18, image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 3, name: "Garden Fresh Salad", description: "Mixed greens from our organic garden", price: 14, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: 2,
    name: "Main Courses",
    items: [
      { id: 4, name: "Grilled Heritage Chicken", description: "Free-range chicken with traditional spices", price: 28, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 5, name: "Local Fish Curry", description: "Fresh catch with coconut curry sauce", price: 32, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 6, name: "Vegetarian Feast", description: "Seasonal vegetables with quinoa and herbs", price: 24, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: 3,
    name: "Desserts",
    items: [
      { id: 7, name: "Traditional Honey Cake", description: "Local honey with seasonal fruits", price: 10, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 8, name: "Tropical Fruit Parfait", description: "Fresh tropical fruits with yogurt", price: 12, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: 4,
    name: "Beverages",
    items: [
      { id: 9, name: "Heritage Blend Coffee", description: "Locally roasted coffee beans", price: 6, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 10, name: "Fresh Fruit Smoothie", description: "Seasonal fruits blended fresh", price: 8, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 11, name: "Traditional Herbal Tea", description: "Locally sourced healing herbs", price: 5, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  }
]

export const privateEvents = [
  {
    id: 1,
    name: "Wedding Ceremonies",
    description: "Create magical moments with our comprehensive wedding packages in stunning natural settings.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Ceremony Venue", "Reception Hall", "Catering Service", "Floral Arrangements", "Photography", "Wedding Coordinator"]
  },
  {
    id: 2,
    name: "Corporate Conferences",
    description: "Professional meeting spaces with modern technology and catering services.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Conference Rooms", "AV Equipment", "Business Catering", "WiFi", "Parking", "Team Building Activities"]
  },
  {
    id: 3,
    name: "Birthday Celebrations",
    description: "Memorable birthday parties with customized themes and entertainment options.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Party Venue", "Themed Decorations", "Entertainment", "Custom Cake", "Photography", "Party Coordinator"]
  }
]

export const resortEvents = [
  {
    id: 1,
    name: "Cultural Heritage Festival",
    date: "March 15, 2024",
    time: "6:00 PM - 10:00 PM",
    description: "Celebrate local culture with traditional music, dance, and cuisine.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Sunset Yoga Session",
    date: "Every Saturday",
    time: "5:30 PM - 6:30 PM",
    description: "Relaxing yoga session with beautiful sunset views.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Farm-to-Table Dinner",
    date: "April 20, 2024",
    time: "7:00 PM - 9:00 PM",
    description: "Special dinner featuring ingredients from our organic farm.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Art & Craft Workshop",
    date: "May 5, 2024",
    time: "2:00 PM - 5:00 PM",
    description: "Learn traditional crafts from local artisans.",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
]

export const galleryItems = {
  photos: [
    {
      id: 1,
      title: "Resort Exterior",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Resort"
    },
    {
      id: 2,
      title: "Swimming Pool",
      image: "https://media.thehenriboma.com/pool%20aerial%20view.jpg",
      category: "Facilities"
    },
    {
      id: 3,
      title: "Heritage Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Rooms"
    },
    {
      id: 4,
      title: "Cultural Museum",
      image: "https://media.thehenriboma.com/view%20museum.jpg",
      category: "Culture"
    },
    {
      id: 5,
      title: "Botanical Garden",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Nature"
    },
    {
      id: 6,
      title: "Farm Animals",
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Farm"
    }
  ],
  videos: [
    {
      id: 1,
      title: "Resort Tour",
      thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Cultural Performance",
      thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "5:20"
    }
  ],
  articles: [
    {
      id: 1,
      title: "The History of Henri Boma Resort",
      excerpt: "Discover the rich heritage and cultural significance of our resort...",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "March 10, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Sustainable Tourism Practices",
      excerpt: "Learn about our commitment to environmental conservation...",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "March 5, 2024",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Local Cuisine and Traditions",
      excerpt: "Explore the flavors and culinary traditions of our region...",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "February 28, 2024",
      readTime: "4 min read"
    }
  ]
}

