/** Observer callback signature for key-value changes. */
export type StorageChangeListener = (value: string | null) => void

/**
 * Interface for encrypted key-value settings storage.
 */
export interface EncryptedSettings {
  /**
   * Persists a string value for the given key asynchronously.
   *
   * @param key - Storage key
   * @param value - String value to store
   * @returns Promise resolving when put operation completes
   */
  put(key: string, value: string): Promise<void>

  /**
   * Retrieves a string value by key asynchronously.
   *
   * @param key - Storage key
   * @returns Promise resolving to stored string or null if not found
   */
  get(key: string): Promise<string | null>

  /**
   * Removes a stored entry by key asynchronously.
   *
   * @param key - Storage key
   * @returns Promise resolving when removal completes
   */
  remove(key: string): Promise<void>

  /**
   * Registers an observer for updates to a specific storage key.
   *
   * @param key - Target storage key
   * @param listener - Callback triggered on key update
   * @returns Unsubscribe function
   */
  observe(key: string, listener: StorageChangeListener): () => void
}
