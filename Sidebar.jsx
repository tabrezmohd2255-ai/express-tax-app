import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  LogOut,
  User,
  Shield,
  HelpCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'

const navigation = [
  { path: '/', label: 'Home', icon: Home, exact: true },
  { path: '/documents', label: 'Documents', icon: FolderOpen },
  { path: '/tax-returns', label: 'Tax Returns', icon: FileText },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const bottomNavigation = [
  { path: '/settings/profile', label: 'Profile', icon: User },
  { path: '/settings/security', label: 'Security', icon: Shield },
  { path: '/settings/notifications', label: 'Notifications', icon: Bell },
  { path: '/help', label: 'Help Center', icon: HelpCircle },
]

export function Sidebar() {
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    mobileSidebarOpen, 
    setMobileSidebarOpen,
    unreadNotifications,
    unreadMessages,
    user 
  } = useApp()
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/50 z-fixed animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          'fixed left-0 top-0 h-screen bg-navy-900 border-r border-navy-800 z-sticky flex flex-col transition-all duration-300 ease-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-[280px]',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className={clsx(
          'flex items-center justify-between h-16 px-4 border-b border-navy-800 transition-all duration-300',
          sidebarCollapsed ? 'justify-center' : ''
        )}>
          {!sidebarCollapsed && (
            <a href="/" className="flex items-center gap-3" aria-label="Express Tax Home">
              <img 
                src="/logo.svg" 
                alt="" 
                className="h-8 w-auto" 
                aria-hidden="true"
              />
            </a>
          )}
          <button
            onClick={toggleSidebar}
            className={clsx(
              'flex items-center justify-center w-8 h-8 rounded-lg text-navy-300 hover:text-white hover:bg-navy-800 transition-colors',
              sidebarCollapsed && 'rotate-180'
            )}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto" aria-label="Main navigation">
          <ul className="space-y-1" role="list">
            {navigation.map((item) => {
              const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
              const unreadCount = item.path === '/messages' ? unreadMessages : 0
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={handleNavClick}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive 
                        ? 'bg-navy-800 text-white shadow-sm' 
                        : 'text-navy-200 hover:text-white hover:bg-navy-800',
                      sidebarCollapsed && 'justify-center'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon size={20} aria-hidden="true" className="flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {unreadCount > 0 && !sidebarCollapsed && (
                      <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-semibold bg-gold-500 text-navy-900 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          {!sidebarCollapsed && (
            <div className="my-4 border-t border-navy-800" role="separator" />
          )}

          {/* Bottom Navigation */}
          <ul className="space-y-1" role="list">
            {bottomNavigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === item.path 
                      ? 'bg-navy-800 text-white shadow-sm' 
                      : 'text-navy-200 hover:text-white hover:bg-navy-800',
                    sidebarCollapsed && 'justify-center'
                  )}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} aria-hidden="true" className="flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className={clsx(
          'p-3 border-t border-navy-800 transition-all duration-300',
          sidebarCollapsed ? 'items-center' : ''
        )}>
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="avatar avatar-sm bg-navy-700 text-navy-100">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-navy-300 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="avatar avatar-sm bg-navy-700 text-navy-100">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}