import { useState } from 'react'
import { Plus, Edit, Trash2, Bed, Users, Wifi, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { roomTypes } from '../data/mockData'

const RoomsModule = () => {
  const [rooms, setRooms] = useState(roomTypes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const amenityIcons = {
    'King Size Bed': Bed,
    'Garden View': Users,
    'Free WiFi': Wifi,
    'Air Conditioning': Car,
    'Mini Bar': Users,
    'Separate Living Area': Users,
    'Cultural Decor': Users,
    'Premium Amenities': Users,
    'Balcony': Users,
    '3 Bedrooms': Bed,
    'Kids Play Area': Users,
    'Kitchen': Users,
    'Private Pool': Users,
    'Panoramic Views': Users,
    'Private Terrace': Users,
    'Jacuzzi': Users,
    'Personal Chef': Users,
    'Complimentary Breakfast': Users,
    'Butler Service': Users
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setIsEditModalOpen(true)
  }

  const handleDeleteRoom = (room) => {
    if (confirm(`Are you sure you want to delete ${room.name}?`)) {
      setRooms(rooms.filter(r => r.id !== room.id))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const RoomForm = ({ room, onClose, onSave }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="roomName">Room Name</Label>
        <Input 
          id="roomName" 
          defaultValue={room?.name || ''} 
          placeholder="Deluxe Garden View" 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          defaultValue={room?.description || ''} 
          placeholder="Spacious room with beautiful garden views..." 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price per Night (KSH)</Label>
          <Input 
            id="price" 
            type="number" 
            defaultValue={room?.price || ''} 
            placeholder="15000" 
          />
        </div>
        <div>
          <Label htmlFor="totalRooms">Total Rooms</Label>
          <Input 
            id="totalRooms" 
            type="number" 
            defaultValue={room?.totalRooms || ''} 
            placeholder="8" 
          />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select defaultValue={room?.status || 'available'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input 
          id="imageUrl" 
          defaultValue={room?.image || ''} 
          placeholder="https://images.unsplash.com/..." 
        />
      </div>
      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Textarea 
          id="amenities" 
          defaultValue={room?.amenities?.join(', ') || ''} 
          placeholder="King Size Bed, Garden View, Free WiFi..." 
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
          {room ? 'Update' : 'Create'} Room
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">Manage room types, availability, and pricing</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room Type</DialogTitle>
              <DialogDescription>
                Create a new room type for the resort
              </DialogDescription>
            </DialogHeader>
            <RoomForm 
              onClose={() => setIsAddModalOpen(false)}
              onSave={() => console.log('Save new room')}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {rooms.reduce((sum, room) => sum + room.totalRooms, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {rooms.reduce((sum, room) => sum + room.availableRooms, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {rooms.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {Math.round((rooms.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0) / 
                  rooms.reduce((sum, room) => sum + room.totalRooms, 0)) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="admin-card overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-2 right-2 ${getStatusColor(room.status)}`}
              >
                {room.status}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditRoom(room)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteRoom(room)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{room.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    KSH {room.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">/night</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Available: {room.availableRooms}/{room.totalRooms}</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(room.availableRooms / room.totalRooms) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Users
                      return (
                        <div 
                          key={index}
                          className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md text-xs"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{amenity}</span>
                        </div>
                      )
                    })}
                    {room.amenities.length > 3 && (
                      <div className="bg-muted px-2 py-1 rounded-md text-xs">
                        +{room.amenities.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room Type</DialogTitle>
            <DialogDescription>
              Update room information and settings
            </DialogDescription>
          </DialogHeader>
          <RoomForm 
            room={selectedRoom}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => console.log('Save room changes')}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoomsModule

