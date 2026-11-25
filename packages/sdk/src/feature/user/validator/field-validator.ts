/**
 * Utility helper for client-side field validation (email, phone, TOTP, name).
 */
export const FieldValidator = {
  /**
   * Validates whether the given string is a syntactically valid email address.
   *
   * @param email - Email string to validate
   * @returns True if valid email format, false otherwise
   */
  isValidEmail: (email?: string | null): boolean => {
    if (!email) {
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  },

  /**
   * Validates whether the given string is a syntactically valid phone number.
   *
   * @param phone - Phone number string to validate
   * @returns True if valid phone format, false otherwise
   */
  isValidPhone: (phone?: string | null): boolean => {
    if (!phone) {
      return false
    }
    const phoneRegex = /^\+?[1-9]\d{6,14}$/
    return phoneRegex.test(phone.replace(/[\s()-]/g, ''))
  },

  /**
   * Validates whether the given string is a valid TOTP code (typically 6 digits).
   *
   * @param totp - TOTP code string to validate
   * @returns True if valid TOTP format, false otherwise
   */
  isValidTotp: (totp?: string | null): boolean => {
    if (!totp) {
      return false
    }
    const totpRegex = /^\d{6}$/
    return totpRegex.test(totp.trim())
  },

  /**
   * Validates whether the given string is a valid person or display name.
   *
   * @param name - Name string to validate
   * @returns True if non-blank and within reasonable length, false otherwise
   */
  isValidName: (name?: string | null): boolean => {
    if (!name) {
      return false
    }
    const trimmed = name.trim()
    return trimmed.length >= 2 && trimmed.length <= 100
  }
}
