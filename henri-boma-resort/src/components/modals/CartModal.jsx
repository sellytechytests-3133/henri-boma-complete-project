import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const CartModal = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Mock checkout process
    setTimeout(() => {
      alert('Order placed successfully! You will receive a confirmation email shortly.')
      clearCart()
      setIsCheckingOut(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold text-foreground">Your Cart</h2>
            <span className="ml-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
              {items.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some delicious items from our menu!</p>
              <Button onClick={onClose} className="btn-primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-muted/30 p-4 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-primary font-bold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border p-6">
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{getTotalPrice() >= 30 ? 'Free' : '$5.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">
                        ${(getTotalPrice() + (getTotalPrice() >= 30 ? 0 : 5) + (getTotalPrice() * 0.08)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="text-sm text-muted-foreground">
                <p>📍 Delivery to: Resort Room (Please specify room number at checkout)</p>
                <p>⏱️ Estimated delivery: 30-45 minutes</p>
                {getTotalPrice() < 30 && (
                  <p className="text-primary">💡 Add ${(30 - getTotalPrice()).toFixed(2)} more for free delivery!</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex-1 btn-primary"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Checkout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartModal

