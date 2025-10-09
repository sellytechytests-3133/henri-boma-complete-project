import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ServiceCard from '../ServiceCard'
import BookingModal from '../modals/BookingModal'
import { roomTypes } from '../../data/mockData'

const AccommodationSection = () => {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const handleBookRoom = (room) => {
    setSelectedRoom(room)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedRoom(null)
  }

  return (
    <>
      <section id="accommodation" className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Accommodation</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our carefully designed rooms and suites, each offering unique comfort and style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {roomTypes.map((room) => (
              <ServiceCard
                key={room.id}
                title={room.name}
                description={room.description}
                image={room.image}
                price={room.price}
                features={room.amenities}
                buttonText="Book Now"
                onButtonClick={() => handleBookRoom(room)}
                className="h-full"
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All rooms include complimentary WiFi, daily housekeeping, and access to resort facilities
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Amenities
            </Button>
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        room={selectedRoom}
      />
    </>
  )
}

export default AccommodationSection

