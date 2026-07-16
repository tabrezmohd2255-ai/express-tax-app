import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  // User data (would come from auth in real app)
  const [user] = useState({
    id: 'user_001',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    avatar: null,
    role: 'client',
    businessName: 'Mitchell Creative Studios',
    taxYear: 2026,
    onboardingComplete: true,
  })

  // Tax year selection
  const [selectedTaxYear, setSelectedTaxYear] = useState(2026)
  const availableTaxYears = [2026, 2025, 2024]

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'info', title: 'Welcome to Express Tax', message: 'Your account has been set up. Let\'s get started with your 2026 tax return.', read: false, createdAt: new Date().toISOString() },
    { id: '2', type: 'success', title: 'Document Accepted', message: 'Your W-2 from Acme Corporation has been accepted.', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', type: 'warning', title: 'Action Required', message: 'We need your 1099-NEC from Freelance Projects LLC to proceed.', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ])

  // Documents
  const [documents, setDocuments] = useState([
    { id: 'doc_1', name: 'W-2_Acme_Corp_2026.pdf', category: 'W-2', status: 'accepted', size: 245760, uploadedAt: '2026-01-15T10:30:00Z', taxYear: 2026 },
    { id: 'doc_2', name: '1099-NEC_Freelance_2026.pdf', category: '1099', status: 'reviewing', size: 189432, uploadedAt: '2026-01-20T14:15:00Z', taxYear: 2026 },
    { id: 'doc_3', name: 'Bank_Statement_Chase_Dec2026.pdf', category: 'Bank Statements', status: 'accepted', size: 512000, uploadedAt: '2026-01-10T09:00:00Z', taxYear: 2026 },
    { id: 'doc_4', name: 'Business_Income_Summary_2026.xlsx', category: 'Business Income', status: 'missing', size: 0, uploadedAt: null, taxYear: 2026 },
    { id: 'doc_5', name: 'W-2_Acme_Corp_2025.pdf', category: 'W-2', status: 'accepted', size: 238912, uploadedAt: '2025-01-18T11:00:00Z', taxYear: 2025 },
    { id: 'doc_6', name: '1099-INT_Chase_2025.pdf', category: '1099', status: 'accepted', size: 156288, uploadedAt: '2025-01-22T16:30:00Z', taxYear: 2025 },
  ])

  // Tax Returns
  const [taxReturns, setTaxReturns] = useState([
    { id: 'return_2026', taxYear: 2026, status: 'in_progress', progress: 45, createdAt: '2026-01-05T09:00:00Z', updatedAt: '2026-01-22T14:30:00Z', estimatedRefund: 3250, documentsRequired: 3, documentsSubmitted: 2 },
    { id: 'return_2025', taxYear: 2025, status: 'filed', progress: 100, createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-03-15T16:00:00Z', refund: 2890, filedDate: '2025-03-15', documentsRequired: 5, documentsSubmitted: 5 },
    { id: 'return_2024', taxYear: 2024, status: 'filed', progress: 100, createdAt: '2024-01-12T11:00:00Z', updatedAt: '2024-04-01T12:00:00Z', refund: 1540, filedDate: '2024-04-01', documentsRequired: 4, documentsSubmitted: 4 },
  ])

  // Messages
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      threadId: 'thread_1',
      type: 'advisor',
      advisorName: 'James Anderson, CPA',
      advisorAvatar: null,
      subject: '2026 Tax Return - Document Review',
      preview: 'I\'ve reviewed your W-2 and have a question about...',
      unread: 2,
      updatedAt: '2026-01-22T10:30:00Z',
      messages: [
        { id: 'm1', sender: 'advisor', content: 'Hi Sarah! I\'ve reviewed your W-2 from Acme Corporation and everything looks good.', timestamp: '2026-01-20T09:15:00Z' },
        { id: 'm2', sender: 'client', content: 'Great! Is there anything else you need from me?', timestamp: '2026-01-20T10:30:00Z' },
        { id: 'm3', sender: 'advisor', content: 'Yes, I noticed we\'re still missing your 1099-NEC from Freelance Projects LLC. Could you please upload that?', timestamp: '2026-01-22T10:30:00Z' },
      ]
    },
    {
      id: 'msg_2',
      threadId: 'thread_2',
      type: 'support',
      subject: 'Account Setup Complete',
      preview: 'Your Express Tax account is now fully configured...',
      unread: 0,
      updatedAt: '2026-01-15T14:00:00Z',
      messages: [
        { id: 'm4', sender: 'support', content: 'Welcome to Express Tax! Your account has been set up successfully.', timestamp: '2026-01-15T14:00:00Z' },
        { id: 'm5', sender: 'support', content: 'You can now start your 2026 tax return. Your assigned advisor is James Anderson, CPA.', timestamp: '2026-01-15T14:05:00Z' },
      ]
    },
  ])

  // Settings
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Sarah',
      lastName: 'Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      language: 'en',
    },
    business: {
      name: 'Mitchell Creative Studios',
      ein: '12-3456789',
      entityType: 'LLC',
      address: {
        street: '123 Creative Lane',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
      industry: 'Creative Services',
    },
    personal: {
      ssn: 'XXX-XX-1234',
      dob: '1985-06-15',
      filingStatus: 'single',
      dependents: 0,
      address: {
        street: '456 Oak Street',
        city: 'Austin',
        state: 'TX',
        zip: '78704',
      },
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '2026-01-01',
      sessions: [
        { id: 'sess_1', device: 'Chrome on MacBook Pro', location: 'Austin, TX', current: true, lastActive: '2026-01-22T14:30:00Z' },
        { id: 'sess_2', device: 'Safari on iPhone', location: 'Austin, TX', current: false, lastActive: '2026-01-21T18:00:00Z' },
      ],
    },
    notifications: {
      email: { taxUpdates: true, documentReminders: true, messages: true, marketing: false },
      push: { taxUpdates: true, documentReminders: true, messages: true },
      sms: { urgentOnly: true },
    },
  })

  // Actions
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [{ ...notification, id: `notif_${Date.now()}`, read: false, createdAt: new Date().toISOString() }, ...prev])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const addDocument = useCallback((doc) => {
    setDocuments(prev => [{ ...doc, id: `doc_${Date.now()}`, uploadedAt: new Date().toISOString() }, ...prev])
  }, [])

  const updateDocumentStatus = useCallback((id, status) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }, [])

  const deleteDocument = useCallback((id) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }, [])

  const createTaxReturn = useCallback((taxYear) => {
    const newReturn = {
      id: `return_${taxYear}`,
      taxYear,
      status: 'in_progress',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedRefund: 0,
      documentsRequired: 0,
      documentsSubmitted: 0,
    }
    setTaxReturns(prev => [newReturn, ...prev])
    return newReturn
  }, [])

  const updateTaxReturn = useCallback((id, updates) => {
    setTaxReturns(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
  }, [])

  const sendMessage = useCallback((threadId, content) => {
    setMessages(prev => prev.map(thread => {
      if (thread.threadId === threadId) {
        const newMessage = {
          id: `m_${Date.now()}`,
          sender: 'client',
          content,
          timestamp: new Date().toISOString(),
        }
        return { ...thread, messages: [...thread.messages, newMessage], unread: 0, updatedAt: new Date().toISOString() }
      }
      return thread
    }))
  }, [])

  const startNewThread = useCallback((type, subject, initialMessage) => {
    const threadId = `thread_${Date.now()}`
    const newThread = {
      id: `msg_${Date.now()}`,
      threadId,
      type,
      subject,
      preview: initialMessage,
      unread: 0,
      updatedAt: new Date().toISOString(),
      messages: [
        { id: `m_${Date.now()}`, sender: 'client', content: initialMessage, timestamp: new Date().toISOString() },
      ],
    }
    if (type === 'advisor') {
      newThread.advisorName = 'James Anderson, CPA'
      newThread.advisorAvatar = null
    } else {
      newThread.advisorName = 'Express Tax Support'
      newThread.advisorAvatar = null
    }
    setMessages(prev => [newThread, ...prev])
    return newThread
  }, [])

  const updateSettings = useCallback((section, data) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], ...data } }))
  }, [])

  // Computed values
  const currentReturn = useMemo(() => {
    return taxReturns.find(r => r.taxYear === selectedTaxYear)
  }, [taxReturns, selectedTaxYear])

  const unreadNotifications = useMemo(() => notifications.filter(n => !n.read).length, [notifications])
  const unreadMessages = useMemo(() => messages.reduce((sum, m) => sum + m.unread, 0), [messages])

  const documentsByCategory = useMemo(() => {
    const filtered = documents.filter(d => d.taxYear === selectedTaxYear)
    const categories = ['W-2', '1099', 'Business Income', 'Bank Statements', 'Other Documents']
    return categories.map(cat => ({
      category: cat,
      documents: filtered.filter(d => d.category === cat),
    })).filter(c => c.documents.length > 0 || categories.indexOf(c.category) < 3)
  }, [documents, selectedTaxYear])

  const value = useMemo(() => ({
    user,
    selectedTaxYear,
    setSelectedTaxYear,
    availableTaxYears,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    documents,
    addDocument,
    updateDocumentStatus,
    deleteDocument,
    documentsByCategory,
    taxReturns,
    currentReturn,
    createTaxReturn,
    updateTaxReturn,
    messages,
    sendMessage,
    startNewThread,
    settings,
    updateSettings,
    unreadNotifications,
    unreadMessages,
  }), [
    user,
    selectedTaxYear,
    availableTaxYears,
    sidebarCollapsed,
    mobileSidebarOpen,
    notifications,
    documents,
    documentsByCategory,
    taxReturns,
    currentReturn,
    messages,
    settings,
    unreadNotifications,
    unreadMessages,
  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}