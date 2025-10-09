import { useState } from 'react'
import { TrendingUp, Users, Calendar, DollarSign, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatCard from '../components/StatCard'
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
  Cell,
  AreaChart,
  Area
} from 'recharts'

const AnalyticsModule = () => {
  const [dateRange, setDateRange] = useState('30d')

  // Mock analytics data
  const overviewStats = {
    totalRevenue: 4250000,
    totalBookings: 156,
    averageStay: 3.2,
    occupancyRate: 78,
    dayPassVisitors: 342,
    foodOrders: 89
  }

  const revenueBySource = [
    { source: 'Accommodation', amount: 2850000, percentage: 67 },
    { source: 'Food & Beverage', amount: 680000, percentage: 16 },
    { source: 'Day Passes', amount: 425000, percentage: 10 },
    { source: 'Events', amount: 295000, percentage: 7 }
  ]

  const monthlyTrends = [
    { month: 'Jan', revenue: 3200000, bookings: 120, visitors: 280 },
    { month: 'Feb', revenue: 3800000, bookings: 145, visitors: 320 },
    { month: 'Mar', revenue: 4100000, bookings: 160, visitors: 380 },
    { month: 'Apr', revenue: 3900000, bookings: 155, visitors: 350 },
    { month: 'May', revenue: 4300000, bookings: 170, visitors: 420 },
    { month: 'Jun', revenue: 4600000, bookings: 185, visitors: 450 },
    { month: 'Jul', revenue: 4800000, bookings: 195, visitors: 480 },
    { month: 'Aug', revenue: 4250000, bookings: 156, visitors: 342 }
  ]

  const customerSegments = [
    { segment: 'Leisure Travelers', count: 89, percentage: 57 },
    { segment: 'Business Travelers', count: 34, percentage: 22 },
    { segment: 'Event Attendees', count: 23, percentage: 15 },
    { segment: 'Day Visitors', count: 10, percentage: 6 }
  ]

  const roomTypePerformance = [
    { type: 'Deluxe Garden View', bookings: 45, revenue: 1350000, avgRate: 30000 },
    { type: 'Heritage Suite', bookings: 28, revenue: 1120000, avgRate: 40000 },
    { type: 'Family Villa', bookings: 15, revenue: 900000, avgRate: 60000 },
    { type: 'Presidential Suite', bookings: 8, revenue: 480000, avgRate: 60000 }
  ]

  const dailyOccupancy = [
    { date: '2025-08-14', occupancy: 72 },
    { date: '2025-08-15', occupancy: 85 },
    { date: '2025-08-16', occupancy: 68 },
    { date: '2025-08-17', occupancy: 92 },
    { date: '2025-08-18', occupancy: 78 },
    { date: '2025-08-19', occupancy: 81 },
    { date: '2025-08-20', occupancy: 75 }
  ]

  const COLORS = ['#4BA3C3', '#7B4B3A', '#60A5FA', '#F59E0B', '#10B981']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard
          title="Total Revenue"
          value={overviewStats.totalRevenue}
          icon={DollarSign}
          currency={true}
          trend="up"
          trendValue={8.2}
        />
        <StatCard
          title="Total Bookings"
          value={overviewStats.totalBookings}
          icon={Calendar}
          trend="up"
          trendValue={12.5}
        />
        <StatCard
          title="Avg Stay (Days)"
          value={overviewStats.averageStay}
          icon={Users}
          trend="up"
          trendValue={5.1}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${overviewStats.occupancyRate}%`}
          icon={TrendingUp}
          trend="up"
          trendValue={3.2}
        />
        <StatCard
          title="Day Visitors"
          value={overviewStats.dayPassVisitors}
          icon={Eye}
          trend="down"
          trendValue={2.1}
        />
        <StatCard
          title="Food Orders"
          value={overviewStats.foodOrders}
          icon={Users}
          trend="up"
          trendValue={15.3}
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Trends</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4BA3C3" 
                        fill="#4BA3C3"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Source */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue by Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percentage }) => `${source}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {revenueBySource.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm">{source.source}</span>
                      </div>
                      <span className="text-sm font-medium">
                        KSH {source.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Type Performance */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Room Type Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roomTypePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#4BA3C3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Occupancy */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Daily Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyOccupancy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                      <Line 
                        type="monotone" 
                        dataKey="occupancy" 
                        stroke="#4BA3C3" 
                        strokeWidth={2}
                        dot={{ fill: '#4BA3C3' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Bookings */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Monthly Bookings & Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#4BA3C3" name="Bookings" />
                      <Bar dataKey="visitors" fill="#7B4B3A" name="Day Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segments */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <span className="text-sm text-muted-foreground">
                          {segment.count} ({segment.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${segment.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Customer Satisfaction Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">5 Stars</span>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">4 Stars</span>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3 Stars</span>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2 Stars</span>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '1%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">1%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">1 Star</span>
                    <div className="flex items-center space-x-2 flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '1%' }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">KSH 27,244</div>
                  <div className="text-sm text-muted-foreground">Average Daily Rate</div>
                  <div className="text-xs text-green-600 mt-1">+5.2% vs last month</div>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">KSH 21,250</div>
                  <div className="text-sm text-muted-foreground">Revenue per Room</div>
                  <div className="text-xs text-green-600 mt-1">+8.1% vs last month</div>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <div className="text-sm text-muted-foreground">Customer Retention</div>
                  <div className="text-xs text-green-600 mt-1">+2.3% vs last month</div>
                </div>
              </CardContent>
            </Card>
            <Card className="admin-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3.2</div>
                  <div className="text-sm text-muted-foreground">Average Length of Stay</div>
                  <div className="text-xs text-green-600 mt-1">+0.3 days vs last month</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Top Performing Areas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm font-semibold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm">Occupancy Rate</span>
                      <span className="text-sm font-semibold text-green-600">Above Target</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Areas for Improvement</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <span className="text-sm">Day Pass Utilization</span>
                      <span className="text-sm font-semibold text-yellow-600">Below Target</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <span className="text-sm">Food Service Speed</span>
                      <span className="text-sm font-semibold text-yellow-600">Needs Attention</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <span className="text-sm">Marketing Conversion</span>
                      <span className="text-sm font-semibold text-yellow-600">Room for Growth</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsModule

