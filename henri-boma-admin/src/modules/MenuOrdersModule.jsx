import { useState } from 'react'
import { Plus, Edit, Trash2, Clock, CheckCircle, Truck, Package } from 'lucide-react'
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
import { menuCategories, recentOrders } from '../data/mockData'

const MenuOrdersModule = () => {
  const [categories, setCategories] = useState(menuCategories)
  const [orders, setOrders] = useState(recentOrders)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('appetizers')

  const orderColumns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'customerPhone', label: 'Phone', sortable: false },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'preparing': 'secondary',
        'out-for-delivery': 'default',
        'delivered': 'default',
        'cancelled': 'destructive'
      }
    },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'deliveryAddress', label: 'Delivery Address', sortable: false },
    { key: 'assignedStaff', label: 'Assigned Staff', sortable: true }
  ]

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ))
  }

  const handleDeleteItem = (categoryId, itemId) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { 
            ...category, 
            items: category.items.filter(item => item.id !== itemId) 
          }
        : category
    ))
  }

  const getOrderStats = () => {
    const stats = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      acc.totalRevenue = (acc.totalRevenue || 0) + order.total
      return acc
    }, {})
    
    return {
      preparing: stats.preparing || 0,
      outForDelivery: stats['out-for-delivery'] || 0,
      delivered: stats.delivered || 0,
      totalRevenue: stats.totalRevenue || 0
    }
  }

  const orderStats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu & Order Management</h1>
          <p className="text-muted-foreground">Manage restaurant menu and track food orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddOrderModalOpen} onOpenChange={setIsAddOrderModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Quick Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Quick Order</DialogTitle>
                <DialogDescription>
                  Add a new order manually
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input id="customerName" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input id="customerPhone" placeholder="+2547852595158" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input id="deliveryAddress" placeholder="Room 205 or Poolside Table 3" />
                </div>
                <div>
                  <Label htmlFor="orderItems">Order Items</Label>
                  <Textarea id="orderItems" placeholder="Heritage Spring Rolls x2, Nyama Choma Platter x1..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total">Total Amount (KSH)</Label>
                    <Input id="total" type="number" placeholder="4900" />
                  </div>
                  <div>
                    <Label htmlFor="assignedStaff">Assigned Staff</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peter">Peter Kiprotich</SelectItem>
                        <SelectItem value="jane">Jane Wanjiru</SelectItem>
                        <SelectItem value="david">David Mwangi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddOrderModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddOrderModalOpen(false)}>
                    Create Order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Preparing"
          value={orderStats.preparing}
          icon={Clock}
          className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
        />
        <StatCard
          title="Out for Delivery"
          value={orderStats.outForDelivery}
          icon={Truck}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Delivered Today"
          value={orderStats.delivered}
          icon={CheckCircle}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Today's Revenue"
          value={orderStats.totalRevenue}
          icon={Package}
          currency={true}
          className="border-purple-200 bg-purple-50 dark:bg-purple-950"
        />
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
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
                  onClick={() => handleStatusChange('ORD001', 'out-for-delivery')}
                >
                  <Truck className="h-6 w-6 text-blue-600" />
                  <span>Start Delivery</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleStatusChange('ORD002', 'delivered')}
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Mark Delivered</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Assign staff')}
                >
                  <Package className="h-6 w-6 text-purple-600" />
                  <span>Assign Staff</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => console.log('Print receipts')}
                >
                  <Clock className="h-6 w-6 text-orange-600" />
                  <span>Print Receipts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <DataTable
            title="All Orders"
            data={orders}
            columns={orderColumns}
            searchable={true}
            filterable={true}
            onView={(order) => console.log('View order:', order)}
            onEdit={(order) => console.log('Edit order:', order)}
            onDelete={(order) => console.log('Cancel order:', order)}
          />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <p className="text-muted-foreground">Manage restaurant menu categories and items</p>
            </div>
            <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a new item for the restaurant menu
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input id="itemName" placeholder="Heritage Spring Rolls" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Traditional spring rolls with local vegetables..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KSH)</Label>
                      <Input id="price" type="number" placeholder="1200" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" placeholder="https://media.thehenriboma.com/..." />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" placeholder="vegetarian, local, spicy" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddItemModalOpen(false)}>
                      Add Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map(item => (
                    <Card key={item.id} className="admin-card overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            item.available 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {item.available ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteItem(category.id, item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">
                              KSH {item.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MenuOrdersModule

