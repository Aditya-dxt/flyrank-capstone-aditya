import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  const onSubmit = vi.fn()

  beforeEach(() => {
    onSubmit.mockReset()
    onSubmit.mockResolvedValue(undefined)
  })

  it('shows empty state when no saved settings exist', () => {
    render(<SettingsForm onSubmit={onSubmit} />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(
      screen.getByText(/haven't configured your settings yet/i),
    ).toBeInTheDocument()
  })

  it('hides empty state when initial values are provided', () => {
    render(
      <SettingsForm
        onSubmit={onSubmit}
        initialValues={{
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          notifications: true,
        }}
      />,
    )

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<SettingsForm onSubmit={onSubmit} isLoading />)

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled()
  })

  it('shows validation errors on blur', async () => {
    const user = userEvent.setup()
    render(<SettingsForm onSubmit={onSubmit} />)

    const nameInput = screen.getByLabelText(/name/i)
    await user.click(nameInput)
    await user.tab()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Name is required',
    )
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(nameInput).toHaveAttribute('aria-describedby', 'settings-name-error')
  })

  it('validates name minimum length on blur', async () => {
    const user = userEvent.setup()
    render(<SettingsForm onSubmit={onSubmit} />)

    const nameInput = screen.getByLabelText(/name/i)
    await user.type(nameInput, 'A')
    await user.tab()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Name must be at least 2 characters',
    )
  })

  it('validates email format on blur', async () => {
    const user = userEvent.setup()
    render(<SettingsForm onSubmit={onSubmit} />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'not-an-email')
    await user.tab()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address',
    )
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute(
      'aria-describedby',
      'settings-email-error',
    )
  })

  it('keeps inputs controlled', async () => {
    const user = userEvent.setup()
    render(<SettingsForm onSubmit={onSubmit} />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const notificationsInput = screen.getByLabelText(/enable notifications/i)

    expect(nameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(notificationsInput).not.toBeChecked()

    await user.type(nameInput, 'Jane Doe')
    await user.type(emailInput, 'jane@example.com')
    await user.click(notificationsInput)

    expect(nameInput).toHaveValue('Jane Doe')
    expect(emailInput).toHaveValue('jane@example.com')
    expect(notificationsInput).toBeChecked()
  })

  it('keeps fields controlled with partial initial values', () => {
    render(<SettingsForm onSubmit={onSubmit} initialValues={{ name: 'Jane' }} />)

    expect(screen.getByLabelText(/^name$/i)).toHaveValue('Jane')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/enable notifications/i)).not.toBeChecked()
  })

  it('submits valid data and shows submitting state', async () => {
    const user = userEvent.setup()
    let resolveSubmit
    onSubmit.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve
        }),
    )

    render(<SettingsForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.click(screen.getByLabelText(/enable notifications/i))

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    await user.click(submitButton)

    expect(
      screen.getByRole('button', { name: /saving/i }),
    ).toBeDisabled()

    resolveSubmit()
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        notifications: true,
      })
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save settings/i }),
      ).not.toBeDisabled()
    })
  })

  it('does not submit when validation fails', async () => {
    const user = userEvent.setup()
    render(<SettingsForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findAllByRole('alert')).not.toHaveLength(0)
  })

  it('associates labels with inputs via htmlFor and id', () => {
    render(<SettingsForm onSubmit={onSubmit} />)

    expect(screen.getByLabelText(/^name$/i)).toHaveAttribute('id', 'settings-name')
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute(
      'id',
      'settings-email',
    )
    expect(screen.getByLabelText(/enable notifications/i)).toHaveAttribute(
      'id',
      'settings-notifications',
    )
  })
})
