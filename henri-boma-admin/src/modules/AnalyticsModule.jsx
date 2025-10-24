import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  ShoppingCart,
  CreditCard,
  Download
} from 'lucide-react'
import api from '@/lib/api'

const AnalyticsModule = () => {
  const [summary, setSummary] = useState(null)
  const [revenueAnalytics, setRevenueAnalytics] = useState(null)
  const [bookingAnalytics, setBookingAnalytics] = useState(null)
  const [userAnalytics, setUserAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('last_30_days')
  const [exporting, setExporting] = useState(false)
  const cacheRef = useRef({})

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      // Return cached data if available for the selected period
      if (cacheRef.current[period]) {
        const cached = cacheRef.current[period]
        setSummary(cached.summary)
        setRevenueAnalytics(cached.revenueAnalytics)
        setBookingAnalytics(cached.bookingAnalytics)
        setUserAnalytics(cached.userAnalytics)
        setLoading(false)
        return
      }

      const [summaryRes, revenueRes, bookingsRes, usersRes] = await Promise.all([
        api.get(`/analytics/summary?period=${period}`),
        api.get(`/analytics/revenue?period=${period}`),
        api.get(`/analytics/bookings?period=${period}`),
        api.get('/analytics/users')
      ])

      setSummary(summaryRes.data.summary)
      setRevenueAnalytics(revenueRes.data.analytics)
      setBookingAnalytics(bookingsRes.data.analytics)
      setUserAnalytics(usersRes.data.analytics)

      // Cache the fetched data for this period
      cacheRef.current[period] = {
        summary: summaryRes.data.summary,
        revenueAnalytics: revenueRes.data.analytics,
        bookingAnalytics: bookingsRes.data.analytics,
        userAnalytics: usersRes.data.analytics
      }
    } catch {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [period])

  const handleExportReport = async () => {
    try {
      setExporting(true)
      const response = await api.get(`/analytics/reports/sales?period=${period}`)
      const reportData = response.data.report
      
      // Convert to CSV
      const csvContent = [
        ['Payment ID', 'Amount', 'Payment Method', 'Reference Type', 'Customer Name', 'Customer Phone', 'Completed At', 'Transaction ID'],
        ...reportData.transactions.map(tx => [
          tx.payment_id,
          tx.amount,
          tx.payment_method,
          tx.reference_type,
          tx.customer_name,
          tx.customer_phone,
          tx.completed_at,
          tx.transaction_id
        ])
      ].map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report-${period}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  // Prepare chart data
  const revenueByDayData = revenueAnalytics?.revenue_by_day ? 
    Object.entries(revenueAnalytics.revenue_by_day).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString(),
      revenue: amount
    })) : []

  const revenueByMethodData = revenueAnalytics?.revenue_by_method ?
    Object.entries(revenueAnalytics.revenue_by_method).map(([method, amount]) => ({
      name: method.toUpperCase(),
      value: amount
    })) : []

  const bookingStatusData = bookingAnalytics?.bookings_by_status ?
    Object.entries(bookingAnalytics.bookings_by_status).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    })) : []

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary.total_bookings}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-xs text-green-600">+{summary.recent_bookings} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">KES {(summary?.total_revenue ?? 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xs text-green-600">{(summary?.payment_success_rate ?? 0)}% success rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary?.total_orders ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xs text-green-600">+{summary?.recent_orders ?? 0} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary?.total_users ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xs text-muted-foreground">{summary?.total_events ?? 0} events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Trend
              <Badge variant="secondary">{period.replace('_', ' ')}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Revenue by Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueByMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Analytics */}
        {userAnalytics && (
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(userAnalytics.users_by_role).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <Badge variant="outline">{role.replace('_', ' ').toUpperCase()}</Badge>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AnalyticsModule