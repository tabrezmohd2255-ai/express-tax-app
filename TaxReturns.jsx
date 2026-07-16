import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FilePlus, 
  Eye, 
  Download, 
  Edit, 
  Trash2, 
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Calendar,
  Search
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useModal, useToast } from '../hooks'

const statusConfig = {
  in_progress: { label: 'In Progress', color: 'bg-info-light text-info', icon: Clock, bg: 'bg-info-light' },
  filed: { label: 'Filed', color: 'bg-success-light text-success', icon: CheckCircle, bg: 'bg-success-light' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: FileText, bg: 'bg-gray-100' },
  review: { label: 'Under Review', color: 'bg-warning-light text-warning', icon: Clock, bg: 'bg-warning-light' },
}

function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.in_progress
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

function TaxReturnCard({ taxReturn, onView, onDownload, onContinue, onDelete }) {
  const config = statusConfig[taxReturn.status]
  const Icon = config.icon
  const isCurrentYear = taxReturn.taxYear === new Date().getFullYear()

  return (
    <article className="card p-6 hover:shadow-md transition-shadow relative">
      {isCurrentYear && taxReturn.status === 'in_progress' && (
        <div className="absolute top-4 right-4">
          <span className="badge badge-gold text-xs">CURRENT</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-lg font-semibold text-navy-900">{taxReturn.taxYear} Tax Return</span>
            <StatusBadge status={taxReturn.status} size="sm" />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span>Started {new Date(taxReturn.createdAt).toLocaleDateString()}</span>
            {taxReturn.updatedAt && (
              <span>Updated {new Date(taxReturn.updatedAt).toLocaleDateString()}</span>
            )}
            {taxReturn.filedDate && (
              <span className="text-success font-medium">Filed {new Date(taxReturn.filedDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        {taxReturn.status === 'filed' && taxReturn.refund && (
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold text-success">${taxReturn.refund.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Refund Received</p>
          </div>
        )}
      </div>

      {taxReturn.status === 'in_progress' && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                <FileText size={16} className="text-navy-600" aria-hidden="true" />
              </div>
              <span className="font-medium text-navy-900">Return Progress</span>
            </div>
            <span className="text-lg font-bold text-navy-900">{taxReturn.progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>{taxReturn.documentsSubmitted}/{taxReturn.documentsRequired} documents uploaded</span>
            {taxReturn.estimatedRefund > 0 && (
              <span className="flex items-center gap-1 text-navy-900 font-medium">
                <DollarSign size={14} aria-hidden="true" />
                Est. refund: ${taxReturn.estimatedRefund.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}

      {taxReturn.status === 'filed' && (
        <div className="mb-4 p-4 bg-success-light/50 rounded-lg border border-success-light/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle size={20} className="text-success" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-success">Return Filed Successfully</p>
              <p className="text-sm text-gray-600">Your {taxReturn.taxYear} tax return was filed on {new Date(taxReturn.filedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FileText size={14} aria-hidden="true" />
            {taxReturn.documentsSubmitted}/{taxReturn.documentsRequired} documents
          </span>
        </div>
        <div className="flex items-center gap-2">
          {taxReturn.status === 'in_progress' && (
            <button
              onClick={onContinue}
              className="btn btn-primary"
            >
              Continue Return
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
          {taxReturn.status === 'filed' && (
            <>
              <button
                onClick={onView}
                className="btn btn-secondary btn-sm"
              >
                <Eye size={14} aria-hidden="true" />
                View Return
              </button>
              <button
                onClick={onDownload}
                className="btn btn-gold btn-sm"
              >
                <Download size={14} aria-hidden="true" />
                Download PDF
              </button>
            </>
          )}
          {taxReturn.status === 'draft' && (
            <>
              <button onClick={onContinue} className="btn btn-primary">Continue</button>
              <button onClick={onDelete} className="btn btn-ghost text-error">Delete</button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

function CreateReturnModal({ isOpen, onClose, onCreate, availableYears, existingYears }) {
  const [selectedYear, setSelectedYear] = useState('')
  const [creating, setCreating] = useState(false)

  const availableForNew = availableYears.filter(y => !existingYears.includes(y))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedYear) return
    setCreating(true)
    try {
      await onCreate(Number(selectedYear))
      onClose()
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="create-return-title">
      <div className="modal modal-md animate-scale-in">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2 id="create-return-title" className="modal-title">Create New Tax Return</h2>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="modal-body">
            <p className="text-gray-600 mb-4">Select the tax year you want to file for. You can only have one return per tax year.</p>
            
            <div className="space-y-2">
              {availableForNew.map(year => (
                <label key={year} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-navy-300 hover:bg-gray-50 transition-colors has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50">
                  <input
                    type="radio"
                    name="tax-year"
                    value={year}
                    checked={selectedYear === String(year)}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-4 h-4 text-navy-600 border-gray-300 focus:ring-navy-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-navy-900">{year} Tax Year</p>
                    <p className="text-sm text-gray-500">Filing deadline: April 15, {year + 1}</p>
                  </div>
                  <Calendar size={20} className="text-navy-300" aria-hidden="true" />
                </label>
              ))}
              {availableForNew.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                  <p>You already have returns for all available years</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={creating}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating || !selectedYear || availableForNew.length === 0}>
              {creating ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Creating...
                </>
              ) : (
                <>
                  Create Return
                  <FilePlus size={14} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReturnDetailModal({ isOpen, onClose, taxReturn }) {
  if (!isOpen || !taxReturn) return null

  const config = statusConfig[taxReturn.status]
  const Icon = config.icon

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="return-detail-title">
      <div className="modal modal-lg animate-scale-in max-h-[90vh]">
        <div className="modal-header">
          <h2 id="return-detail-title" className="modal-title">{taxReturn.taxYear} Tax Return Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-navy-900 mb-4">Status Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                      <Icon size={20} className={config.color.replace('bg-', 'text-')} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">Return Status</p>
                      <p className="text-sm text-gray-500">{config.label}</p>
                    </div>
                  </div>
                  <StatusBadge status={taxReturn.status} size="md" />
                </div>

                {taxReturn.status === 'in_progress' && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-navy-900">Completion</span>
                      <span className="text-lg font-bold text-navy-900">{taxReturn.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-navy-600 rounded-full"
                        style={{ width: `${taxReturn.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-2xl font-bold text-navy-900">{taxReturn.documentsSubmitted}/{taxReturn.documentsRequired}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Est. Refund</p>
                    <p className="text-2xl font-bold text-success">${taxReturn.estimatedRefund?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-navy-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-navy-600 border-2 border-white" />
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-navy-900">{new Date(taxReturn.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                {taxReturn.updatedAt && taxReturn.updatedAt !== taxReturn.createdAt && (
                  <div className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-navy-400 border-2 border-white" />
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-navy-900">{new Date(taxReturn.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                )}
                {taxReturn.filedDate && (
                  <div className="relative pl-6 border-l-2 border-success">
                    <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-success border-2 border-white" />
                    <p className="text-sm text-success">Filed</p>
                    <p className="font-medium text-navy-900">{new Date(taxReturn.filedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {taxReturn.status === 'filed' && taxReturn.refund && (
            <div className="mt-6 p-4 bg-success-light/50 rounded-lg border border-success-light/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-success">Refund Issued</p>
                  <p className="text-sm text-gray-600">Your refund of ${taxReturn.refund.toLocaleString()} has been processed</p>
                </div>
                <p className="text-3xl font-bold text-success">${taxReturn.refund.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
          {taxReturn.status === 'filed' && (
            <button className="btn btn-gold">
              <Download size={14} aria-hidden="true" />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function TaxReturns() {
  const { 
    taxReturns, 
    currentReturn, 
    selectedTaxYear, 
    setSelectedTaxYear,
    availableTaxYears,
    createTaxReturn,
    updateTaxReturn,
  } = useApp()
  const { toasts, show: showToast } = useToast()
  const [viewMode, setViewMode] = useState('grid')
  const [selectedReturn, setSelectedReturn] = useState(null)
  const createModal = useModal()
  const detailModal = useModal()

  const existingYears = taxReturns.map(r => r.taxYear)

  const handleCreateReturn = (year) => {
    createTaxReturn(year)
    showToast({ type: 'success', title: 'Return created', message: `${year} tax return has been created` })
  }

  const handleView = (taxReturn) => {
    setSelectedReturn(taxReturn)
    detailModal.open(taxReturn)
  }

  const handleDownload = (taxReturn) => {
    showToast({ type: 'success', title: 'Download started', message: `${taxReturn.taxYear} tax return PDF is downloading` })
  }

  const handleContinue = (taxReturn) => {
    showToast({ type: 'info', title: 'Continuing return', message: `Opening ${taxReturn.taxYear} tax return...` })
  }

  const handleDelete = (taxReturn) => {
    if (confirm(`Delete ${taxReturn.taxYear} tax return? This cannot be undone.`)) {
      // In real app: deleteTaxReturn(taxReturn.id)
      showToast({ type: 'success', title: 'Deleted', message: `${taxReturn.taxYear} tax return has been removed` })
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Tax Returns</h1>
          <p className="text-gray-600 mt-1">View and manage your tax returns across all years</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="btn btn-primary"
        >
          <FilePlus size={16} aria-hidden="true" />
          New Tax Return
        </button>
      </div>

      {/* Tax Year Selector */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Tax Year:</span>
            <div className="flex items-center gap-2" role="group" aria-label="Select tax year">
              {availableTaxYears.map(year => {
                const ret = taxReturns.find(r => r.taxYear === year)
                const isSelected = selectedTaxYear === year
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedTaxYear(year)}
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isSelected 
                        ? 'bg-navy-900 text-white shadow-sm' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
                      ret?.status === 'filed' && !isSelected && 'text-success border-success/50'
                    )}
                    aria-pressed={isSelected}
                  >
                    {year}
                    {ret?.status === 'filed' && !isSelected && (
                      <CheckCircle size={14} className="ml-1 text-success" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-600 hover:bg-gray-100')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Calendar size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-600 hover:bg-gray-100')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <FileText size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Returns Grid/List */}
      <div className={clsx(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      )}>
        {taxReturns.length > 0 ? (
          taxReturns.map(ret => (
            viewMode === 'grid' ? (
              <TaxReturnCard
                key={ret.id}
                taxReturn={ret}
                onView={() => handleView(ret)}
                onDownload={() => handleDownload(ret)}
                onContinue={() => handleContinue(ret)}
                onDelete={() => handleDelete(ret)}
              />
            ) : (
              <div className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
                    <div className="text-2xl font-bold text-navy-900">{ret.taxYear}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-navy-900">{ret.taxYear} Tax Return</h3>
                      <StatusBadge status={ret.status} size="sm" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {ret.status === 'filed' ? `Filed ${new Date(ret.filedDate).toLocaleDateString()}` : `Progress: ${ret.progress}% • ${ret.documentsSubmitted}/${ret.documentsRequired} docs`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ret.status === 'filed' && (
                    <div className="text-right hidden sm:block">
                      <p className="text-xl font-bold text-success">${ret.refund?.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">Refund</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {ret.status === 'in_progress' && (
                      <button onClick={() => handleContinue(ret)} className="btn btn-primary btn-sm">Continue</button>
                    )}
                    {ret.status === 'filed' && (
                      <>
                        <button onClick={() => handleView(ret)} className="btn btn-secondary btn-sm"><Eye size={14} /></button>
                        <button onClick={() => handleDownload(ret)} className="btn btn-gold btn-sm"><Download size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="card p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">No tax returns yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Get started by creating your first tax return. We'll guide you through every step.
            </p>
            <button onClick={() => createModal.open()} className="btn btn-primary">
              <FilePlus size={14} aria-hidden="true" />
              Create New Tax Return
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {taxReturns.length > 0 && (
        <section className="mt-8" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="text-lg font-semibold text-navy-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <article className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center">
                  <FileText size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-navy-900">{taxReturns.length}</p>
                  <p className="text-sm text-gray-500">Total Returns</p>
                </div>
              </div>
            </article>
            <article className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success-light text-success flex items-center justify-center">
                  <CheckCircle size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-navy-900">
                    {taxReturns.filter(r => r.status === 'filed').length}
                  </p>
                  <p className="text-sm text-gray-500">Filed Returns</p>
                </div>
              </div>
            </article>
            <article className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center">
                  <DollarSign size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-navy-900">
                    ${taxReturns.filter(r => r.status === 'filed').reduce((sum, r) => sum + (r.refund || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Refunds</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Create Return Modal */}
      <CreateReturnModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onCreate={handleCreateReturn}
        availableYears={availableTaxYears}
        existingYears={existingYears}
      />

      {/* Detail Modal */}
      <ReturnDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        taxReturn={detailModal.data}
      />

      {/* Toast Container */}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={clsx('toast animate-slide-in-right', toast.type)}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} className="text-success" />}
              {toast.type === 'error' && <AlertCircle size={20} className="text-error" />}
              {toast.type === 'warning' && <AlertCircle size={20} className="text-warning" />}
              {toast.type === 'info' && <AlertCircle size={20} className="text-info" />}
            </div>
            <div className="toast-content">
              <p className="toast-title">{toast.title}</p>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close" onClick={() => {}} aria-label="Dismiss">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}