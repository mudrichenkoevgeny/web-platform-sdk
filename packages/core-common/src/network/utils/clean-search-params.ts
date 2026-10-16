/**
 * Strips empty arrays (`[]`), null, and undefined values from a search parameter object.
 * Prevents TanStack Router and URL query builders from serializing empty filter arrays (e.g., `?identifiers=%5B%5D`).
 *
 * @param params - Search parameter object returned from Zod schema parse
 * @returns Cleaned search parameter object without empty array properties
 */
export function cleanSearchParams<T extends object>(params: T): T {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(params)) {
    const val = (params as Record<string, unknown>)[key]
    if (Array.isArray(val)) {
      if (val.length > 0) {
        result[key] = val
      }
    } else if (val !== null && val !== undefined) {
      result[key] = val
    }
  }
  return result as T
}
