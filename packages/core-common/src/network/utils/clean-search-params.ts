/**
 * Coerces stringified numeric properties in raw URL query parameter objects (e.g. `pageNumber: "2"`) into numbers.
 * Allows Zod `z.number()` schemas to parse search parameters directly from URL strings without failing.
 *
 * @param raw - Raw search parameter object from TanStack Router
 * @returns Object with stringified integers coerced to numbers
 */
export function coerceSearchNumbers(raw: Record<string, unknown>): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const result: Record<string, unknown> = { ...raw }
  for (const key of Object.keys(result)) {
    const val = result[key]
    if (typeof val === 'string' && /^\d+$/.test(val.trim())) {
      result[key] = parseInt(val.trim(), 10)
    }
  }
  return result
}

/**
 * Strips empty arrays (`[]`), null, undefined, and default pagination/sorting properties from a search parameter object.
 * Prevents TanStack Router and URL query builders from serializing default parameters (e.g., `?pageNumber=1&pageSize=20`).
 *
 * @param params - Search parameter object returned from Zod schema parse
 * @returns Cleaned search parameter object without empty array properties or default pagination
 */
export function cleanSearchParams<T extends object>(params: T): T {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(params)) {
    const val = (params as Record<string, unknown>)[key]
    if (Array.isArray(val)) {
      if (val.length > 0) {
        result[key] = val
      }
    } else if (key === 'pageNumber' && val === 1) {
      // Omit default pageNumber = 1 from URL query
      continue
    } else if (key === 'pageSize' && val === 20) {
      // Omit default pageSize = 20 from URL query
      continue
    } else if (val !== null && val !== undefined) {
      result[key] = val
    }
  }
  return result as T
}

/**
 * Coerces raw URL query strings and validates them against a Zod schema while stripping defaults and empty arrays.
 *
 * @param schema - Zod schema with parse method
 * @param rawSearch - Raw search parameter dictionary from TanStack Router
 * @returns Validated, coerced, and cleaned search parameter object
 */
export function parseSearchParams<T>(
  schema: { parse: (val: unknown) => T },
  rawSearch: Record<string, unknown>
): T {
  const coerced = coerceSearchNumbers(rawSearch)
  const parsed = schema.parse(coerced)
  return cleanSearchParams(parsed as object) as T
}
