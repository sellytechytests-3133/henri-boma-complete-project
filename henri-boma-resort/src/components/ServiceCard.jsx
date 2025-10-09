import { Button } from '@/components/ui/button'

const ServiceCard = ({ 
  title, 
  description, 
  image, 
  price, 
  features = [], 
  buttonText = "Learn More", 
  onButtonClick,
  className = ""
}) => {
  return (
    <div className={`bg-card rounded-lg shadow-md overflow-hidden card-hover ${className}`}>
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          {price && (
            <span className="text-lg font-bold text-primary">{price}</span>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        {features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        <Button 
          onClick={onButtonClick}
          className="w-full btn-primary"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default ServiceCard

