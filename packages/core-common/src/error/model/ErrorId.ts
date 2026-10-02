export type ErrorId = string & { readonly __brand: 'ErrorId' }

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const generateErrorId = (): ErrorId => {
  return crypto.randomUUID() as ErrorId
}

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

export const toErrorIdOrThrow = (value: string): ErrorId => {
  const trimmed = value.trim()
  if (!UUID_REGEX.test(trimmed)) {
    throw new Error(`Invalid ErrorId UUID format: ${value}`)
  }
  return trimmed as ErrorId
}
