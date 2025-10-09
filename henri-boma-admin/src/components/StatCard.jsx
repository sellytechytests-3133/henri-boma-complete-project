import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  currency = false,
  className = '' 
}) => {
  const formatValue = (val) => {
    if (currency) {
      return `KSH ${val.toLocaleString()}`
    }
    return val.toLocaleString()
  }

  const getTrendColor = () => {
    if (!trend) return ''
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <Card className={`admin-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatValue(value)}
            </p>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span>{trendValue}% from last month</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="ml-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard

