import { 
  Calendar, 
  DollarSign, 
  Users, 
  ShoppingCart,
  TrendingUp,
  Bed
} from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { dashboardStats, recentBookings, chartData } from '../data/mockData'

const DashboardModule = () => {
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
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true }
  ]

  const COLORS = ['#4BA3C3', '#7B4B3A', '#60A5FA', '#F59E0B']

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-white/90">
          Here's what's happening at Henri Boma Resort today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={dashboardStats.totalBookings}
          icon={Calendar}
          trend="up"
          trendValue={12}
        />
        <StatCard
          title="Total Revenue"
          value={dashboardStats.totalRevenue}
          icon={DollarSign}
          currency={true}
          trend="up"
          trendValue={8}
        />
        <StatCard
          title="Active Guests"
          value={dashboardStats.activeGuests}
          icon={Users}
          trend="up"
          trendValue={5}
        />
        <StatCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders}
          icon={ShoppingCart}
          trend="down"
          trendValue={3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings Chart */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Daily Bookings Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#4BA3C3" 
                    strokeWidth={2}
                    dot={{ fill: '#4BA3C3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4BA3C3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Occupancy and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Occupancy */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              Room Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.roomOccupancy}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="occupancy"
                  >
                    {chartData.roomOccupancy.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="admin-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dashboardStats.dayPassVisitors}</p>
                  <p className="text-sm text-muted-foreground">Day Pass Visitors</p>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{dashboardStats.occupancyRate}%</p>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 text-left rounded-lg border hover:bg-muted transition-colors">
                  <p className="font-medium">New Booking</p>
                  <p className="text-sm text-muted-foreground">Add a new reservation</p>
                </button>
                <button className="p-3 text-left rounded-lg border hover:bg-muted transition-colors">
                  <p className="font-medium">Check-in Guest</p>
                  <p className="text-sm text-muted-foreground">Process guest arrival</p>
                </button>
                <button className="p-3 text-left rounded-lg border hover:bg-muted transition-colors">
                  <p className="font-medium">Add Menu Item</p>
                  <p className="text-sm text-muted-foreground">Update restaurant menu</p>
                </button>
                <button className="p-3 text-left rounded-lg border hover:bg-muted transition-colors">
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">Generate analytics</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <DataTable
        title="Recent Bookings"
        data={recentBookings}
        columns={bookingColumns}
        itemsPerPage={5}
        onView={(booking) => console.log('View booking:', booking)}
        onEdit={(booking) => console.log('Edit booking:', booking)}
        onDelete={(booking) => console.log('Delete booking:', booking)}
      />
    </div>
  )
}

export default DashboardModule

