import { useState } from 'react'
import ServiceCard from '../ServiceCard'
import DayPassModal from '../modals/DayPassModal'
import { dayExperiences } from '../../data/mockData'

const ExperiencesSection = () => {
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [isDayPassModalOpen, setIsDayPassModalOpen] = useState(false)

  const handleGetPass = (experience) => {
    setSelectedExperience(experience)
    setIsDayPassModalOpen(true)
  }

  const closeDayPassModal = () => {
    setIsDayPassModalOpen(false)
    setSelectedExperience(null)
  }

  return (
    <>
      <section id="experiences" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Day Experiences</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our unique attractions and activities designed for visitors of all ages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {dayExperiences.map((experience) => (
              <ServiceCard
                key={experience.id}
                title={experience.name}
                description={experience.description}
                image={experience.image}
                price={experience.price}
                features={experience.features}
                buttonText="Get Pass"
                onButtonClick={() => handleGetPass(experience)}
                className="h-full"
              />
            ))}
          </div>
          
          <div className="bg-card rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">Combo Packages Available</h3>
            <p className="text-muted-foreground mb-6">
              Save more with our combination packages! Get access to multiple experiences at discounted rates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Family Fun Package</h4>
                <p className="text-sm text-muted-foreground mb-2">Pool + Animal Farm + Museum</p>
                <p className="text-lg font-bold text-primary">$45/person</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">Nature Explorer</h4>
                <p className="text-sm text-muted-foreground mb-2">Botanical Garden + Animal Farm</p>
                <p className="text-lg font-bold text-accent">$25/person</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">All Access Pass</h4>
                <p className="text-sm text-muted-foreground mb-2">All experiences included</p>
                <p className="text-lg font-bold text-primary">$60/person</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DayPassModal 
        isOpen={isDayPassModalOpen}
        onClose={closeDayPassModal}
        experience={selectedExperience}
      />
    </>
  )
}

export default ExperiencesSection

