import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Calendar, Clock, Users, Mail } from 'lucide-react'

const RSVPModal = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    dietaryRestrictions: '',
    specialRequests: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock RSVP submission
    console.log('RSVP submitted:', { event: event?.name, ...formData })
    alert(`RSVP confirmed for ${event?.name}! You will receive a confirmation email shortly.`)
    onClose()
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: 1,
      dietaryRestrictions: '',
      specialRequests: ''
    })
  }

  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">RSVP for Event</h2>
            <p className="text-muted-foreground">{event.name}</p>
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

        {/* Event Info */}
        <div className="p-6 border-b border-border">
          <div className="space-y-3">
            <img 
              src={event.image} 
              alt={event.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{event.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              placeholder="+254 785259515"
            />
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
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium mb-2">
              Dietary Restrictions
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
              placeholder="e.g., Vegetarian, Gluten-free, Allergies"
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
              placeholder="Any special requests or questions..."
            ></textarea>
          </div>

          {/* RSVP Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">RSVP Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Event:</span>
                <span>{event.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{event.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{event.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{formData.guests}</span>
              </div>
            </div>
          </div>

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
              className="flex-1 btn-accent"
            >
              <Mail className="h-4 w-4 mr-2" />
              Confirm RSVP
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RSVPModal

