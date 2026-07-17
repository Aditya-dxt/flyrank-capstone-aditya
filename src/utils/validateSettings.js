const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

export const INITIAL_SETTINGS = {
  fullName: '',
  email: '',
  company: '',
  website: '',
  timezone: '',
  emailNotifications: true,
}

export function validateSettings(values) {
  const errors = {}

  const fullName = values.fullName.trim()
  if (!fullName) {
    errors.fullName = 'Full name is required.'
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  const website = values.website.trim()
  if (website && !URL_PATTERN.test(website)) {
    errors.website = 'Enter a valid URL starting with http:// or https://.'
  }

  if (!values.timezone) {
    errors.timezone = 'Select a timezone.'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
