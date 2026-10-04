/** Header name set when an API call is marked as public (unauthenticated). */
export const IS_PUBLIC_API_HEADER = 'X-Is-Public-Api'

/**
 * Marks request options as a public (unauthenticated) API call.
 *
 * @param init - Request init options
 * @returns Updated request init options containing public API header
 */
export const markAsPublic = (init: RequestInit = {}): RequestInit => {
  const headers = new Headers(init.headers)
  headers.set(IS_PUBLIC_API_HEADER, 'true')
  return {
    ...init,
    headers
  }
}
