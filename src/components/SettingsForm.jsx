import { useState } from 'react'
import {
  INITIAL_SETTINGS,
  hasErrors,
  validateSettings,
} from '../utils/validateSettings'

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
]

function FormField({ id, label, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50'

const inputErrorClassName =
  'border-red-400 focus:border-red-500 focus:ring-red-500/20'

export default function SettingsForm() {
  const [values, setValues] = useState(INITIAL_SETTINGS)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setValues((prev) => {
      const nextValues = { ...prev, [name]: nextValue }

      if (touched[name]) {
        const fieldErrors = validateSettings(nextValues)
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldErrors[name],
        }))
      }

      return nextValues
    })
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    setValues((currentValues) => {
      const fieldErrors = validateSettings(currentValues)
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name],
      }))
      return currentValues
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatus('idle')

    const validationErrors = validateSettings(values)
    setErrors(validationErrors)
    setTouched({
      fullName: true,
      email: true,
      company: true,
      website: true,
      timezone: true,
    })

    if (hasErrors(validationErrors)) {
      return
    }

    setStatus('saved')
  }

  function handleReset() {
    setValues(INITIAL_SETTINGS)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <header className="space-y-1 border-b border-slate-100 pb-5">
        <h1 className="text-xl font-semibold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your profile and notification preferences for FlyRank.
        </p>
      </header>

      <div className="space-y-4">
        <FormField id="fullName" label="Full name" error={touched.fullName && errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            className={`${inputClassName} ${touched.fullName && errors.fullName ? inputErrorClassName : ''}`}
            placeholder="Jane Doe"
          />
        </FormField>

        <FormField id="email" label="Email address" error={touched.email && errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`${inputClassName} ${touched.email && errors.email ? inputErrorClassName : ''}`}
            placeholder="jane@company.com"
          />
        </FormField>

        <FormField id="company" label="Company" hint="Optional">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName}
            placeholder="Acme Inc."
          />
        </FormField>

        <FormField
          id="website"
          label="Website"
          error={touched.website && errors.website}
          hint="Optional — include https://"
        >
          <input
            id="website"
            name="website"
            type="url"
            autoComplete="url"
            value={values.website}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.website && errors.website)}
            aria-describedby={errors.website ? 'website-error' : undefined}
            className={`${inputClassName} ${touched.website && errors.website ? inputErrorClassName : ''}`}
            placeholder="https://example.com"
          />
        </FormField>

        <FormField id="timezone" label="Timezone" error={touched.timezone && errors.timezone}>
          <select
            id="timezone"
            name="timezone"
            value={values.timezone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.timezone && errors.timezone)}
            aria-describedby={errors.timezone ? 'timezone-error' : undefined}
            className={`${inputClassName} ${touched.timezone && errors.timezone ? inputErrorClassName : ''}`}
          >
            <option value="">Select a timezone</option>
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            checked={values.emailNotifications}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <label htmlFor="emailNotifications" className="text-sm font-medium text-slate-700">
              Email notifications
            </label>
            <p className="text-xs text-slate-500">
              Receive weekly SEO performance reports and campaign updates.
            </p>
          </div>
        </div>
      </div>

      {status === 'saved' && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          Settings saved successfully.
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save settings
        </button>
      </div>
    </form>
  )
}
