import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Calendar, Users, Clock, CreditCard } from 'lucide-react'

const DayPassModal = ({ isOpen, onClose, experience }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock pass purchase submission
    console.log('Day pass purchased:', { experience: experience?.name, ...formData })
    alert(`Day pass purchased for ${experience?.name}! You will receive a confirmation email shortly.`)
    onClose()
    setFormData({
      date: '',
      time: '',
      guests: 1,
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    })
  }

  const calculateTotal = () => {
    const pricePerPerson = parseInt(experience?.price?.replace(/[^0-9]/g, '') || '0')
    return formData.guests * pricePerPerson
  }

  if (!isOpen || !experience) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Get Day Pass</h2>
            <p className="text-muted-foreground">{experience.name}</p>
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

        {/* Experience Info */}
        <div className="p-6 border-b border-border">
          <div className="flex gap-4">
            <img 
              src={experience.image} 
              alt={experience.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{experience.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{experience.description}</p>
              <p className="text-primary font-bold text-lg">{experience.price}</p>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Included:</h4>
            <ul className="grid grid-cols-2 gap-1">
              {experience.features?.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date, Time and Guests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Visit Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Preferred Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Number of Guests *
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              placeholder="+254 785259515"
            />
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium mb-2">
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background resize-none"
              placeholder="Any special requests or accessibility needs..."
            ></textarea>
          </div>

          {/* Purchase Summary */}
          {formData.guests && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Purchase Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span>{experience.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formData.date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formData.time || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>{experience.price}</span>
                </div>
                <div className="flex justify-between font-semibold text-primary border-t border-border pt-1 mt-2">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase Pass
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DayPassModal

