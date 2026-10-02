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
