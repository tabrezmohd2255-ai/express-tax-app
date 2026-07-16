import React, { useState, useRef, useCallback } from 'react'
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  X,
  ChevronDown,
  Filter,
  Search,
  Grid,
  List,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useFileUpload, useDropdown, useToast } from '../hooks'

const categories = ['W-2', '1099', 'Business Income', 'Bank Statements', 'Other Documents']
const statusOptions = ['All', 'Accepted', 'Reviewing', 'Missing']

const categoryIcons = {
  'W-2': FileText,
  '1099': FileText,
  'Business Income': FileText,
  'Bank Statements': FileText,
  'Other Documents': FileText,
}

const statusConfig = {
  accepted: { label: 'Accepted', color: 'bg-success-light text-success', icon: CheckCircle },
  reviewing: { label: 'Under Review', color: 'bg-warning-light text-warning', icon: Clock },
  missing: { label: 'Missing', color: 'bg-error-light text-error', icon: AlertCircle },
}

function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status]
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

function DocumentRow({ document, taxYear, onAction, viewMode }) {
  const config = statusConfig[document.status]
  const Icon = config.icon
  const categoryIcon = categoryIcons[document.category] || FileText

  if (viewMode === 'grid') {
    return (
      <article className="card p-4 flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', config.bg === 'bg-success-light' ? 'bg-success-light' : config.bg === 'bg-warning-light' ? 'bg-warning-light' : 'bg-error-light')}>
            <Icon size={20} className={config.color.replace('bg-', 'text-')} aria-hidden="true" />
          </div>
          <StatusBadge status={document.status} size="sm" />
        </div>
        <div className="flex-1 min-h-0">
          <p className="text-sm font-medium text-navy-900 truncate mb-1">{document.name}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <categoryIcon size={12} aria-hidden="true" />
            <span>{document.category}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{(document.size / 1024).toFixed(0)} KB</span>
            <span>•</span>
            <span>{document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Not uploaded'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 mt-auto">
          {document.uploadedAt && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('view', document); }}
              className="btn btn-ghost btn-sm flex-1"
              aria-label={`View ${document.name}`}
            >
              <Eye size={14} aria-hidden="true" />
              View
            </button>
          )}
          {document.uploadedAt && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('download', document); }}
              className="btn btn-ghost btn-sm flex-1"
              aria-label={`Download ${document.name}`}
            >
              <Download size={14} aria-hidden="true" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAction('delete', document); }}
            className="btn btn-ghost btn-sm flex-1 text-error hover:text-error hover:bg-error-light"
            aria-label={`Delete ${document.name}`}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      </article>
    )
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="flex items-center gap-3">
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
          <Icon size={16} className={config.color.replace('bg-', 'text-')} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-navy-900">{document.name}</p>
          <p className="text-xs text-gray-500">{document.category}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <StatusBadge status={document.status} size="sm" />
      </td>
      <td className="hidden lg:table-cell text-sm text-gray-500">
        {(document.size / 1024).toFixed(0)} KB
      </td>
      <td className="text-sm text-gray-500">
        {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : '—'}
      </td>
      <td className="text-right">
        <div className="flex items-center justify-end gap-1">
          {document.uploadedAt && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('view', document); }}
              className="btn btn-ghost btn-sm p-2"
              aria-label={`View ${document.name}`}
            >
              <Eye size={16} aria-hidden="true" />
            </button>
          )}
          {document.uploadedAt && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('download', document); }}
              className="btn btn-ghost btn-sm p-2"
              aria-label={`Download ${document.name}`}
            >
              <Download size={16} aria-hidden="true" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAction('delete', document); }}
            className="btn btn-ghost btn-sm p-2 text-error hover:text-error hover:bg-error-light"
            aria-label={`Delete ${document.name}`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function DocumentCategorySection({ category, documents, taxYear, onAction, viewMode, expanded, onToggle }) {
  const categoryDocs = documents.filter(d => d.category === category)
  const accepted = categoryDocs.filter(d => d.status === 'accepted').length
  const reviewing = categoryDocs.filter(d => d.status === 'reviewing').length
  const missing = categoryDocs.filter(d => d.status === 'missing').length
  const Icon = categoryIcons[category] || FileText

  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center">
            <Icon size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-medium text-navy-900">{category}</h3>
            <p className="text-xs text-gray-500">
              {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''} • 
              {accepted} accepted{reviewing > 0 ? `, ${reviewing} reviewing` : ''}{missing > 0 ? `, ${missing} missing` : ''}
            </p>
          </div>
        </div>
        <ChevronDown size={20} className={clsx('text-gray-400 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
      </button>

      {expanded && (
        <div className="border-t border-gray-200 p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryDocs.map(doc => (
                <DocumentRow key={doc.id} document={doc} taxYear={taxYear} onAction={onAction} viewMode="grid" />
              ))}
              {categoryDocs.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p className="text-sm">No documents in this category yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th className="hidden md:table-cell">Status</th>
                    <th className="hidden lg:table-cell">Size</th>
                    <th>Uploaded</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryDocs.map(doc => (
                    <DocumentRow key={doc.id} document={doc} taxYear={taxYear} onAction={onAction} viewMode="list" />
                  ))}
                  {categoryDocs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No documents in this category yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UploadModal({ isOpen, onClose, onUpload, taxYear }) {
  const upload = useFileUpload({
    accept: ['application/pdf', 'image/', '.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls', '.csv'],
    maxSize: 25 * 1024 * 1024,
    maxFiles: 10,
  })

  const [selectedCategory, setSelectedCategory] = useState('W-2')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (upload.files.length === 0) return

    setUploading(true)
    try {
      for (const file of upload.files) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate upload
        onUpload({
          name: file.name,
          category: selectedCategory,
          status: 'reviewing',
          size: file.size,
          taxYear,
        })
      }
      onClose()
      upload.clearFiles()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <div className="modal modal-lg animate-scale-in">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2 id="upload-modal-title" className="modal-title">Upload Documents</h2>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="modal-body">
            <div className="mb-6">
              <label htmlFor="doc-category" className="label">Category</label>
              <select
                id="doc-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div
              className={clsx(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                upload.dragging ? 'border-navy-500 bg-navy-50' : 'border-gray-200 hover:border-navy-300'
              )}
              onDragOver={upload.handleDragOver}
              onDragLeave={upload.handleDragLeave}
              onDrop={upload.handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && upload.inputRef.current?.click()}
            >
              <input
                ref={upload.inputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
                onChange={upload.handleFileSelect}
                className="sr-only"
                id="file-upload"
              />
              <Upload size={48} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
              <p className="text-navy-900 font-medium mb-1">Drag & drop files here, or click to browse</p>
              <p className="text-sm text-gray-500">PDF, JPG, PNG, XLSX, CSV up to 25MB each</p>
            </div>

            {upload.files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium text-navy-900">Files to upload ({upload.files.length})</h4>
                {upload.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-gray-400" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => upload.removeFile(index)}
                      className="text-gray-400 hover:text-error transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {upload.errors.length > 0 && (
              <div className="mt-4 space-y-2">
                {upload.errors.map((err, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-error-light text-error text-sm rounded-lg">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>{err.file ? `${err.file}: ` : ''}{err.error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading || upload.files.length === 0}>
              {uploading ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Uploading...
                </>
              ) : (
                <>
                  Upload {upload.files.length} file{upload.files.length !== 1 ? 's' : ''}
                  <Upload size={14} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Documents() {
  const { 
    selectedTaxYear, 
    documents, 
    addDocument, 
    updateDocumentStatus, 
    deleteDocument,
    availableTaxYears,
    setSelectedTaxYear 
  } = useApp()
  const { toasts, show: showToast } = useToast()
  const [viewMode, setViewMode] = useState('list')
  const [expandedCategories, setExpandedCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  )
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'uploadedAt', direction: 'desc' })
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const yearDropdown = useDropdown()

  const filteredDocs = documents
    .filter(d => d.taxYear === selectedTaxYear)
    .filter(d => statusFilter === 'All' || d.status === statusFilter.toLowerCase())
    .filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return 1
      if (bVal === null) return -1
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      return aVal > bVal ? direction : -direction
    })

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleAction = (action, document) => {
    switch (action) {
      case 'view':
        // Open preview modal
        showToast({ type: 'info', title: 'Preview', message: `Opening ${document.name}...` })
        break
      case 'download':
        // Trigger download
        showToast({ type: 'success', title: 'Download started', message: `${document.name} is downloading` })
        break
      case 'delete':
        if (confirm(`Delete ${document.name}? This cannot be undone.`)) {
          deleteDocument(document.id)
          showToast({ type: 'success', title: 'Deleted', message: `${document.name} has been removed` })
        }
        break
    }
  }

  const handleUpload = (docData) => {
    addDocument(docData)
    showToast({ type: 'success', title: 'Upload complete', message: `${docData.name} has been uploaded for review` })
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your tax documents for {selectedTaxYear}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <select
              value={selectedTaxYear}
              onChange={(e) => setSelectedTaxYear(Number(e.target.value))}
              className="appearance-none pl-4 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 cursor-pointer"
              aria-label="Select tax year"
            >
              {availableTaxYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn btn-primary"
          >
            <Upload size={16} aria-hidden="true" />
            Upload Documents
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="input pl-10"
              aria-label="Search documents"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2 px-3 text-sm min-w-[150px]"
              aria-label="Filter by status"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={clsx('p-2 transition-colors', viewMode === 'list' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-600')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={clsx('p-2 transition-colors', viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-600')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="space-y-4">
        {categories.map(category => (
          <DocumentCategorySection
            key={category}
            category={category}
            documents={filteredDocs}
            taxYear={selectedTaxYear}
            onAction={handleAction}
            viewMode={viewMode}
            expanded={expandedCategories[category]}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="card p-12 text-center">
          <Upload size={64} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-navy-900 mb-2">
            {searchQuery || statusFilter !== 'All' ? 'No matching documents' : 'No documents yet'}
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'All' 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Upload your first tax document to get started. We accept PDFs, images, and spreadsheets.'
            }
          </p>
          {(searchQuery || statusFilter !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="btn btn-secondary mr-2"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Clear filters
            </button>
          )}
          {!searchQuery && statusFilter === 'All' && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn btn-primary"
            >
              <Upload size={14} aria-hidden="true" />
              Upload Documents
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        taxYear={selectedTaxYear}
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