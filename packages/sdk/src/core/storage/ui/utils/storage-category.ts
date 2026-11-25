import { StorageCategory } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Type guard validating whether a string value is a valid {@link StorageCategory} enum value.
 *
 * @param value - Candidate string to validate
 * @returns True if value is a valid StorageCategory
 */
export const isStorageCategory = (value: string): value is StorageCategory => {
  return Object.values(StorageCategory).some((v) => v === value)
}
