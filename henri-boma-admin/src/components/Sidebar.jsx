import { useState } from 'react'
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  UtensilsCrossed, 
  Ticket, 
  PartyPopper, 
  ImageIcon, 
  CreditCard, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Hotel
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Sidebar = ({ activeModule, setActiveModule, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'menu-orders', label: 'Menu & Orders', icon: UtensilsCrossed },
    { id: 'day-passes', label: 'Day Passes', icon: Ticket },
    { id: 'events', label: 'Events', icon: PartyPopper },
    { id: 'content', label: 'Content', icon: ImageIcon },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className={`admin-sidebar bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Hotel className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-sidebar-foreground">Henri Boma</h1>
                <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`admin-nav-item w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium transition-colors ${
                isActive 
                  ? 'admin-nav-item active' 
                  : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            © 2025 Henri Boma Resort
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar

