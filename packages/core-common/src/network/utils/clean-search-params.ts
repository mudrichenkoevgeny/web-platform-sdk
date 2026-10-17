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
  for (const [key, val] of Object.entries(result)) {
    if (typeof val === 'string' && /^\d+$/.test(val.trim())) {
      result[key] = parseInt(val.trim(), 10)
    }
  }
  return result
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/**
 * Strips empty arrays (`[]`), null, undefined, and default pagination/sorting properties from a search parameter object.
 * Prevents TanStack Router and URL query builders from serializing default parameters (e.g., `?pageNumber=1&pageSize=20`).
 *
 * @param params - Search parameter object returned from Zod schema parse
 * @returns Cleaned search parameter object without empty array properties or default pagination
 */
export function cleanSearchParams<T extends object>(params: T): T {
  const result = { ...params } as T & Record<string, unknown>
  for (const [key, val] of Object.entries(params)) {
    if (Array.isArray(val)) {
      if (val.length === 0) {
        delete result[key]
      }
    } else if ((key === 'pageNumber' || key === 'page_number') && val === 1) {
      delete result[key]
    } else if ((key === 'pageSize' || key === 'page_size') && val === 20) {
      delete result[key]
    } else if ((key === 'sortOrder' || key === 'sort_order') && val === 'desc') {
      delete result[key]
    } else if ((key === 'sortBy' || key === 'sort_by') && val === 'created_at') {
      delete result[key]
    } else if (val === null || val === undefined || val === '') {
      delete result[key]
    }
  }
  return result
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
  if (isRecord(parsed)) {
    return cleanSearchParams(parsed)
  }
  return parsed
}
