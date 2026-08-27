import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  settingsSchema,
  defaultSettings,
  hasSavedSettings,
} from '../utils/validateSettings'

function FieldError({ id, message }) {
  if (!message) return null

  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-600">
      {message}
    </p>
  )
}

export default function SettingsForm({
  initialValues,
  onSubmit,
  isLoading = false,
}) {
  const isEmpty = !hasSavedSettings(initialValues)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    // Merging protects controlled inputs when callers supply partial values.
    defaultValues: { ...defaultSettings, ...initialValues },
    mode: 'onBlur',
  })

  const handleFormSubmit = async (data) => {
    await onSubmit(data)
  }

  const submitting = isSubmitting

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="mx-auto w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      aria-busy={isLoading || submitting}
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        {isEmpty && !isLoading && (
          <p
            className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600"
            data-testid="empty-state"
          >
            You haven&apos;t configured your settings yet. Fill in the form
            below to get started.
          </p>
        )}
        {isLoading && (
          <p
            className="mt-2 text-sm text-gray-500"
            data-testid="loading-state"
            aria-live="polite"
          >
            Loading settings…
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="settings-name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="settings-name"
              type="text"
              autoComplete="name"
              disabled={isLoading || submitting}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'settings-name-error' : undefined}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 aria-[invalid=true]:border-red-500"
            />
          )}
        />
        <FieldError id="settings-name-error" message={errors.name?.message} />
      </div>

      <div>
        <label
          htmlFor="settings-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="settings-email"
              type="email"
              autoComplete="email"
              disabled={isLoading || submitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={
                errors.email ? 'settings-email-error' : undefined
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 aria-[invalid=true]:border-red-500"
            />
          )}
        />
        <FieldError id="settings-email-error" message={errors.email?.message} />
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="settings-notifications"
          className="text-sm font-medium text-gray-700"
        >
          Enable notifications
        </label>
        <Controller
          name="notifications"
          control={control}
          render={({ field: { value, onChange, onBlur, name, ref } }) => (
            <input
              id="settings-notifications"
              name={name}
              ref={ref}
              type="checkbox"
              checked={value}
              onChange={(event) => onChange(event.target.checked)}
              onBlur={onBlur}
              disabled={isLoading || submitting}
              aria-invalid={errors.notifications ? 'true' : 'false'}
              aria-describedby={
                errors.notifications ? 'settings-notifications-error' : undefined
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        />
      </div>
      <FieldError
        id="settings-notifications-error"
        message={errors.notifications?.message}
      />

      <button
        type="submit"
        disabled={isLoading || submitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {submitting ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  )
}
