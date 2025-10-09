import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AccommodationSection from './components/sections/AccommodationSection'
import ExperiencesSection from './components/sections/ExperiencesSection'
import EventsSection from './components/sections/EventsSection'
import FoodSection from './components/sections/FoodSection'
import GallerySection from './components/sections/GallerySection'
import ContactSection from './components/sections/ContactSection'
import { CartProvider } from './contexts/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section id="hero" className="hero-bg min-h-screen flex items-center justify-center text-white">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  The Henri Boma Resort
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-gray-200">
                  & Cultural Heritage
                </p>
                <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                  Experience the perfect blend of luxury accommodation, cultural heritage, 
                  and natural beauty in an unforgettable setting.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    Book a Room
                  </button>
                  <button 
                    onClick={() => document.getElementById('food')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    Order Food
                  </button>
                  <button 
                    onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    Plan a Visit
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Overview Section */}
          <section id="services" className="section-padding bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Discover our comprehensive range of services designed to make your stay memorable
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                  className="bg-card p-6 rounded-lg shadow-md card-hover text-center cursor-pointer"
                  onClick={() => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Accommodation</h3>
                  <p className="text-muted-foreground">Luxury rooms and suites with modern amenities</p>
                </div>
                
                <div 
                  className="bg-card p-6 rounded-lg shadow-md card-hover text-center cursor-pointer"
                  onClick={() => document.getElementById('food')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Food Delivery</h3>
                  <p className="text-muted-foreground">Delicious local and international cuisine</p>
                </div>
                
                <div 
                  className="bg-card p-6 rounded-lg shadow-md card-hover text-center cursor-pointer"
                  onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Events & Catering</h3>
                  <p className="text-muted-foreground">Perfect venue for weddings and conferences</p>
                </div>
                
                <div 
                  className="bg-card p-6 rounded-lg shadow-md card-hover text-center cursor-pointer"
                  onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Swimming Pool</h3>
                  <p className="text-muted-foreground">Refreshing pool with stunning views</p>
                </div>
                
                <div 
                  className="bg-card p-6 rounded-lg shadow-md card-hover text-center cursor-pointer"
                  onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cultural Museum</h3>
                  <p className="text-muted-foreground">Explore local history and heritage</p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-md card-hover text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧘</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Spa (Coming Soon)</h3>
                  <p className="text-muted-foreground">Relaxation and wellness treatments</p>
                </div>
              </div>
            </div>
          </section>

          {/* All the detailed sections */}
          <AccommodationSection />
          <ExperiencesSection />
          <EventsSection />
          <FoodSection />
          <GallerySection />
          <ContactSection />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </CartProvider>
  )
}

export default App

