import { useState } from 'react'
import { Plus, Edit, Trash2, Users, Waves, Building, TreePine, Flower } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { dayPasses } from '../data/mockData'

const DayPassesModule = () => {
  const [passes, setPasses] = useState(dayPasses)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPass, setSelectedPass] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const passIcons = {
    pool: Waves,
    museum: Building,
    farm: TreePine,
    garden: Flower
  }

  const handleEditPass = (pass) => {
    setSelectedPass(pass)
    setIsEditModalOpen(true)
  }

  const handleDeletePass = (pass) => {
    if (confirm(`Are you sure you want to delete ${pass.name}?`)) {
      setPasses(passes.filter(p => p.id !== pass.id))
    }
  }

  const getTotalStats = () => {
    return {
      totalPasses: passes.length,
      totalVisitors: passes.reduce((sum, pass) => sum + pass.dailyVisitors, 0),
      totalCapacity: passes.reduce((sum, pass) => sum + pass.availability, 0),
      totalRevenue: passes.reduce((sum, pass) => sum + (pass.price * pass.dailyVisitors), 0)
    }
  }

  const stats = getTotalStats()

  const PassForm = ({ pass, onClose, onSave }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="passName">Pass Name</Label>
        <Input 
          id="passName" 
          defaultValue={pass?.name || ''} 
          placeholder="Swimming Pool Day Pass" 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          defaultValue={pass?.description || ''} 
          placeholder="Access to Olympic-sized pool with poolside service..." 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (KSH)</Label>
          <Input 
            id="price" 
            type="number" 
            defaultValue={pass?.price || ''} 
            placeholder="2500" 
          />
        </div>
        <div>
          <Label htmlFor="availability">Daily Capacity</Label>
          <Input 
            id="availability" 
            type="number" 
            defaultValue={pass?.availability || ''} 
            placeholder="50" 
          />
        </div>
      </div>
      <div>
        <Label htmlFor="type">Pass Type</Label>
        <select 
          id="type" 
          defaultValue={pass?.type || 'pool'}
          className="w-full p-2 border rounded-md"
        >
          <option value="pool">Swimming Pool</option>
          <option value="museum">Cultural Museum</option>
          <option value="farm">Animal Farm</option>
          <option value="garden">Botanical Garden</option>
        </select>
      </div>
      <div>
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Textarea 
          id="features" 
          defaultValue={pass?.features?.join(', ') || ''} 
          placeholder="Pool Access, Poolside Service, Towels Included..." 
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          onSave()
          onClose()
        }}>
          {pass ? 'Update' : 'Create'} Pass
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Day Pass Management</h1>
          <p className="text-muted-foreground">Manage day passes for resort facilities and experiences</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Day Pass
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Day Pass</DialogTitle>
              <DialogDescription>
                Add a new day pass for resort facilities
              </DialogDescription>
            </DialogHeader>
            <PassForm 
              onClose={() => setIsAddModalOpen(false)}
              onSave={() => console.log('Save new pass')}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Pass Types"
          value={stats.totalPasses}
          icon={Users}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Today's Visitors"
          value={stats.totalVisitors}
          icon={Users}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Total Capacity"
          value={stats.totalCapacity}
          icon={Building}
          className="border-purple-200 bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          title="Today's Revenue"
          value={stats.totalRevenue}
          icon={Users}
          currency={true}
          className="border-orange-200 bg-orange-50 dark:bg-orange-950"
        />
      </div>

      {/* Day Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {passes.map((pass) => {
          const Icon = passIcons[pass.type] || Users
          const utilizationRate = (pass.dailyVisitors / pass.availability) * 100
          
          return (
            <Card key={pass.id} className="admin-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{pass.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{pass.type} Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditPass(pass)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePass(pass)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{pass.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    KSH {pass.price.toLocaleString()}
                  </span>
                  <Badge variant="outline">
                    {pass.dailyVisitors}/{pass.availability} visitors
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Today's Utilization</span>
                    <span>{utilizationRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={utilizationRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {pass.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold text-green-600">{pass.dailyVisitors}</p>
                    <p className="text-xs text-muted-foreground">Today's Visitors</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold text-primary">
                      KSH {(pass.price * pass.dailyVisitors).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Today's Revenue</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Visitors
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Generate Pass
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Check-in visitor')}
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span>Check-in Visitor</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Generate daily report')}
            >
              <Building className="h-6 w-6 text-green-600" />
              <span>Daily Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Update capacity')}
            >
              <TreePine className="h-6 w-6 text-purple-600" />
              <span>Update Capacity</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Send notifications')}
            >
              <Flower className="h-6 w-6 text-orange-600" />
              <span>Send Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Pass Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Day Pass</DialogTitle>
            <DialogDescription>
              Update day pass information and settings
            </DialogDescription>
          </DialogHeader>
          <PassForm 
            pass={selectedPass}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => console.log('Save pass changes')}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DayPassesModule

