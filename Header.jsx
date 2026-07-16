import React, { useRef, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Moon, 
  Sun,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Shield,
  X
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useDropdown, useClickOutside } from '../hooks'

export function Header() {
  const { 
    user, 
    notifications, 
    unreadNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    sidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen 
  } = useApp()
  const location = useLocation()

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  // Notification dropdown
  const notificationDropdown = useDropdown()

  // User menu dropdown
  const userDropdown = useDropdown()

  // Close dropdowns on route change
  useEffect(() => {
    notificationDropdown.close()
    userDropdown.close()
    setSearchOpen(false)
  }, [location.pathname])

  // Handle notification click
  const handleNotificationClick = (id) => {
    markNotificationRead(id)
    // Navigate to relevant page based on notification
    // For now just close dropdown
    notificationDropdown.close()
  }

  // Clear all notifications
  const handleClearAll = () => {
    markAllNotificationsRead()
    notificationDropdown.close()
  }

  // Search results (mock)
  const searchResults = [
    { path: '/tax-returns', label: '2026 Tax Return', description: 'In Progress - 45% complete' },
    { path: '/documents', label: 'W-2 Documents', description: 'View all W-2 uploads' },
    { path: '/documents', label: '1099-NEC Upload', description: 'Missing document - action required' },
    { path: '/messages', label: 'Message from James Anderson', description: 'Advisor message about 2026 return' },
    { path: '/settings/profile', label: 'Profile Settings', description: 'Update personal information' },
    { path: '/settings/security', label: 'Two-Factor Authentication', description: 'Enable 2FA for security' },
  ].filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header 
      className={clsx(
        'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-sticky flex items-center transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[280px]'
      )}
      role="banner"
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 -ml-2 mr-2 text-navy-600 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={mobileSidebarOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search */}
      <div className={clsx('relative flex-1 max-w-md mx-4', searchOpen && 'max-w-xl')}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder="Search returns, documents, messages..."
            className={clsx(
              'w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg',
              'focus:bg-white focus:border-navy-500 focus:shadow-[0_0_0_3px_rgba(11,31,51,0.1)]',
              'transition-all duration-200',
              searchOpen && 'shadow-lg'
            )}
            aria-label="Search"
            aria-expanded={searchOpen && searchResults.length > 0}
            aria-controls="search-results"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {searchOpen && searchQuery && searchResults.length > 0 && (
          <div 
            id="search-results"
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slide-in-top"
            role="listbox"
          >
            {searchResults.map((result, index) => (
              <NavLink
                key={result.path}
                to={result.path}
                onClick={() => setSearchOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                role="option"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-navy-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-900 truncate">{result.label}</p>
                  <p className="text-xs text-gray-500 truncate">{result.description}</p>
                </div>
              </NavLink>
            ))}
            {searchResults.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 px-4">
        {/* Notifications */}
        <div className="relative">
          <button
            ref={notificationDropdown.triggerRef}
            onClick={() => notificationDropdown.toggle(notificationDropdown.triggerRef.current)}
            className={clsx(
              'relative flex items-center justify-center w-10 h-10 rounded-lg text-navy-500 hover:text-navy-900 hover:bg-gray-100 transition-colors',
              notificationDropdown.isOpen && 'bg-gray-100 text-navy-900'
            )}
            aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : 'Notifications'}
            aria-expanded={notificationDropdown.isOpen}
            aria-haspopup="true"
          >
            <Bell size={20} aria-hidden="true" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 flex items-center justify-center text-xs font-bold bg-gold-500 text-navy-900 rounded-full">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>

          <div
            ref={notificationDropdown.dropdownRef}
            className="dropdown-menu w-80"
            role="menu"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-navy-900">Notifications</h3>
              {unreadNotifications > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-navy-600 hover:text-navy-900 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">No notifications</div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={clsx(
                      'w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors',
                      !notification.read && 'bg-gray-50'
                    )}
                    role="menuitem"
                  >
                    <div className="flex items-start gap-3">
                      <div className={clsx(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        notification.type === 'success' && 'bg-success-light text-success',
                        notification.type === 'error' && 'bg-error-light text-error',
                        notification.type === 'warning' && 'bg-warning-light text-warning',
                        notification.type === 'info' && 'bg-info-light text-info',
                      )}>
                        {notification.type === 'success' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
                        {notification.type === 'error' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                        {notification.type === 'warning' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                        {notification.type === 'info' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={clsx('text-sm font-medium', !notification.read ? 'text-navy-900' : 'text-gray-700')}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="px-3 py-2 border-t border-gray-200">
              <NavLink
                to="/settings/notifications"
                onClick={() => notificationDropdown.close()}
                className="block text-center text-sm text-navy-600 hover:text-navy-900 font-medium"
              >
                View all notifications
              </NavLink>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            ref={userDropdown.triggerRef}
            onClick={() => userDropdown.toggle(userDropdown.triggerRef.current)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              userDropdown.isOpen && 'bg-gray-100'
            )}
            aria-label="User menu"
            aria-expanded={userDropdown.isOpen}
            aria-haspopup="true"
          >
            <div className="avatar avatar-sm bg-navy-100 text-navy-700">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="hidden sm:block text-sm font-medium text-navy-700">{user.name}</span>
            <ChevronDown size={16} className={clsx('text-gray-400 transition-transform', userDropdown.isOpen && 'rotate-180')} />
          </button>

          <div
            ref={userDropdown.dropdownRef}
            className="dropdown-menu w-56"
            role="menu"
            aria-label="User menu"
          >
            <div className="px-3 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-navy-900">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <NavLink
              to="/settings/profile"
              onClick={() => userDropdown.close()}
              className="dropdown-item"
              role="menuitem"
            >
              <User size={16} className="dropdown-item-icon" />
              Profile
            </NavLink>
            <NavLink
              to="/settings/security"
              onClick={() => userDropdown.close()}
              className="dropdown-item"
              role="menuitem"
            >
              <Shield size={16} className="dropdown-item-icon" />
              Security
            </NavLink>
            <NavLink
              to="/settings/notifications"
              onClick={() => userDropdown.close()}
              className="dropdown-item"
              role="menuitem"
            >
              <Bell size={16} className="dropdown-item-icon" />
              Notifications
            </NavLink>
            <div className="dropdown-divider" />
            <NavLink
              to="/help"
              onClick={() => userDropdown.close()}
              className="dropdown-item"
              role="menuitem"
            >
              <HelpCircle size={16} className="dropdown-item-icon" />
              Help Center
            </NavLink>
            <button
              className="dropdown-item text-error"
              role="menuitem"
            >
              <LogOut size={16} className="dropdown-item-icon" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}