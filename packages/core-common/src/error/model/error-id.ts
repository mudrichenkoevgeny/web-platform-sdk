/**
 * Branded string type representing a valid ErrorId UUID.
 */
export type ErrorId = string & { readonly __brand: 'ErrorId' }

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Generates a new random {@link ErrorId} UUID.
 *
 * @returns Freshly generated random ErrorId
 */
export const generateErrorId = (): ErrorId => {
  return crypto.randomUUID() as ErrorId
}

/**
 * Converts a raw string to an {@link ErrorId} or returns null if invalid or absent.
 *
 * @param value - Optional raw string value to validate
 * @returns Validated ErrorId or null
 */
export const toErrorIdOrNull = (value?: string | null): ErrorId | null => {
  if (value === null || value === undefined) {
    return null
  }
  const trimmed = value.trim()
  if (!UUID_REGEX.test(trimmed)) {
    return null
  }
  return trimmed as ErrorId
}

/**
 * Converts a raw string to an {@link ErrorId} or throws an error if the format is invalid.
 *
 * @param value - Raw string value to parse
 * @returns Validated ErrorId
 * @throws Error if the value is not a valid UUID format
 */
export const toErrorIdOrThrow = (value: string): ErrorId => {
  const trimmed = value.trim()
  if (!UUID_REGEX.test(trimmed)) {
    throw new Error(`Invalid ErrorId UUID format: ${value}`)
  }
  return trimmed as ErrorId
}
