import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users } from 'lucide-react'
import RSVPModal from '../modals/RSVPModal'
import { privateEvents, resortEvents } from '../../data/mockData'

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('private')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false)

  const handleRSVP = (event) => {
    setSelectedEvent(event)
    setIsRSVPModalOpen(true)
  }

  const closeRSVPModal = () => {
    setIsRSVPModalOpen(false)
    setSelectedEvent(null)
  }

  const handleInquireEvent = (event) => {
    console.log('Inquire about event:', event.name)
    alert(`Thank you for your interest in ${event.name}! Our event planning team will contact you shortly.`)
  }

  return (
    <>
      <section id="events" className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Events</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From intimate celebrations to grand gatherings, we create memorable experiences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-card rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('private')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'private'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Private Events
              </button>
              <button
                onClick={() => setActiveTab('resort')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'resort'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Resort Events
              </button>
            </div>
          </div>

          {/* Private Events Tab */}
          {activeTab === 'private' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">Private Events & Catering</h3>
                <p className="text-muted-foreground">
                  Let us help you create unforgettable moments for your special occasions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {privateEvents.map((event) => (
                  <div key={event.id} className="bg-card rounded-lg shadow-md overflow-hidden card-hover">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3">{event.name}</h4>
                      <p className="text-muted-foreground mb-4 text-sm">{event.description}</p>
                      <ul className="space-y-1 mb-4">
                        {event.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        onClick={() => handleInquireEvent(event)}
                        className="w-full btn-primary"
                      >
                        Get Quote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resort Events Tab */}
          {activeTab === 'resort' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">Resort-Hosted Cultural Events</h3>
                <p className="text-muted-foreground">
                  Join us for special events celebrating local culture and traditions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resortEvents.map((event) => (
                  <div key={event.id} className="bg-card rounded-lg shadow-md overflow-hidden card-hover">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3">{event.name}</h4>
                      <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">{event.description}</p>
                      <Button 
                        onClick={() => handleRSVP(event)}
                        className="w-full btn-accent"
                      >
                        RSVP Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact for Custom Events */}
          <div className="bg-card rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">Planning Something Special?</h3>
            <p className="text-muted-foreground mb-6">
              Our event planning team is here to help you create the perfect celebration. 
              Contact us to discuss your custom event needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">
                <Users className="h-4 w-4 mr-2" />
                Speak with Event Planner
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Download Event Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RSVPModal 
        isOpen={isRSVPModalOpen}
        onClose={closeRSVPModal}
        event={selectedEvent}
      />
    </>
  )
}

export default EventsSection

