import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import CartModal from '../modals/CartModal'
import { menuCategories } from '../../data/mockData'

const FoodSection = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id)
  const [quantities, setQuantities] = useState({})
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  
  const { addItem, getTotalItems, getTotalPrice } = useCart()

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1
    addItem(item, quantity)
    // Reset quantity for this item
    setQuantities({ ...quantities, [item.id]: 1 })
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1
    setQuantities({ ...quantities, [itemId]: newQuantity })
  }

  const activeMenuCategory = menuCategories.find(cat => cat.id === activeCategory)

  return (
    <>
      <section id="food" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Food Delivery</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enjoy our delicious cuisine delivered fresh to your room or location
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Menu Categories */}
            <div className="lg:w-1/4">
              <div className="bg-card rounded-lg p-4 shadow-md sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Menu Categories</h3>
                <div className="space-y-2">
                  {menuCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Cart Summary */}
                {getTotalItems() > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Cart</span>
                      <div className="flex items-center text-primary">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {getTotalItems()}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary mb-3">
                      ${getTotalPrice().toFixed(2)}
                    </div>
                    <Button 
                      onClick={() => setIsCartModalOpen(true)}
                      className="w-full btn-primary"
                    >
                      View Cart & Checkout
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold">{activeMenuCategory?.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMenuCategory?.items.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg shadow-md overflow-hidden card-hover">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {quantities[item.id] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <Button 
                          onClick={() => addToCart(item)}
                          className="btn-primary"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-card rounded-lg p-6 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚚</span>
                </div>
                <h4 className="font-semibold mb-2">Free Delivery</h4>
                <p className="text-sm text-muted-foreground">Free delivery for orders over $30 within the resort</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⏰</span>
                </div>
                <h4 className="font-semibold mb-2">Quick Service</h4>
                <p className="text-sm text-muted-foreground">Average delivery time: 30-45 minutes</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🕐</span>
                </div>
                <h4 className="font-semibold mb-2">Operating Hours</h4>
                <p className="text-sm text-muted-foreground">Daily: 7:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  )
}

export default FoodSection

