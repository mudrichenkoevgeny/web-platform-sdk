/**
 * Inspects an unknown error to check if it represents a missing internet connection.
 *
 * @param e - Unknown thrown error or value
 * @returns True if the error indicates no internet connection, false otherwise
 */
export const isNoInternetException = (e: unknown): boolean => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true
  }

  if (e instanceof Error) {
    const message = e.message.toLowerCase()
    return (
      message.includes('failed to fetch') ||
      message.includes('network error') ||
      message.includes('networkerror') ||
      message.includes('internet')
    )
  }

  return false
}
