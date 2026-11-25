/**
 * Safely extracts and formats an application error argument as a string.
 *
 * @param args - Record containing error arguments
 * @param key - Argument key to extract
 * @returns Trimmed string representation of the argument, or null if invalid or missing
 */
export const getAppErrorArgAsString = (args: Record<string, unknown> | undefined | null, key: string): string | null => {
  if (!args) {
    return null
  }
  const value = args[key]
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return null
}

/**
 * Safely extracts and formats an application error argument as a number.
 *
 * @param args - Record containing error arguments
 * @param key - Argument key to extract
 * @returns Numeric representation of the argument, or null if invalid or missing
 */
export const getAppErrorArgAsNumber = (args: Record<string, unknown> | undefined | null, key: string): number | null => {
  if (!args) {
    return null
  }
  const value = args[key]
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  return null
}
