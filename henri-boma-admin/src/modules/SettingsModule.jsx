import { useState } from 'react'
import { Save, Upload, Bell, Shield, Globe, Palette, Database, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Switch } from '@/components/ui/switch'

const SettingsModule = () => {
  const [settings, setSettings] = useState({
    general: {
      resortName: 'Henri Boma Resort & Cultural Heritage',
      description: 'A premier destination combining luxury accommodation with rich cultural experiences',
      address: 'Nairobi, Kenya',
      phone: '+254 785259515',
      email: 'henriresort@gmail.com',
      website: 'https://thehenriboma.com',
      timezone: 'Africa/Nairobi',
      currency: 'KSH',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      bookingAlerts: true,
      paymentAlerts: true,
      systemAlerts: true,
      marketingEmails: false
    },
    booking: {
      maxAdvanceBooking: 365,
      minAdvanceBooking: 1,
      cancellationPolicy: '24 hours',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      autoConfirmBookings: false,
      requireDeposit: true,
      depositPercentage: 30
    },
    payment: {
      mpesaEnabled: true,
      mpesaShortcode: '174379',
      stripeEnabled: false,
      stripePublishableKey: '',
      paypalEnabled: false,
      cashPayments: true,
      cardPayments: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'noreply@henriboma.com',
      smtpPassword: '',
      fromName: 'Henri Boma Resort',
      fromEmail: 'noreply@henriboma.com'
    }
  })

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings[section])
    // Here you would typically send the data to your backend
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure resort settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Resort Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resortName">Resort Name</Label>
                  <Input 
                    id="resortName"
                    value={settings.general.resortName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, resortName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    value={settings.general.website}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, website: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, description: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={settings.general.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, address: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.general.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KSH">KSH - Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.general.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('general')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Resort Logo</Label>
                <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your logo here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: PNG or SVG, max 2MB
                  </p>
                </div>
              </div>
              
              <div>
                <Label>Favicon</Label>
                <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload favicon (32x32 px)
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxAdvanceBooking">Maximum Advance Booking (days)</Label>
                  <Input 
                    id="maxAdvanceBooking"
                    type="number"
                    value={settings.booking.maxAdvanceBooking}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, maxAdvanceBooking: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="minAdvanceBooking">Minimum Advance Booking (days)</Label>
                  <Input 
                    id="minAdvanceBooking"
                    type="number"
                    value={settings.booking.minAdvanceBooking}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, minAdvanceBooking: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInTime">Check-in Time</Label>
                  <Input 
                    id="checkInTime"
                    type="time"
                    value={settings.booking.checkInTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, checkInTime: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOutTime">Check-out Time</Label>
                  <Input 
                    id="checkOutTime"
                    type="time"
                    value={settings.booking.checkOutTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, checkOutTime: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Select value={settings.booking.cancellationPolicy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24 hours">24 hours before check-in</SelectItem>
                    <SelectItem value="48 hours">48 hours before check-in</SelectItem>
                    <SelectItem value="72 hours">72 hours before check-in</SelectItem>
                    <SelectItem value="1 week">1 week before check-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-confirm Bookings</p>
                    <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
                  </div>
                  <Switch 
                    checked={settings.booking.autoConfirmBookings}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, autoConfirmBookings: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Deposit</p>
                    <p className="text-sm text-muted-foreground">Require deposit for bookings</p>
                  </div>
                  <Switch 
                    checked={settings.booking.requireDeposit}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      booking: { ...settings.booking, requireDeposit: checked }
                    })}
                  />
                </div>

                {settings.booking.requireDeposit && (
                  <div>
                    <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                    <Input 
                      id="depositPercentage"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.booking.depositPercentage}
                      onChange={(e) => setSettings({
                        ...settings,
                        booking: { ...settings.booking, depositPercentage: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('booking')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* M-Pesa Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">M-Pesa Integration</p>
                    <p className="text-sm text-muted-foreground">Enable M-Pesa payments</p>
                  </div>
                  <Switch 
                    checked={settings.payment.mpesaEnabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, mpesaEnabled: checked }
                    })}
                  />
                </div>
                
                {settings.payment.mpesaEnabled && (
                  <div>
                    <Label htmlFor="mpesaShortcode">M-Pesa Shortcode</Label>
                    <Input 
                      id="mpesaShortcode"
                      value={settings.payment.mpesaShortcode}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, mpesaShortcode: e.target.value }
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Stripe Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stripe Integration</p>
                    <p className="text-sm text-muted-foreground">Enable international card payments</p>
                  </div>
                  <Switch 
                    checked={settings.payment.stripeEnabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, stripeEnabled: checked }
                    })}
                  />
                </div>
                
                {settings.payment.stripeEnabled && (
                  <div>
                    <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                    <Input 
                      id="stripeKey"
                      type="password"
                      value={settings.payment.stripePublishableKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, stripePublishableKey: e.target.value }
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Other Payment Methods */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cash Payments</p>
                    <p className="text-sm text-muted-foreground">Accept cash payments at the resort</p>
                  </div>
                  <Switch 
                    checked={settings.payment.cashPayments}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, cashPayments: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Card Payments</p>
                    <p className="text-sm text-muted-foreground">Accept card payments at the resort</p>
                  </div>
                  <Switch 
                    checked={settings.payment.cardPayments}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, cardPayments: checked }
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('payment')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of new bookings</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.bookingAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, bookingAlerts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of payment transactions</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.paymentAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, paymentAlerts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of system issues</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, systemAlerts: checked }
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('notifications')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input 
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input 
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUsername: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPassword: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input 
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input 
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, fromEmail: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  Test Connection
                </Button>
                <Button onClick={() => handleSave('email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-muted-foreground">Email alerts for new logins</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout"
                    type="number"
                    defaultValue="30"
                    min="5"
                    max="480"
                  />
                </div>

                <div>
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('security')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Backups</p>
                  <p className="text-sm text-muted-foreground">Daily automated database backups</p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div>
                <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                <Input 
                  id="backupRetention"
                  type="number"
                  defaultValue="30"
                  min="7"
                  max="365"
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  Create Backup Now
                </Button>
                <Button variant="outline">
                  Download Latest Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsModule

