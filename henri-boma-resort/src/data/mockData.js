// Mock data for Henri Boma Resort website

export const roomTypes = [
  {
    id: 1,
    name: "Deluxe Garden View",
    description: "Spacious room with beautiful garden views, perfect for couples seeking tranquility.",
    price: "ksh2500/night",
    image: "https://media.thehenriboma.com/accomodation.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ["King Size Bed", "Garden View", "Free WiFi", "Room Service"]
  },
  {
    id: 2,
    name: "Heritage Suite",
    description: "Luxurious suite showcasing local cultural elements with modern comfort.",
    price: "ksh1500/night",
    image: "https://media.thehenriboma.com/huts1.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    amenities: ['Cultural huts', "Cultural Decor", 'Premium Amenities', 'Room Service']
  }
]

export const dayExperiences = [
  {
    id: 1,
    name: "Swimming Pool Day Pass",
    description: "Enjoy our Olympic-sized pool with poolside service and stunning mountain views.",
    price: "ksh400/person",
    image: "https://media.thehenriboma.com/pool%20aerial%20view.jpg",
    features: ["Pool Access", "Poolside Service", "Towels Included", "Changing Rooms", "Pool Bar Access"]
  },
  {
    id: 2,
    name: "Cultural Museum Tour",
    description: "Explore our extensive collection of local artifacts and cultural heritage displays.",
    price: "ksh300/person",
    image: "https://media.thehenriboma.com/view%20museum.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Guided Tour", "Audio Guide", "Historical Artifacts", "Interactive Displays", "Gift Shop Access"]
  },
  {
    id: 3,
    name: "Animal Farm Experience",
    description: "Meet and interact with friendly farm animals in our educational petting zoo.",
    price: "ksh300/person",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Animal Feeding", "Educational Tour", "Photo Opportunities", "Kids Activities", "Farm Fresh Products"]
  },
  {
    id: 4,
    name: "Botanical Garden Walk",
    description: "Stroll through our beautiful botanical gardens featuring exotic plants and flowers.",
    price: "$12/person",
    image: "https://media.thehenriboma.com/view.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Self-Guided Tour", "Plant Identification", "Photography Spots", "Meditation Areas", "Garden Map"]
  }
]

export const menuCategories = [
  {
    id: 1,
    name: "Appetizers",
    items: [
      { id: 1, name: "Swahili Sampler Platter", description: "Sampler platter of Swahili dishes", price: 1200, image: "https://media.thehenriboma.com/menu/bites-platter.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 2, name: "Samosa", description: "Samosas", price: 70, image: "https://media.thehenriboma.com/menu/samosa.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 3, name: "Sausage", description: "Sausage", price: 60, image: "https://media.thehenriboma.com/menu/sausage.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 4, name: "Smookie Pasua", description: "Smookie Pasua", price: 60, image: "https://media.thehenriboma.com/menu/smokie-pasua.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 5, name: "Viazi Karai", description: "Viazi Karai", price: 150, image: "https://media.thehenriboma.com/menu/viazi-karai.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 6, name: "Swahili Breakfast Platter", description: "Swahili Breakfast Platter", price: 1450, image: "https://media.thehenriboma.com/menu/swahili-breakfast-platter.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 7, name: "Springroll", description: "Springroll", price: 70, image: "https://media.thehenriboma.com/menu/springrol.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 8, name: "Mshakiki", description: "Mshakiki", price: 200, image: "https://media.thehenriboma.com/menu/mshakiki.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 9, name: "Meat Platter", description: "Meat Platter", price: 1600, image: "https://media.thehenriboma.com/menu/meat-platter.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 10, name: "Cassava Fry", description: "Cassava Fry", price: 140, image: "https://media.thehenriboma.com/menu/cassava-fry.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 11, name: "Maru Bhajiya", description: "Maru Bhajiya", price: 200, image: "https://media.thehenriboma.com/menu/maru-bhajiya.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 12, name: "Chips", description: "Chips", price: 200, image: "https://media.thehenriboma.com/menu/fries.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 13, name: "Loaded Chips", description: "Loaded Chips", price: 400, image: "https://media.thehenriboma.com/menu/Loaded-Chips.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 14, name: "Seasoned fries", description: "Seasoned fries", price: 250, image: "https://media.thehenriboma.com/menu/seasoned-fries.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 15, name: "Chips masala", description: "Chips masala", price: 200, image: "https://media.thehenriboma.com/menu/chips-masala.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 16, name: "Kids bites", description: "Kids bites", price: 160, image: "https://media.thehenriboma.com/menu/kids-bites.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: 2,
    name: "Main Courses",
    items: [
      { id: 17, name: "Grilled Heritage Chicken", description: "Free-range chicken with traditional spices", price: 1600, image: "https://media.thehenriboma.com/menu/grill-turkey.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 18, name: "Rice", description: "Rice", price: 100, image: "https://media.thehenriboma.com/menu/rice.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 19, name: "Beans", description: "Beans", price: 100, image: "https://media.thehenriboma.com/menu/Bean-Stew.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 20, name: "Ugali", description: "Ugali", price: 50, image: "https://media.thehenriboma.com/menu/ugali.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 21, name: "Matoke", description: "Matoke", price: 150, image: "https://media.thehenriboma.com/menu/matoke-special.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 22, name: "Mukimo wetfry", description: "Mukimo wetfry", price: 250, image: "https://media.thehenriboma.com/menu/mukimo-wetfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 23, name: "Ndengu", description: "Ndengu", price: 100, image: "https://media.thehenriboma.com/menu/ndengu-stew.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 24, name: "Kachumbari", description: "Kachumbari", price: 50, image: "https://media.thehenriboma.com/menu/kachumbari.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 25, name: "Minji stew", description: "Minji stew", price: 100, image: "https://media.thehenriboma.com/menu/minji-stew.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 26, name: "Fish deepfry", description: "Fish deepfry", price: 800, image: "https://media.thehenriboma.com/menu/fish-deepfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 27, name: "Fish Wetfry", description: "Fish Wetfry", price: 800, image: "https://media.thehenriboma.com/menu/fish-wetfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 28, name: "Fish Ugali", description: "Fish Ugali", price: 800, image: "https://media.thehenriboma.com/menu/ugai-fishfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 29, name: "Kuku Choma", description: "Grilled chicken", price: 750, image: "https://media.thehenriboma.com/menu/kuku-choma.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 30, name: "Kuku Wetfry", description: "Chicken Wetfry", price: 700, image: "https://media.thehenriboma.com/menu/chicken-wetfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 31, name: "Kuku Dryfry", description: "Chicken Dryfry", price: 700, image: "https://media.thehenriboma.com/menu/kuku-dryfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 32, name: "Liver and Mash", description: "Liver stew and mashed potatoes", price: 300, image: "https://media.thehenriboma.com/menu/mashed-potatos-maini-kachu.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 33, name: "Tomato Soup", description: "Tomato Soup", price: 200, image: "https://media.thehenriboma.com/menu/tomato-soup.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 34, name: "Pilau Kachumbari", description: "Pilau with kachumbari", price: 500, image: "https://media.thehenriboma.com/menu/pilau-kachumbari.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 35, name: "Pilau Platter", description: "Pilau with viazi karai", price: 1200, image: "https://media.thehenriboma.com/menu/pilau-viazi-kachumbari.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 36, name: "Ugali Pork Choma", description: "Ugali Pork Choma", price: 700, image: "https://media.thehenriboma.com/menu/ugali-pork-choma.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 37, name: "Beef Dryfry", description: "Beef Dryfry", price: 700, image: "https://media.thehenriboma.com/menu/beef-dryfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 38, name: "Beef Choma", description: "Beef Choma", price: 700, image: "https://media.thehenriboma.com/menu/beef-choma.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 39, name: "Beef Panfry", description: "Beef panfry", price: 700, image: "https://media.thehenriboma.com/menu/beef-panfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 40, name: "Andazi", description: "andazi", price: 30, image: "https://media.thehenriboma.com/menu/andazi.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 41, name: "Mahamri", description: "Mahamri", price: 50, image: "https://media.thehenriboma.com/menu/mahamri.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 42, name: "Pancake", description: "pancake", price: 700, image: "https://media.thehenriboma.com/menu/pancake.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 43, name: "Mbuzi Choma", description: "Grilled Goat meat", price: 700, image: "https://media.thehenriboma.com/menu/mbuzi-choma.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 44, name: "Mbuzi Dryfry", description: "Goat meat dryfry", price: 700, image: "https://media.thehenriboma.com/menu/mbuzi-dryfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 45, name: "Mbuzi Wetfry", description: "Goat meat Wetfry", price: 700, image: "https://media.thehenriboma.com/menu/mbuzi-wetfry.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    id: 3,
    name: "Beverages",
    items: [
      { id: 46, name: "Fresh Juice", description: "Fresh Fruit juice", price: 100, image: "https://media.thehenriboma.com/menu/fresh-juices.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 47, name: "Delmonte Juice", description: "Delmonte Juice", price: 300, image: "https://media.thehenriboma.com/menu/delmonte.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 48, name: "Chai dawa", description: "medicinal Tea concoction", price: 200, image: "https://media.thehenriboma.com/menu/dawa-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 49, name: "Cinnamon tea", description: "cinnamon tea", price: 200, image: "https://media.thehenriboma.com/menu/cinnamon-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 50, name: "Ice latte", description: "Ice latte", price: 250, image: "https://media.thehenriboma.com/menu/ice-latte-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 51, name: "Chocolate tea", description: "Chocolate tea", price: 200, image: "https://media.thehenriboma.com/menu/chocolate-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 52, name: "Soda", description: "Soda", price: 100, image: "https://media.thehenriboma.com/menu/soda.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 53, name: "Masala tea", description: "Masala tea", price: 200, image: "https://media.thehenriboma.com/menu/masala-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 54, name: "Cardamon tea", description: "Cardamon tea", price: 200, image: "https://media.thehenriboma.com/menu/cardamon-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 55, name: "Black tea", description: "Black tea", price: 150, image: "https://media.thehenriboma.com/menu/black-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 56, name: "Black coffee", description: "Black coffee", price: 200, image: "https://media.thehenriboma.com/menu/black-coffee.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 57, name: "Milk tea", description: "Milk tea", price: 200, image: "https://media.thehenriboma.com/menu/milk-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 58, name: "Milk", description: "Milk", price: 200, image: "https://media.thehenriboma.com/menu/milk.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 59, name: "Green tea", description: "Green tea", price: 200, image: "https://media.thehenriboma.com/menu/green-tea.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
      { id: 60, name: "Coffee", description: "Coffee", price: 250, image: "https://media.thehenriboma.com/menu/coffee.jpeg?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
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
      image: "https://media.thehenriboma.com/top view.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Resort"
    },
    {
      id: 2,
      title: "Swimming Pool",
      image: "https://media.thehenriboma.com/pool%20aerial%20view.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Facilities"
    },
    {
      id: 3,
      title: "Heritage Suite",
      image: "https://media.thehenriboma.com/huts1.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Rooms"
    },
    {
      id: 4,
      title: "Cultural Museum",
      image: "https://media.thehenriboma.com/view%20museum.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      thumbnail: "https://media.thehenriboma.com/tour.mp4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Cultural Performance",
      thumbnail: "https://media.thehenriboma.com/musicians.mp4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

