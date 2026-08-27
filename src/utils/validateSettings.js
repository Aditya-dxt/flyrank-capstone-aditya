import { z } from 'zod'

export const settingsSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  notifications: z.boolean(),
})

export const defaultSettings = {
  name: '',
  email: '',
  notifications: false,
}

export function hasSavedSettings(values) {
  if (!values) return false
  return Boolean(values.name?.trim() || values.email?.trim())
}
