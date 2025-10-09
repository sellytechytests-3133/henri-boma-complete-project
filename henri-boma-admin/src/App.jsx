import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DashboardModule from './modules/DashboardModule'
import BookingsModule from './modules/BookingsModule'
import RoomsModule from './modules/RoomsModule'
import MenuOrdersModule from './modules/MenuOrdersModule'
import DayPassesModule from './modules/DayPassesModule'
import EventsModule from './modules/EventsModule'
import ContentModule from './modules/ContentModule'
import PaymentsModule from './modules/PaymentsModule'
import AnalyticsModule from './modules/AnalyticsModule'
import UsersModule from './modules/UsersModule'
import SettingsModule from './modules/SettingsModule'
import './App.css'

function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />
      case 'bookings':
        return <BookingsModule />
      case 'rooms':
        return <RoomsModule />
      case 'menu-orders':
        return <MenuOrdersModule />
      case 'day-passes':
        return <DayPassesModule />
      case 'events':
        return <EventsModule />
      case 'content':
        return <ContentModule />
      case 'payments':
        return <PaymentsModule />
      case 'analytics':
        return <AnalyticsModule />
      case 'users':
        return <UsersModule />
      case 'settings':
        return <SettingsModule />
      default:
        return <DashboardModule />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar 
          activeModule={activeModule}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 admin-main-content">
          {renderModule()}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

export default App

