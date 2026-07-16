import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Documents } from './pages/Documents'
import { TaxReturns } from './pages/TaxReturns'
import { Messages } from './pages/Messages'
import { Settings } from './pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="documents" element={<Documents />} />
        <Route path="tax-returns" element={<TaxReturns />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="help" element={<div className="card p-8 text-center"><h2 className="text-xl font-semibold mb-2">Help Center</h2><p className="text-gray-500">Coming soon</p></div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}