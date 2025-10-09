import { useState } from 'react'
import { Plus, Edit, Trash2, Shield, User, Users, Crown, Eye, EyeOff } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const UsersModule = () => {
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 'ADM001',
      name: 'John Kamau',
      email: 'john.kamau@henriboma.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2025-08-20T08:30:00Z',
      permissions: ['all']
    },
    {
      id: 'ADM002',
      name: 'Sarah Wanjiku',
      email: 'sarah.wanjiku@henriboma.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2025-08-20T07:15:00Z',
      permissions: ['bookings', 'rooms', 'menu', 'events']
    },
    {
      id: 'ADM003',
      name: 'Peter Kiprotich',
      email: 'peter.kiprotich@henriboma.com',
      role: 'Staff',
      status: 'active',
      lastLogin: '2025-08-19T16:45:00Z',
      permissions: ['bookings', 'menu']
    },
    {
      id: 'ADM004',
      name: 'Grace Achieng',
      email: 'grace.achieng@henriboma.com',
      role: 'Staff',
      status: 'inactive',
      lastLogin: '2025-08-15T12:20:00Z',
      permissions: ['events', 'content']
    }
  ])

  const [customers, setCustomers] = useState([
    {
      id: 'CUST001',
      name: 'Michael Johnson',
      email: 'michael.j@email.com',
      phone: '+2547852595158',
      totalBookings: 5,
      totalSpent: 285000,
      lastVisit: '2025-08-15',
      status: 'VIP',
      joinDate: '2024-03-15'
    },
    {
      id: 'CUST002',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+254723456789',
      totalBookings: 2,
      totalSpent: 95000,
      lastVisit: '2025-07-22',
      status: 'Regular',
      joinDate: '2024-11-08'
    },
    {
      id: 'CUST003',
      name: 'David Mwangi',
      email: 'david.mwangi@email.com',
      phone: '+254734567890',
      totalBookings: 8,
      totalSpent: 420000,
      lastVisit: '2025-08-18',
      status: 'VIP',
      joinDate: '2023-09-12'
    }
  ])

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const adminColumns = [
    { key: 'id', label: 'User ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      type: 'badge',
      badgeVariants: {
        'Super Admin': 'destructive',
        'Manager': 'default',
        'Staff': 'secondary'
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'active': 'default',
        'inactive': 'secondary'
      }
    },
    { key: 'lastLogin', label: 'Last Login', type: 'date', sortable: true }
  ]

  const customerColumns = [
    { key: 'id', label: 'Customer ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'totalBookings', label: 'Bookings', sortable: true },
    { key: 'totalSpent', label: 'Total Spent', type: 'currency', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'VIP': 'default',
        'Regular': 'secondary'
      }
    },
    { key: 'lastVisit', label: 'Last Visit', type: 'date', sortable: true }
  ]

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      if (user.email) {
        setAdminUsers(adminUsers.filter(u => u.id !== user.id))
      } else {
        setCustomers(customers.filter(u => u.id !== user.id))
      }
    }
  }

  const getAdminStats = () => {
    return {
      totalAdmins: adminUsers.length,
      activeAdmins: adminUsers.filter(u => u.status === 'active').length,
      totalCustomers: customers.length,
      vipCustomers: customers.filter(c => c.status === 'VIP').length
    }
  }

  const stats = getAdminStats()

  const AdminForm = ({ user, onClose, onSave }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="userName">Full Name</Label>
          <Input 
            id="userName" 
            defaultValue={user?.name || ''} 
            placeholder="John Kamau" 
          />
        </div>
        <div>
          <Label htmlFor="userEmail">Email</Label>
          <Input 
            id="userEmail" 
            type="email"
            defaultValue={user?.email || ''} 
            placeholder="john.kamau@henriboma.com" 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="userRole">Role</Label>
          <Select defaultValue={user?.role || 'Staff'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="userStatus">Status</Label>
          <Select defaultValue={user?.status || 'active'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!user && (
        <div>
          <Label htmlFor="userPassword">Password</Label>
          <Input 
            id="userPassword" 
            type="password"
            placeholder="Enter secure password" 
          />
        </div>
      )}
      <div>
        <Label className="text-base font-medium">Permissions</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['bookings', 'rooms', 'menu', 'events', 'content', 'payments', 'analytics', 'users'].map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Switch 
                id={permission}
                defaultChecked={user?.permissions?.includes(permission) || user?.permissions?.includes('all')}
              />
              <Label htmlFor={permission} className="capitalize">{permission}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          onSave()
          onClose()
        }}>
          {user ? 'Update' : 'Create'} User
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage admin users and customer accounts</p>
        </div>
        <Dialog open={isAddAdminModalOpen} onOpenChange={setIsAddAdminModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>
                Create a new admin user account with specific permissions
              </DialogDescription>
            </DialogHeader>
            <AdminForm 
              onClose={() => setIsAddAdminModalOpen(false)}
              onSave={() => console.log('Save new admin user')}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Admin Users"
          value={stats.totalAdmins}
          icon={Shield}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Active Admins"
          value={stats.activeAdmins}
          icon={User}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          className="border-purple-200 bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          title="VIP Customers"
          value={stats.vipCustomers}
          icon={Crown}
          className="border-orange-200 bg-orange-50 dark:bg-orange-950"
        />
      </div>

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-6">
          {/* Admin Users Table */}
          <DataTable
            title="Admin Users"
            data={adminUsers}
            columns={adminColumns}
            searchable={true}
            filterable={true}
            onView={(user) => console.log('View user:', user)}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />

          {/* Role Distribution */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Crown className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {adminUsers.filter(u => u.role === 'Super Admin').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Super Admins</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {adminUsers.filter(u => u.role === 'Manager').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Managers</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {adminUsers.filter(u => u.role === 'Staff').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    KSH {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Customer Value</p>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Customer Value</p>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {(customers.reduce((sum, c) => sum + c.totalBookings, 0) / customers.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Bookings per Customer</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customers Table */}
          <DataTable
            title="Customer Accounts"
            data={customers}
            columns={customerColumns}
            searchable={true}
            filterable={true}
            onView={(customer) => console.log('View customer:', customer)}
            onEdit={(customer) => console.log('Edit customer:', customer)}
            onDelete={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage what each role can access in the admin dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Module</th>
                      <th className="text-center p-3">Super Admin</th>
                      <th className="text-center p-3">Manager</th>
                      <th className="text-center p-3">Staff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { module: 'Dashboard', superAdmin: true, manager: true, staff: true },
                      { module: 'Bookings', superAdmin: true, manager: true, staff: true },
                      { module: 'Rooms', superAdmin: true, manager: true, staff: false },
                      { module: 'Menu & Orders', superAdmin: true, manager: true, staff: true },
                      { module: 'Day Passes', superAdmin: true, manager: true, staff: true },
                      { module: 'Events', superAdmin: true, manager: true, staff: false },
                      { module: 'Content', superAdmin: true, manager: true, staff: false },
                      { module: 'Payments', superAdmin: true, manager: true, staff: false },
                      { module: 'Analytics', superAdmin: true, manager: true, staff: false },
                      { module: 'Users', superAdmin: true, manager: false, staff: false },
                      { module: 'Settings', superAdmin: true, manager: false, staff: false }
                    ].map((row) => (
                      <tr key={row.module} className="border-b">
                        <td className="p-3 font-medium">{row.module}</td>
                        <td className="text-center p-3">
                          {row.superAdmin ? (
                            <Eye className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {row.manager ? (
                            <Eye className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {row.staff ? (
                            <Eye className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">All admin users must use 2FA</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password Expiry</p>
                  <p className="text-sm text-muted-foreground">Force password change every 90 days</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Login Notifications</p>
                  <p className="text-sm text-muted-foreground">Email notifications for new logins</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <AdminForm 
            user={selectedUser}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => console.log('Save user changes')}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersModule

