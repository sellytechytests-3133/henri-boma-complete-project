import { useState } from 'react'
import { CreditCard, TrendingUp, AlertCircle, CheckCircle, DollarSign, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import { paymentsData } from '../data/mockData'

const PaymentsModule = () => {
  const [payments] = useState(paymentsData.recentPayments)

  const paymentColumns = [
    { key: 'id', label: 'Payment ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { 
      key: 'method', 
      label: 'Method', 
      render: (method) => (
        <div className="flex items-center space-x-2">
          {method === 'M-Pesa' ? (
            <Smartphone className="h-4 w-4 text-green-600" />
          ) : (
            <CreditCard className="h-4 w-4 text-blue-600" />
          )}
          <span>{method}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeVariants: {
        'completed': 'default',
        'pending': 'secondary',
        'failed': 'destructive'
      }
    },
    { key: 'reference', label: 'Reference', sortable: false },
    { key: 'timestamp', label: 'Date', type: 'date', sortable: true }
  ]

  // Mock data for charts
  const dailyRevenue = [
    { date: '2025-08-14', revenue: 180000, transactions: 12 },
    { date: '2025-08-15', revenue: 210000, transactions: 15 },
    { date: '2025-08-16', revenue: 160000, transactions: 8 },
    { date: '2025-08-17', revenue: 240000, transactions: 18 },
    { date: '2025-08-18', revenue: 280000, transactions: 22 },
    { date: '2025-08-19', revenue: 220000, transactions: 16 },
    { date: '2025-08-20', revenue: 195000, transactions: 14 }
  ]

  const paymentMethods = [
    { name: 'M-Pesa', value: 65, amount: 1592500 },
    { name: 'Cash', value: 25, amount: 612500 },
    { name: 'Card', value: 10, amount: 245000 }
  ]

  const monthlyComparison = [
    { month: 'Jun', thisYear: 2800000, lastYear: 2400000 },
    { month: 'Jul', thisYear: 3100000, lastYear: 2600000 },
    { month: 'Aug', thisYear: 2450000, lastYear: 2200000 }
  ]

  const COLORS = ['#4BA3C3', '#7B4B3A', '#60A5FA', '#F59E0B']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments Dashboard</h1>
          <p className="text-muted-foreground">Monitor revenue, transactions, and payment methods</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={paymentsData.summary.totalRevenue}
          icon={DollarSign}
          currency={true}
          trend="up"
          trendValue={12}
          className="border-green-200 bg-green-50 dark:bg-green-950"
        />
        <StatCard
          title="Pending Payments"
          value={paymentsData.summary.pendingPayments}
          icon={AlertCircle}
          currency={true}
          className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
        />
        <StatCard
          title="Failed Payments"
          value={paymentsData.summary.failedPayments}
          icon={AlertCircle}
          currency={true}
          className="border-red-200 bg-red-50 dark:bg-red-950"
        />
        <StatCard
          title="Success Rate"
          value={`${paymentsData.summary.successRate}%`}
          icon={CheckCircle}
          trend="up"
          trendValue={2.1}
          className="border-blue-200 bg-blue-50 dark:bg-blue-950"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Daily Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4BA3C3" 
                    strokeWidth={2}
                    dot={{ fill: '#4BA3C3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((method, index) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{method.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    KSH {method.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Monthly Revenue Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`KSH ${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="thisYear" fill="#4BA3C3" name="2025" />
                <Bar dataKey="lastYear" fill="#7B4B3A" name="2024" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              M-Pesa Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Shortcode</span>
              <span className="font-mono">174379</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Today's Transactions</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Success Rate</span>
              <span className="font-semibold text-green-600">97.8%</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Daily Limit Usage</span>
                <span>KSH 1.59M / 2M</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '79.5%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Stripe Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant="secondary">
                Inactive
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <span className="font-mono">Test Mode</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Today's Transactions</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Success Rate</span>
              <span className="font-semibold text-muted-foreground">N/A</span>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Configure Stripe to accept international card payments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments Table */}
      <DataTable
        title="Recent Payments"
        data={payments}
        columns={paymentColumns}
        searchable={true}
        filterable={true}
        onView={(payment) => console.log('View payment:', payment)}
        onEdit={(payment) => console.log('Process refund:', payment)}
        onDelete={(payment) => console.log('Void payment:', payment)}
      />

      {/* Quick Actions */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Payment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 text-left rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Process Refund</p>
                  <p className="text-sm text-muted-foreground">Refund a payment</p>
                </div>
              </div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Reconcile Payments</p>
                  <p className="text-sm text-muted-foreground">Match transactions</p>
                </div>
              </div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Generate Report</p>
                  <p className="text-sm text-muted-foreground">Financial reports</p>
                </div>
              </div>
            </button>
            <button className="p-4 text-left rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Gateway Settings</p>
                  <p className="text-sm text-muted-foreground">Configure payments</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsModule

