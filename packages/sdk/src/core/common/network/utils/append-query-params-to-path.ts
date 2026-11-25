/**
 * Interface contract for screen parameter models that can serialize themselves to a query map.
 */
export interface NavigationScreenParams {
  toQueryMap(): Record<string, string[]> | Map<string, string[]> | Record<string, unknown>
}

const camelToSnake = (str: string): string => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

/**
 * Combines a base route path with a query parameters map or {@link NavigationScreenParams} into a fully formatted URL string.
 *
 * @param basePath - Base API route path (e.g. "/management/audit/events")
 * @param params - NavigationScreenParams or Map/Record of query parameter keys to list of string values
 * @returns Formatted URL path with search string
 */
export const appendQueryParamsToPath = (
  basePath: string,
  params?: NavigationScreenParams | Record<string, string[]> | Map<string, string[]> | Record<string, unknown> | object | null
): string => {
  if (!params) return basePath

  const queryMap =
    typeof params === 'object' && params !== null && 'toQueryMap' in params && typeof params.toQueryMap === 'function'
      ? params.toQueryMap()
      : params

  if (!queryMap) return basePath

  const entries = queryMap instanceof Map ? Array.from(queryMap.entries()) : Object.entries(queryMap)
  if (entries.length === 0) return basePath

  const query = new URLSearchParams()
  entries.forEach(([key, values]) => {
    const snakeKey = camelToSnake(key)
    if (Array.isArray(values)) {
      values.forEach((val) => {
        if (val != null && val !== '') {
          query.append(snakeKey, String(val))
        }
      })
    } else if (values != null && values !== '') {
      query.append(snakeKey, String(values))
    }
  })

  const queryString = query.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}
