import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { clsx } from 'clsx'

export function Layout() {
  const { sidebarCollapsed, mobileSidebarOpen } = React.useContext(
    require('../context/AppContext').AppContext
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div 
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'
        )}
      >
        <Header />
        
        <main 
          className="flex-1 p-6 lg:p-8 pt-20 lg:pt-24 overflow-x-hidden"
          role="main"
          id="main-content"
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}