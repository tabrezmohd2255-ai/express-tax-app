import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Hook for managing local storage with serialization
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

/**
 * Hook for detecting clicks outside an element
 */
export function useClickOutside(handler, ignoreRefs = []) {
  const ref = useRef(null)

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return

      // Check if click is on any ignored elements
      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current && ignoreRef.current.contains(event.target)) {
          return
        }
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, ignoreRefs])

  return ref
}

/**
 * Hook for managing modal state
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [data, setData] = useState(null)

  const open = useCallback((modalData = null) => {
    setData(modalData)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return { isOpen, open, close, toggle, data }
}

/**
 * Hook for managing dropdown state
 */
export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  const open = useCallback((anchor) => {
    setAnchorEl(anchor)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setAnchorEl(null)
  }, [])

  const toggle = useCallback((anchor) => {
    if (isOpen) {
      close()
    } else {
      open(anchor)
    }
  }, [isOpen, open, close])

  // Close on outside click
  useClickOutside(close, [dropdownRef, triggerRef])

  return {
    isOpen,
    anchorEl,
    dropdownRef,
    triggerRef,
    open,
    close,
    toggle,
  }
}

/**
 * Hook for form handling
 */
export function useForm(initialValues = {}, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateField(name, value)
    }
  }, [touched])

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
    if (isTouched) {
      validateField(name, values[name])
    }
  }, [values])

  const validateField = useCallback((name, value) => {
    if (!validate) return true
    const fieldErrors = validate({ ...values, [name]: value })
    setErrors(prev => ({ ...prev, [name]: fieldErrors?.[name] }))
    return !fieldErrors?.[name]
  }, [validate, values])

  const validateForm = useCallback(() => {
    if (!validate) return true
    const fieldErrors = validate(values)
    setErrors(fieldErrors || {})
    return Object.keys(fieldErrors || {}).length === 0
  }, [validate, values])

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true)
    const isValid = validateForm()
    if (isValid && onSubmit) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
    setIsSubmitting(false)
    return isValid
  }, [validateForm, values])

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  }
}

/**
 * Hook for debounced values
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing async state
 */
export function useAsync(asyncFn, immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute, setData }
}

/**
 * Hook for media queries
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(query)
    if (media.matches !== matches) setMatches(media.matches)
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query, matches])

  return matches
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrlKey = false, metaKey = false, shiftKey = false, altKey = false, preventDefault = true } = options

  useEffect(() => {
    const handler = (event) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase()
      const ctrlMatches = event.ctrlKey === ctrlKey
      const metaMatches = event.metaKey === metaKey
      const shiftMatches = event.shiftKey === shiftKey
      const altMatches = event.altKey === altKey

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        if (preventDefault) event.preventDefault()
        callback(event)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback, ctrlKey, metaKey, shiftKey, altKey, preventDefault])
}

/**
 * Hook for tracking element visibility
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return [ref, isIntersecting]
}

/**
 * Hook for copy to clipboard
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopied(false)
      return false
    }
  }, [])

  return { copied, copy }
}

/**
 * Hook for file upload with drag and drop
 */
export function useFileUpload(options = {}) {
  const { accept, maxSize, maxFiles, onUpload } = options
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState([])

  const validateFile = useCallback((file) => {
    if (accept && !accept.some(type => file.type.match(type) || file.name.match(type))) {
      return `File type not allowed: ${file.name}`
    }
    if (maxSize && file.size > maxSize) {
      return `File too large: ${file.name} (max ${formatFileSize(maxSize)})`
    }
    return null
  }, [accept, maxSize])

  const addFiles = useCallback((newFiles) => {
    const newErrors = []
    const validFiles = []

    Array.from(newFiles).forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push({ file: file.name, error })
      } else {
        validFiles.push(file)
      }
    })

    if (maxFiles && files.length + validFiles.length > maxFiles) {
      const excess = files.length + validFiles.length - maxFiles
      validFiles.splice(-excess)
      newErrors.push({ file: '', error: `Maximum ${maxFiles} files allowed` })
    }

    setErrors(prev => [...prev, ...newErrors])
    setFiles(prev => [...prev, ...validFiles])

    return validFiles
  }, [files.length, maxFiles, validateFile])

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setErrors([])
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleFileSelect = useCallback((e) => {
    if (e.target.files.length) {
      addFiles(e.target.files)
    }
  }, [addFiles])

  const uploadFiles = useCallback(async () => {
    if (!onUpload || files.length === 0) return
    for (const file of files) {
      await onUpload(file)
    }
  }, [files, onUpload])

  return {
    files,
    dragging,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    uploadFiles,
    setFiles,
    setErrors,
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Hook for toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((toast) => {
    const id = Date.now().toString()
    const newToast = { id, ...toast }
    setToasts(prev => [...prev, newToast])

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, toast.duration || 5000)
    }

    return id
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((title, message, options) => {
    return show({ type: 'success', title, message, ...options })
  }, [show])

  const error = useCallback((title, message, options) => {
    return show({ type: 'error', title, message, ...options })
  }, [show])

  const warning = useCallback((title, message, options) => {
    return show({ type: 'warning', title, message, ...options })
  }, [show])

  const info = useCallback((title, message, options) => {
    return show({ type: 'info', title, message, ...options })
  }, [show])

  return { toasts, show, dismiss, success, error, warning, info }
}