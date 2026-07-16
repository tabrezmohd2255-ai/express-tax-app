import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  ArrowRight, 
  FilePlus, 
  FolderOpen, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  HelpCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useDropdown } from '../hooks'

const taxYears = [2026, 2025, 2024]

const statusConfig = {
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'bg-success-light text-success', bg: 'bg-success-light' },
  reviewing: { label: 'Under Review', icon: Clock, color: 'bg-warning-light text-warning', bg: 'bg-warning-light' },
  missing: { label: 'Missing', icon: AlertCircle, color: 'bg-error-light text-error', bg: 'bg-error-light' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'bg-info-light text-info', bg: 'bg-info-light' },
  filed: { label: 'Filed', icon: CheckCircle, color: 'bg-success-light text-success', bg: 'bg-success-light' },
}

function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.reviewing
  const Icon = config.icon
  const classes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }
  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', classes[size], config.color)}>
      <Icon size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} aria-hidden="true" />
      {config.label}
    </span>
  )
}

function DocumentCard({ document, taxYear, onClick }) {
  const config = statusConfig[document.status]
  const Icon = config.icon

  return (
    <article 
      className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      role="button"
      aria-label={`View ${document.name}`}
    >
      <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
        <Icon size={20} className={config.color.replace('bg-', 'text-')} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy-900 truncate">{document.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span>{document.category}</span>
          <span>•</span>
          <span>{(document.size / 1024).toFixed(0)} KB</span>
          <span>•</span>
          <span>{document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Not uploaded'}</span>
        </div>
      </div>
      <StatusBadge status={document.status} size="sm" />
      <ChevronDown size={20} className="text-gray-400" aria-hidden="true" />
    </article>
  )
}

function TaxReturnCard({ taxReturn, onClick, onView, onDownload }) {
  const config = statusConfig[taxReturn.status]
  const Icon = config.icon

  return (
    <article className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-navy-900">{taxReturn.taxYear} Tax Return</span>
            <StatusBadge status={taxReturn.status} size="sm" />
          </div>
          <p className="text-sm text-gray-500">Started {new Date(taxReturn.createdAt).toLocaleDateString()}</p>
        </div>
        {taxReturn.status === 'filed' && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-success">${taxReturn.refund?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-500">Refund Received</p>
          </div>
        )}
      </div>

      {taxReturn.status === 'in_progress' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600">Completion Progress</span>
            <span className="font-medium text-navy-900">{taxReturn.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-navy-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${taxReturn.progress}%` }}
              role="progressbar"
              aria-valuenow={taxReturn.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tax return completion progress"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FilePlus size={14} aria-hidden="true" />
            {taxReturn.documentsSubmitted}/{taxReturn.documentsRequired} documents
          </span>
          {taxReturn.estimatedRefund && (
            <span className="flex items-center gap-1">
              <DollarSign size={14} aria-hidden="true" />
              Est. refund: ${taxReturn.estimatedRefund.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {taxReturn.status === 'in_progress' && (
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="btn btn-primary btn-sm"
            >
              Continue
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
          {taxReturn.status === 'filed' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onView(); }}
                className="btn btn-secondary btn-sm"
              >
                <Eye size={14} aria-hidden="true" />
                View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                className="btn btn-gold btn-sm"
              >
                <Download size={14} aria-hidden="true" />
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

function QuickActionCard({ icon: Icon, title, description, href, primary = false, badge }) {
  return (
    <NavLink
      to={href}
      className={clsx(
        'card p-5 flex flex-col h-full transition-all duration-200',
        primary ? 'bg-navy-900 border-navy-800' : 'hover:shadow-md'
      )}
    >
      <div className={clsx(
        'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
        primary ? 'bg-navy-800 text-gold-500' : 'bg-navy-100 text-navy-600'
      )}>
        <Icon size={24} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className={clsx('font-semibold', primary ? 'text-white' : 'text-navy-900')}>{title}</h3>
          {badge && (
            <span className="badge badge-gold text-xs">{badge}</span>
          )}
        </div>
        <p className={clsx('text-sm', primary ? 'text-navy-200' : 'text-gray-500')}>{description}</p>
      </div>
      <div className={clsx('flex items-center justify-between mt-4 pt-4 border-t', primary ? 'border-navy-800' : 'border-gray-200')}>
        <span className={clsx('text-sm font-medium', primary ? 'text-gold-500' : 'text-navy-600')}>
          Get started
          <ArrowRight size={14} className="inline ml-1" aria-hidden="true" />
        </span>
      </div>
    </NavLink>
  )
}

export function Home() {
  const { 
    user, 
    selectedTaxYear, 
    setSelectedTaxYear, 
    availableTaxYears,
    currentReturn,
    documents,
    taxReturns,
    messages,
    unreadMessages,
    createTaxReturn
  } = useApp()

  const taxYearDropdown = useDropdown()
  const yearDocuments = documents.filter(d => d.taxYear === selectedTaxYear)
  const recentDocuments = yearDocuments.slice(0, 5)
  const recentMessages = messages.slice(0, 3)
  const previousReturns = taxReturns.filter(r => r.taxYear !== selectedTaxYear)

  const handleStartNewReturn = () => {
    createTaxReturn(selectedTaxYear)
  }

  const handleContinueReturn = () => {
    // Navigate to tax return detail
  }

  const handleViewReturn = (taxYear) => {
    // Navigate to return detail
  }

  const handleDownloadReturn = (taxYear) => {
    // Trigger download
  }

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <section className="mb-8 animate-slide-in-top" aria-labelledby="welcome-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 id="welcome-heading" className="text-3xl font-bold text-navy-900">
              Welcome back, <span className="text-gold-500">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-600 mt-1">Here's an overview of your tax preparation for {selectedTaxYear}.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <label htmlFor="tax-year-select" className="sr-only">Select tax year</label>
              <select
                id="tax-year-select"
                value={selectedTaxYear}
                onChange={(e) => setSelectedTaxYear(Number(e.target.value))}
                className={clsx(
                  'appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg',
                  'focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20',
                  'cursor-pointer'
                )}
                aria-label="Select tax year"
              >
                {availableTaxYears.map(year => (
                  <option key={year} value={year}>{year} Tax Year</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 border-navy-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M30 0L60 30H0L30 0Z%22 fill=%22%23D4AF37%22 fill-opacity=%220.03%22/%3E%3C/svg%3E')] opacity-50" aria-hidden="true" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              {currentReturn ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-gold">IN PROGRESS</span>
                    <span className="text-sm text-navy-200">{selectedTaxYear} Tax Return • {currentReturn.progress}% complete</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Continue your {selectedTaxYear} tax return</h2>
                  <p className="text-navy-200 mb-4">You're {currentReturn.progress}% done. {currentReturn.documentsRequired - currentReturn.documentsSubmitted} document(s) remaining.</p>
                  <button
                    onClick={handleContinueReturn}
                    className="btn btn-gold"
                  >
                    Continue Tax Return
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-gold">NEW RETURN</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Start your {selectedTaxYear} tax return</h2>
                  <p className="text-navy-200 mb-4">Begin filing your taxes with Express Tax. We'll guide you through every step.</p>
                  <button
                    onClick={handleStartNewReturn}
                    className="btn btn-gold"
                  >
                    Start New Tax Return
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <div className="hidden sm:block relative">
              <Calendar size={80} className="text-gold-500/30" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gold-500/10 rounded-full blur-2xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="mb-8" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={FilePlus}
            title="New Tax Return"
            description="Start a new return for any tax year"
            href="/tax-returns"
            badge="New"
          />
          <QuickActionCard
            icon={Upload}
            title="Upload Documents"
            description="Add W-2s, 1099s, and other tax documents"
            href="/documents"
          />
          <QuickActionCard
            icon={MessageSquare}
            title="Message Advisor"
            description={unreadMessages > 0 ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}` : 'Contact your tax advisor'}
            href="/messages"
            badge={unreadMessages > 0 ? unreadMessages : undefined}
          />
          <QuickActionCard
            icon={Shield}
            title="Security Center"
            description="Manage 2FA, sessions, and passwords"
            href="/settings/security"
          />
        </div>
      </section>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Documents */}
        <section className="lg:col-span-1" aria-labelledby="documents-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="documents-heading" className="text-lg font-semibold text-navy-900">Recent Documents</h2>
            <NavLink to="/documents" className="text-sm text-navy-600 hover:text-navy-900 font-medium flex items-center gap-1">
              View all
              <ArrowRight size={14} aria-hidden="true" />
            </NavLink>
          </div>
          <div className="card overflow-hidden">
            {recentDocuments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc} 
                    taxYear={selectedTaxYear}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                <h3 className="text-navy-900 font-medium mb-1">No documents yet</h3>
                <p className="text-gray-500 text-sm mb-4">Upload your first tax document to get started</p>
                <NavLink to="/documents" className="btn btn-primary btn-sm inline-flex">
                  <Upload size={14} aria-hidden="true" />
                  Upload Documents
                </NavLink>
              </div>
            )}
          </div>
        </section>

        {/* Right Column - Tax Returns & Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tax Returns */}
          <section aria-labelledby="returns-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="returns-heading" className="text-lg font-semibold text-navy-900">Your Tax Returns</h2>
              <NavLink to="/tax-returns" className="text-sm text-navy-600 hover:text-navy-900 font-medium flex items-center gap-1">
                View all
                <ArrowRight size={14} aria-hidden="true" />
              </NavLink>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentReturn && (
                <TaxReturnCard
                  taxReturn={currentReturn}
                  onClick={handleContinueReturn}
                  onView={() => handleViewReturn(currentReturn.taxYear)}
                  onDownload={() => handleDownloadReturn(currentReturn.taxYear)}
                />
              )}
              {previousReturns.map((ret) => (
                <TaxReturnCard
                  key={ret.id}
                  taxReturn={ret}
                  onClick={() => handleViewReturn(ret.taxYear)}
                  onView={() => handleViewReturn(ret.taxYear)}
                  onDownload={() => handleDownloadReturn(ret.taxYear)}
                />
              ))}
              {!currentReturn && previousReturns.length === 0 && (
                <div className="md:col-span-2 card p-8 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                  <h3 className="text-navy-900 font-medium mb-1">No tax returns yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Get started with your {selectedTaxYear} tax return today</p>
                  <button onClick={handleStartNewReturn} className="btn btn-primary">
                    <FilePlus size={14} aria-hidden="true" />
                    Start New Tax Return
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Messages */}
          <section aria-labelledby="messages-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="messages-heading" className="text-lg font-semibold text-navy-900">Messages</h2>
              <NavLink to="/messages" className="text-sm text-navy-600 hover:text-navy-900 font-medium flex items-center gap-1">
                View all
                <ArrowRight size={14} aria-hidden="true" />
              </NavLink>
            </div>
            <div className="card overflow-hidden">
              {recentMessages.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentMessages.map((thread) => (
                    <NavLink
                      key={thread.id}
                      to="/messages"
                      className={clsx(
                        'flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors',
                        thread.unread > 0 && 'bg-gray-50'
                      )}
                      onClick={() => {}}
                    >
                      <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', thread.type === 'advisor' ? 'bg-navy-100 text-navy-700' : 'bg-gold-50 text-gold-600')}>
                        {thread.type === 'advisor' ? (
                          <User size={20} aria-hidden="true" />
                        ) : (
                          <HelpCircle size={20} aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={clsx('text-sm font-medium truncate', thread.unread > 0 ? 'text-navy-900' : 'text-gray-700')}>
                            {thread.advisorName || thread.subject}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(thread.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className={clsx('text-sm truncate mt-0.5', thread.unread > 0 ? 'text-gray-600' : 'text-gray-500')}>
                          {thread.preview}
                        </p>
                        {thread.unread > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-gold-500 text-navy-900 rounded-full mt-1">
                            {thread.unread}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                  <h3 className="text-navy-900 font-medium mb-1">No messages yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Messages from your advisor and support will appear here</p>
                  <NavLink to="/messages" className="btn btn-primary btn-sm inline-flex">
                    <MessageSquare size={14} aria-hidden="true" />
                    Go to Messages
                  </NavLink>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Getting Started / Help */}
      <section className="mt-8" aria-labelledby="help-heading">
        <h2 id="help-heading" className="text-lg font-semibold text-navy-900 mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="card p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center flex-shrink-0">
                <Star size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium text-navy-900 mb-1">Guided Filing</h3>
                <p className="text-sm text-gray-500">Step-by-step questionnaire tailored to your tax situation</p>
              </div>
            </div>
          </article>
          <article className="card p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center flex-shrink-0">
                <Shield size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium text-navy-900 mb-1">Expert Review</h3>
                <p className="text-sm text-gray-500">Every return reviewed by a CPA before filing</p>
              </div>
            </div>
          </article>
          <article className="card p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium text-navy-900 mb-1">Max Refund Guarantee</h3>
                <p className="text-sm text-gray-500">We find every deduction and credit you qualify for</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}