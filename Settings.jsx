import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  User, 
  Building2, 
  Shield, 
  Bell, 
  LogOut,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Key,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
  Edit,
  Plus,
  Camera,
  Download,
  Upload,
  ArrowLeft,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { clsx } from 'clsx'
import { useForm, useToast } from '../hooks'

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  { id: 'business', label: 'Business Info', icon: Building2, path: '/settings/business' },
  { id: 'personal', label: 'Personal Info', icon: User, path: '/settings/personal' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
]

function SectionCard({ title, description, children, action }) {
  return (
    <article className="card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && action}
      </div>
      {children}
    </article>
  )
}

function InputField({ label, type = 'text', value, onChange, onBlur, error, helperText, disabled, icon, children, ...props }) {
  return (
    <div className="input-group">
      <label htmlFor={props.id} className="label">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><icon size={20} aria-hidden="true" /></div>}
        {children ? (
          React.cloneElement(children, {
            className: clsx('input', icon && 'pl-10', error && 'input-error', disabled && 'bg-gray-100', children.props.className),
            disabled,
            'aria-invalid': !!error,
            'aria-describedby': error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined,
          })
        ) : (
          <input
            type={type}
            id={props.id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={clsx('input', icon && 'pl-10', error && 'input-error', disabled && 'bg-gray-100')}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
        )}
      </div>
      {error && <p id={`${props.id}-error`} className="helper-text error" role="alert">{error}</p>}
      {helperText && !error && <p id={`${props.id}-helper`} className="helper-text">{helperText}</p>}
    </div>
  )
}

function ToggleSwitch({ label, description, checked, onChange, disabled }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-1',
          checked ? 'bg-gold-500' : 'bg-gray-300'
        )}
        aria-label={label}
      >
        <span className={clsx(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )} aria-hidden="true" />
      </button>
      <div className="flex-1">
        <p className="font-medium text-navy-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </label>
  )
}

function SessionItem({ session, current, onRevoke }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', current ? 'bg-navy-100 text-navy-600' : 'bg-gray-200 text-gray-500')}>
          {session.device.includes('Mac') || session.device.includes('Chrome') ? <Monitor size={20} aria-hidden="true" /> : <Smartphone size={20} aria-hidden="true" />}
        </div>
        <div>
          <p className="font-medium text-navy-900">{session.device}</p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin size={12} aria-hidden="true" />
            {session.location}
            {current && <span className="badge badge-success text-xs">Current</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Last active: {new Date(session.lastActive).toLocaleString()}</span>
        {!current && (
          <button onClick={() => onRevoke(session.id)} className="btn btn-ghost btn-sm text-error hover:text-error hover:bg-error-light">
            <Trash2 size={14} aria-hidden="true" />
            Revoke
          </button>
        )}
      </div>
    </div>
  )
}

export function Settings() {
  const { 
    settings, 
    updateSettings,
    user,
  } = useApp()
  const location = useLocation()
  const { toasts, show: showToast } = useToast()

  const currentPath = location.pathname.replace('/settings/', '') || 'profile'
  const activeSection = settingsSections.find(s => s.id === currentPath) || settingsSections[0]

  // Profile Form
  const profileForm = useForm({
    firstName: settings.profile.firstName,
    lastName: settings.profile.lastName,
    email: settings.profile.email,
    phone: settings.profile.phone,
    timezone: settings.profile.timezone,
    language: settings.profile.language,
  }, (values) => {
    const errors = {}
    if (!values.firstName.trim()) errors.firstName = 'First name is required'
    if (!values.lastName.trim()) errors.lastName = 'Last name is required'
    if (!values.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email address'
    return errors
  })

  const handleProfileSubmit = async (values) => {
    await new Promise(r => setTimeout(r, 500))
    updateSettings('profile', values)
    showToast({ type: 'success', title: 'Profile updated', message: 'Your profile has been saved successfully' })
  }

  // Business Form
  const businessForm = useForm({
    name: settings.business.name,
    ein: settings.business.ein,
    entityType: settings.business.entityType,
    street: settings.business.address.street,
    city: settings.business.address.city,
    state: settings.business.address.state,
    zip: settings.business.address.zip,
    industry: settings.business.industry,
  }, (values) => {
    const errors = {}
    if (!values.name.trim()) errors.name = 'Business name is required'
    if (!values.ein.trim()) errors.ein = 'EIN is required'
    return errors
  })

  const handleBusinessSubmit = async (values) => {
    await new Promise(r => setTimeout(r, 500))
    updateSettings('business', {
      name: values.name,
      ein: values.ein,
      entityType: values.entityType,
      address: { street: values.street, city: values.city, state: values.state, zip: values.zip },
      industry: values.industry,
    })
    showToast({ type: 'success', title: 'Business info updated', message: 'Your business information has been saved' })
  }

  // Personal Form
  const personalForm = useForm({
    ssn: settings.personal.ssn,
    dob: settings.personal.dob,
    filingStatus: settings.personal.filingStatus,
    dependents: settings.personal.dependents,
    street: settings.personal.address.street,
    city: settings.personal.address.city,
    state: settings.personal.address.state,
    zip: settings.personal.address.zip,
  }, (values) => {
    const errors = {}
    if (!values.dob) errors.dob = 'Date of birth is required'
    if (!values.street.trim()) errors.street = 'Street address is required'
    return errors
  })

  const handlePersonalSubmit = async (values) => {
    await new Promise(r => setTimeout(r, 500))
    updateSettings('personal', {
      ssn: values.ssn,
      dob: values.dob,
      filingStatus: values.filingStatus,
      dependents: values.dependents,
      address: { street: values.street, city: values.city, state: values.state, zip: values.zip },
    })
    showToast({ type: 'success', title: 'Personal info updated', message: 'Your personal information has been saved' })
  }

  // Security state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings.security.twoFactorEnabled)
  const [twoFactorStep, setTwoFactorStep] = useState(0)
  const [totpCode, setTotpCode] = useState('')

  const calculateStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return Math.min(strength, 5)
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPasswordStrength(calculateStrength(val))
  }

  const handleEnable2FA = () => {
    setTwoFactorStep(1)
  }

  const handleVerify2FA = () => {
    if (totpCode.length === 6) {
      setTwoFactorEnabled(true)
      updateSettings('security', { twoFactorEnabled: true })
      setTwoFactorStep(0)
      setTotpCode('')
      showToast({ type: 'success', title: '2FA enabled', message: 'Two-factor authentication is now active' })
    }
  }

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable two-factor authentication?')) {
      setTwoFactorEnabled(false)
      updateSettings('security', { twoFactorEnabled: false })
      showToast({ type: 'success', title: '2FA disabled', message: 'Two-factor authentication has been turned off' })
    }
  }

  // Notification toggles
  const handleNotificationChange = (category, key, value) => {
    updateSettings('notifications', {
      [category]: { ...settings.notifications[category], [key]: value }
    })
    showToast({ type: 'success', title: 'Preferences saved', message: 'Your notification preferences have been updated' })
  }

  const renderSection = () => {
    switch (currentPath) {
      case 'profile':
        return (
          <div className="max-w-2xl">
            <SectionCard title="Profile Information" description="Manage your name, contact details, and preferences">
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    id="firstName"
                    value={profileForm.values.firstName}
                    onChange={profileForm.setValue}
                    onBlur={profileForm.setFieldTouched}
                    error={profileForm.errors.firstName}
                    touched={profileForm.touched.firstName}
                    icon={User}
                  />
                  <InputField
                    label="Last Name"
                    id="lastName"
                    value={profileForm.values.lastName}
                    onChange={profileForm.setValue}
                    onBlur={profileForm.setFieldTouched}
                    error={profileForm.errors.lastName}
                    touched={profileForm.touched.lastName}
                    icon={User}
                  />
                </div>
                <InputField
                  label="Email Address"
                  type="email"
                  id="email"
                  value={profileForm.values.email}
                  onChange={profileForm.setValue}
                  onBlur={profileForm.setFieldTouched}
                  error={profileForm.errors.email}
                  touched={profileForm.touched.email}
                  icon={Mail}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  value={profileForm.values.phone}
                  onChange={profileForm.setValue}
                  onBlur={profileForm.setFieldTouched}
                  icon={Phone}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Timezone"
                    id="timezone"
                    value={profileForm.values.timezone}
                    onChange={profileForm.setValue}
                    icon={Calendar}
                  >
                    <select
                      id="timezone"
                      value={profileForm.values.timezone}
                      onChange={(e) => profileForm.setValue('timezone', e.target.value)}
                      className="input"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Anchorage">Alaska Time</option>
                      <option value="Pacific/Honolulu">Hawaii Time</option>
                    </select>
                  </InputField>
                  <InputField
                    label="Language"
                    id="language"
                    value={profileForm.values.language}
                    onChange={profileForm.setValue}
                    icon={Calendar}
                  >
                    <select
                      id="language"
                      value={profileForm.values.language}
                      onChange={(e) => profileForm.setValue('language', e.target.value)}
                      className="input"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                    </select>
                  </InputField>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button type="button" className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={profileForm.isSubmitting}>
                    {profileForm.isSubmitting ? (
                      <>
                        <span className="spinner spinner-sm" aria-hidden="true" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        )

      case 'business':
        return (
          <div className="max-w-2xl">
            <SectionCard title="Business Information" description="Your business details for tax filing">
              <form onSubmit={businessForm.handleSubmit(handleBusinessSubmit)} className="space-y-6">
                <InputField
                  label="Business Name"
                  id="name"
                  value={businessForm.values.name}
                  onChange={businessForm.setValue}
                  onBlur={businessForm.setFieldTouched}
                  error={businessForm.errors.name}
                  touched={businessForm.touched.name}
                  icon={Building2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="EIN (Employer Identification Number)"
                    id="ein"
                    value={businessForm.values.ein}
                    onChange={businessForm.setValue}
                    onBlur={businessForm.setFieldTouched}
                    error={businessForm.errors.ein}
                    touched={businessForm.touched.ein}
                    placeholder="XX-XXXXXXX"
                    icon={Shield}
                  />
                  <InputField
                    label="Entity Type"
                    id="entityType"
                    value={businessForm.values.entityType}
                    onChange={businessForm.setValue}
                    icon={Building2}
                  >
                    <select
                      id="entityType"
                      value={businessForm.values.entityType}
                      onChange={(e) => businessForm.setValue('entityType', e.target.value)}
                      className="input"
                    >
                      <option value="LLC">LLC</option>
                      <option value="S-Corp">S-Corporation</option>
                      <option value="C-Corp">C-Corporation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                  </InputField>
                </div>
                <InputField
                  label="Industry"
                  id="industry"
                  value={businessForm.values.industry}
                  onChange={businessForm.setValue}
                  placeholder="e.g., Creative Services, Consulting, Retail"
                  icon={Building2}
                />
                <h4 className="font-medium text-navy-900">Business Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Street Address"
                    id="street"
                    value={businessForm.values.street}
                    onChange={businessForm.setValue}
                    icon={MapPin}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      id="city"
                      value={businessForm.values.city}
                      onChange={businessForm.setValue}
                      icon={MapPin}
                    />
                    <InputField
                      label="State"
                      id="state"
                      value={businessForm.values.state}
                      onChange={businessForm.setValue}
                      icon={MapPin}
                    />
                    <InputField
                      label="ZIP Code"
                      id="zip"
                      value={businessForm.values.zip}
                      onChange={businessForm.setValue}
                      icon={MapPin}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button type="button" className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={businessForm.isSubmitting}>
                    {businessForm.isSubmitting ? (
                      <>
                        <span className="spinner spinner-sm" aria-hidden="true" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        )

      case 'personal':
        return (
          <div className="max-w-2xl">
            <SectionCard title="Personal Information" description="Your personal details for tax filing. This information is encrypted and secure.">
              <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="SSN (Last 4 digits)"
                    id="ssn"
                    value={personalForm.values.ssn}
                    onChange={personalForm.setValue}
                    disabled
                    helperText="Full SSN is stored securely"
                    icon={Shield}
                  />
                  <InputField
                    label="Date of Birth"
                    type="date"
                    id="dob"
                    value={personalForm.values.dob}
                    onChange={personalForm.setValue}
                    onBlur={personalForm.setFieldTouched}
                    error={personalForm.errors.dob}
                    touched={personalForm.touched.dob}
                    icon={Calendar}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Filing Status"
                    id="filingStatus"
                    value={personalForm.values.filingStatus}
                    onChange={personalForm.setValue}
                    icon={User}
                  >
                    <select
                      id="filingStatus"
                      value={personalForm.values.filingStatus}
                      onChange={(e) => personalForm.setValue('filingStatus', e.target.value)}
                      className="input"
                    >
                      <option value="single">Single</option>
                      <option value="married_joint">Married Filing Jointly</option>
                      <option value="married_separate">Married Filing Separately</option>
                      <option value="head_of_household">Head of Household</option>
                      <option value="widow">Qualifying Widow(er)</option>
                    </select>
                  </InputField>
                  <InputField
                    label="Dependents"
                    type="number"
                    id="dependents"
                    value={personalForm.values.dependents}
                    onChange={(e) => personalForm.setValue('dependents', parseInt(e.target.value) || 0)}
                    min={0}
                    max={99}
                    icon={User}
                  />
                </div>
                <h4 className="font-medium text-navy-900">Home Address</h4>
                <InputField
                  label="Street Address"
                  id="street"
                  value={personalForm.values.street}
                  onChange={personalForm.setValue}
                  onBlur={personalForm.setFieldTouched}
                  error={personalForm.errors.street}
                  touched={personalForm.touched.street}
                  icon={MapPin}
                />
                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    label="City"
                    id="city"
                    value={personalForm.values.city}
                    onChange={personalForm.setValue}
                    icon={MapPin}
                  />
                  <InputField
                    label="State"
                    id="state"
                    value={personalForm.values.state}
                    onChange={personalForm.setValue}
                    icon={MapPin}
                  />
                  <InputField
                    label="ZIP Code"
                    id="zip"
                    value={personalForm.values.zip}
                    onChange={personalForm.setValue}
                    icon={MapPin}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button type="button" className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={personalForm.isSubmitting}>
                    {personalForm.isSubmitting ? (
                      <>
                        <span className="spinner spinner-sm" aria-hidden="true" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        )

      case 'security':
        return (
          <div className="max-w-2xl space-y-6">
            <SectionCard title="Password" description="Change your account password">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <InputField
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  value=""
                  onChange={() => {}}
                  icon={Key}
                >
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="input pr-12"
                      placeholder="Enter current password"
                      aria-label="Current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600"
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                    </button>
                  </div>
                </InputField>
                <InputField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value=""
                  onChange={handlePasswordChange}
                  icon={Key}
                >
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="input pr-12"
                      placeholder="Enter new password"
                      aria-label="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-1 h-2" role="progressbar" aria-valuenow={passwordStrength} aria-valuemin={0} aria-valuemax={5} aria-label="Password strength">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-full rounded" style={{ 
                          backgroundColor: i <= passwordStrength 
                            ? i <= 2 ? '#DC2626' : i <= 3 ? '#D97706' : '#059669' 
                            : '#E2E8F0' 
                        }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordStrength === 0 ? 'Enter a password' : 
                       passwordStrength <= 2 ? 'Weak' : 
                       passwordStrength <= 3 ? 'Fair' : 
                       passwordStrength <= 4 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                </InputField>
                <InputField
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value=""
                  onChange={() => {}}
                  icon={Key}
                >
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input pr-12"
                      placeholder="Confirm new password"
                      aria-label="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-600"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                    </button>
                  </div>
                </InputField>
                <div className="flex justify-end">
                  <button className="btn btn-primary">
                    <Save size={14} aria-hidden="true" />
                    Update Password
                  </button>
                </div>
              </form>
            </SectionCard>

            <SectionCard title="Two-Factor Authentication" description={twoFactorEnabled ? "2FA is enabled. You'll need a code from your authenticator app to sign in." : 'Add an extra layer of security to your account'}>
              {twoFactorEnabled ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-900">Authenticator App</p>
                    <p className="text-sm text-gray-500">Enabled • Last configured {settings.security.lastPasswordChange}</p>
                  </div>
                  <button onClick={handleDisable2FA} className="btn btn-secondary">
                    Disable 2FA
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-900">Not Enabled</p>
                    <p className="text-sm text-gray-500">Enable 2FA to require a code from your authenticator app when signing in</p>
                  </div>
                  <button onClick={handleEnable2FA} className="btn btn-primary">
                    <Shield size={14} aria-hidden="true" />
                    Enable 2FA
                  </button>
                </div>
              )}
              {twoFactorStep === 1 && (
                <div className="mt-4 p-4 bg-gold-50 border border-gold-200 rounded-lg animate-slide-in-top">
                  <p className="font-medium text-navy-900 mb-2">Scan QR code with your authenticator app</p>
                  <div className="flex justify-center mb-4">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">QR Code</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code from your app:</p>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="input text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setTwoFactorStep(0)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={handleVerify2FA} className="btn btn-primary btn-sm" disabled={totpCode.length !== 6}>
                      Verify & Enable
                    </button>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Active Sessions" description="Manage devices signed into your account">
              <div className="space-y-3">
                {settings.security.sessions.map(session => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    current={session.current}
                    onRevoke={(id) => {
                      showToast({ type: 'success', title: 'Session revoked', message: 'Device has been signed out' })
                    }}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        )

      case 'notifications':
        return (
          <div className="max-w-2xl space-y-6">
            <SectionCard title="Email Notifications" description="Choose which emails you'd like to receive">
              <div className="space-y-4">
                {Object.entries(settings.notifications.email).map(([key, value]) => (
                  <ToggleSwitch
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
                    checked={value}
                    onChange={(v) => handleNotificationChange('email', key, v)}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Push Notifications" description="Receive notifications in the app and on your device">
              <div className="space-y-4">
                {Object.entries(settings.notifications.push).map(([key, value]) => (
                  <ToggleSwitch
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
                    checked={value}
                    onChange={(v) => handleNotificationChange('push', key, v)}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="SMS Notifications" description="Text messages for urgent account updates only">
              <div className="space-y-4">
                {Object.entries(settings.notifications.sms).map(([key, value]) => (
                  <ToggleSwitch
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
                    checked={value}
                    onChange={(v) => handleNotificationChange('sms', key, v)}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="card overflow-hidden" aria-label="Settings navigation">
            <ul className="divide-y divide-gray-200" role="list">
              {settingsSections.map(section => (
                <li key={section.id}>
                  <NavLink
                    to={section.path}
                    className={clsx(
                      'flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors',
                      currentPath === section.id
                        ? 'bg-navy-50 border-r-4 border-navy-600 text-navy-900'
                        : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                    )}
                    aria-current={currentPath === section.id ? 'page' : undefined}
                  >
                    <section.icon size={20} aria-hidden="true" className="flex-shrink-0" />
                    {section.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account Actions */}
          <div className="mt-6 card p-4">
            <h4 className="font-medium text-navy-900 mb-3">Account</h4>
            <div className="space-y-2">
              <button className="btn btn-ghost w-full justify-start gap-3" onClick={() => {}}>
                <Download size={18} aria-hidden="true" />
                Export My Data
              </button>
              <button className="btn btn-ghost w-full justify-start gap-3 text-error" onClick={() => {}}>
                <Trash2 size={18} aria-hidden="true" />
                Delete Account
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-navy-900">{activeSection.label}</h1>
            <p className="text-gray-600 mt-1">
              {activeSection.id === 'profile' && 'Manage your personal profile and account preferences'}
              {activeSection.id === 'business' && 'Update your business information for tax filing'}
              {activeSection.id === 'personal' && 'Your personal details for accurate tax preparation'}
              {activeSection.id === 'security' && 'Manage your password, two-factor authentication, and active sessions'}
              {activeSection.id === 'notifications' && 'Control how and when you receive notifications from Express Tax'}
            </p>
          </div>

          {renderSection()}
        </div>
      </div>

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
