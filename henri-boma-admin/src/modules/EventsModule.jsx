import { useState } from 'react'
import { Plus, Calendar, Users, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataTable from '../components/DataTable'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { privateEventInquiries, resortEvents } from '../data/mockData'

const EventsModule = () => {
  const [privateEvents, setPrivateEvents] = useState(privateEventInquiries)
  const [hostedEvents, setHostedEvents] = useState(resortEvents)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [isAddInquiryModalOpen, setIsAddInquiryModalOpen] = useState(false)

  const privateEventColumns = [
    { key: 'id', label: 'Inquiry ID', sortable: true },
    { key: 'eventType', label: 'Event Type', sortable: true },
    { key: 'clientName', label: 'Client Name', sortable: true },
    { key: 'clientPhone', label: 'Phone', sortable: false },
    { key: 'eventDate', label: 'Event Date', type: 'date', sortable: true },
    { key: 'guestCount', label: 'Guests', sortable: true },
    { key: 'budget', label: 'Budget', type: 'currency', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'pending': 'secondary',
        'confirmed': 'default',
        'cancelled': 'destructive',
        'completed': 'default'
      }
    }
  ]

  const handleStatusChange = (eventId, newStatus) => {
    setPrivateEvents(privateEvents.map(event => 
      event.id === eventId 
        ? { ...event, status: newStatus }
        : event
    ))
  }

  const getEventStats = () => {
    const privateStats = privateEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1
      if (event.status === 'confirmed') {
        acc.totalRevenue = (acc.totalRevenue || 0) + event.budget
      }
      return acc
    }, {})

    const hostedStats = hostedEvents.reduce((acc, event) => {
      acc.totalRSVPs = (acc.totalRSVPs || 0) + event.rsvpCount
      acc.totalCapacity = (acc.totalCapacity || 0) + event.maxCapacity
      return acc
    }, {})
    
    return {
      pendingInquiries: privateStats.pending || 0,
      confirmedEvents: privateStats.confirmed || 0,
      totalRevenue: privateStats.totalRevenue || 0,
      upcomingHosted: hostedEvents.filter(e => e.status === 'upcoming').length,
      totalRSVPs: hostedStats.totalRSVPs || 0
    }
  }

  const eventStats = getEventStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">Manage private event inquiries and resort-hosted events</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddInquiryModalOpen} onOpenChange={setIsAddInquiryModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Inquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Private Event Inquiry</DialogTitle>
                <DialogDescription>
                  Record a new private event inquiry
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" placeholder="Sarah & Michael" />
                  </div>
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input id="clientEmail" type="email" placeholder="client@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Phone</Label>
                    <Input id="clientPhone" placeholder="+2547852595158" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input id="eventDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="guestCount">Guest Count</Label>
                    <Input id="guestCount" type="number" placeholder="150" />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (KSH)</Label>
                    <Input id="budget" type="number" placeholder="500000" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea id="requirements" placeholder="Outdoor ceremony, traditional decorations..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddInquiryModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddInquiryModalOpen(false)}>
                    Add Inquiry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resort Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Resort Event</DialogTitle>
                <DialogDescription>
                  Add a new resort-hosted event
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input id="eventName" placeholder="Cultural Heritage Festival" />
                </div>
                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea id="eventDescription" placeholder="Celebrate local traditions with music, dance, and food..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Date</Label>
                    <Input id="eventDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Time</Label>
                    <Input id="eventTime" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input id="maxCapacity" type="number" placeholder="100" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventImage">Event Image URL</Label>
                  <Input id="eventImage" placeholder="https://media.thehenriboma.com/..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddEventModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddEventModalOpen(false)}>
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Pending Inquiries"
          value={eventStats.pendingInquiries}
          icon={Clock}
          className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
        />
        <StatCard
          title="Confirmed Events"
          value={eventStats.confirmedEvents}
          icon={CheckCircle}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Event Revenue"
          value={eventStats.totalRevenue}
          icon={Calendar}
          currency={true}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Upcoming Hosted"
          value={eventStats.upcomingHosted}
          icon={MapPin}
          className="border-purple-200 bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          title="Total RSVPs"
          value={eventStats.totalRSVPs}
          icon={Users}
          className="border-orange-200 bg-orange-50 dark:bg-orange-950"
        />
      </div>

      <Tabs defaultValue="private" className="space-y-6">
        <TabsList>
          <TabsTrigger value="private">Private Event Inquiries</TabsTrigger>
          <TabsTrigger value="hosted">Resort-Hosted Events</TabsTrigger>
        </TabsList>

        <TabsContent value="private" className="space-y-6">
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
                  onClick={() => handleStatusChange('PE001', 'confirmed')}
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Confirm Inquiry</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Send quote')}
                >
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span>Send Quote</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Schedule site visit')}
                >
                  <MapPin className="h-6 w-6 text-purple-600" />
                  <span>Schedule Visit</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Generate contract')}
                >
                  <Users className="h-6 w-6 text-orange-600" />
                  <span>Generate Contract</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Private Events Table */}
          <DataTable
            title="Private Event Inquiries"
            data={privateEvents}
            columns={privateEventColumns}
            searchable={true}
            filterable={true}
            onView={(event) => console.log('View inquiry:', event)}
            onEdit={(event) => console.log('Edit inquiry:', event)}
            onDelete={(event) => console.log('Delete inquiry:', event)}
          />
        </TabsContent>

        <TabsContent value="hosted" className="space-y-6">
          {/* Resort Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostedEvents.map((event) => (
              <Card key={event.id} className="admin-card overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      event.status === 'upcoming' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.rsvpCount}/{event.maxCapacity} RSVPs
                      </span>
                    </div>
                    <Badge variant="outline">
                      {Math.round((event.rsvpCount / event.maxCapacity) * 100)}% full
                    </Badge>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(event.rsvpCount / event.maxCapacity) * 100}%` 
                      }}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View RSVPs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Event Management Actions */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Event Management Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Send event reminders')}
                >
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span>Send Reminders</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Generate attendee list')}
                >
                  <Users className="h-6 w-6 text-green-600" />
                  <span>Attendee List</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Update event details')}
                >
                  <MapPin className="h-6 w-6 text-purple-600" />
                  <span>Update Details</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Event analytics')}
                >
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EventsModule

