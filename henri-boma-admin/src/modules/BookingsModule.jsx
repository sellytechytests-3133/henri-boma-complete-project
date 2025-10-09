import { useState } from 'react'
import { Plus, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { recentBookings, roomTypes } from '../data/mockData'

const BookingsModule = () => {
  const [bookings, setBookings] = useState(recentBookings)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const bookingColumns = [
    { key: 'id', label: 'Booking ID', sortable: true },
    { key: 'guestName', label: 'Guest Name', sortable: true },
    { key: 'roomType', label: 'Room Type', sortable: true },
    { key: 'checkIn', label: 'Check-in', type: 'date', sortable: true },
    { key: 'checkOut', label: 'Check-out', type: 'date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'confirmed': 'default',
        'pending': 'secondary',
        'checked-in': 'default',
        'cancelled': 'destructive'
      }
    },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false }
  ]

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleEditBooking = (booking) => {
    console.log('Edit booking:', booking)
    // Implement edit functionality
  }

  const handleDeleteBooking = (booking) => {
    if (confirm(`Are you sure you want to delete booking ${booking.id}?`)) {
      setBookings(bookings.filter(b => b.id !== booking.id))
    }
  }

  const getStatusStats = () => {
    const stats = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    }, {})
    
    return {
      confirmed: stats.confirmed || 0,
      pending: stats.pending || 0,
      checkedIn: stats['checked-in'] || 0,
      cancelled: stats.cancelled || 0
    }
  }

  const statusStats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">Manage all resort bookings and reservations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>
                  Add a new reservation to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Guest Name</Label>
                    <Input id="guestName" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+2547852595158" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(room => (
                        <SelectItem key={room.id} value={room.name}>
                          {room.name} - KSH {room.price.toLocaleString()}/night
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input id="checkIn" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input id="checkOut" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea id="specialRequests" placeholder="Any special requirements..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(false)}>
                    Create Booking
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Confirmed Bookings"
          value={statusStats.confirmed}
          icon={CheckCircle}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Pending Bookings"
          value={statusStats.pending}
          icon={Clock}
          className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
        />
        <StatCard
          title="Checked-in Guests"
          value={statusStats.checkedIn}
          icon={CheckCircle}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Cancelled Bookings"
          value={statusStats.cancelled}
          icon={XCircle}
          className="border-red-200 bg-red-50 dark:bg-red-950"
        />
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
              onClick={() => handleStatusChange('BK002', 'confirmed')}
            >
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Confirm Pending</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Check-in guest')}
            >
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <span>Check-in Guest</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Send reminder')}
            >
              <Clock className="h-6 w-6 text-orange-600" />
              <span>Send Reminder</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => console.log('Generate report')}
            >
              <Download className="h-6 w-6 text-purple-600" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <DataTable
        title="All Bookings"
        data={bookings}
        columns={bookingColumns}
        searchable={true}
        filterable={true}
        onView={handleViewBooking}
        onEdit={handleEditBooking}
        onDelete={handleDeleteBooking}
      />

      {/* View Booking Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking {selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Guest Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedBooking.guestName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.phone}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className="ml-2" variant={
                        selectedBooking.status === 'confirmed' ? 'default' :
                        selectedBooking.status === 'pending' ? 'secondary' :
                        selectedBooking.status === 'checked-in' ? 'default' : 'destructive'
                      }>
                        {selectedBooking.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Booking Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Room Type:</span> {selectedBooking.roomType}</p>
                    <p><span className="font-medium">Check-in:</span> {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                    <p><span className="font-medium">Check-out:</span> {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                    <p><span className="font-medium">Amount:</span> KSH {selectedBooking.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleEditBooking(selectedBooking)
                  setIsViewModalOpen(false)
                }}>
                  Edit Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingsModule

