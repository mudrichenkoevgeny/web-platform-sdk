import { EncryptedSettings } from '@/storage/EncryptedSettings'
import type { StorageChangeListener } from "@/storage/EncryptedSettings";

/**
 * Mock in-memory implementation of {@link EncryptedSettings} for testing key-value persistence without WebCrypto or LocalStorage.
 */
export class EncryptedSettingsMock implements EncryptedSettings {
  private readonly store = new Map<string, string>()
  private readonly listeners = new Map<string, Set<StorageChangeListener>>()

  /**
   * Stores a key-value pair in memory and notifies observers.
   *
   * @param key - Storage key
   * @param value - String value to store
   */
  public async put(key: string, value: string): Promise<void> {
    this.store.set(key, value)
    this.notifyListeners(key, value)
  }

  /**
   * Retrieves a stored value by key.
   *
   * @param key - Storage key
   * @returns Stored string value or null if absent
   */
  public async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null
  }

  /**
   * Removes a key-value pair from storage and notifies observers.
   *
   * @param key - Storage key
   */
  public async remove(key: string): Promise<void> {
    this.store.delete(key)
    this.notifyListeners(key, null)
  }

  /**
   * Registers an observer function for key changes.
   *
   * @param key - Storage key to observe
   * @param listener - Callback invoked on key value updates
   * @returns Unsubscribe function
   */
  public observe(key: string, listener: StorageChangeListener): () => void {
    let keyListeners = this.listeners.get(key)
    if (!keyListeners) {
      keyListeners = new Set<StorageChangeListener>()
      this.listeners.set(key, keyListeners)
    }

    keyListeners.add(listener)

    return () => {
      const currentListeners = this.listeners.get(key)
      if (currentListeners) {
        currentListeners.delete(listener)
        if (currentListeners.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  private notifyListeners(key: string, value: string | null): void {
    const keyListeners = this.listeners.get(key)
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener(value)
      }
    }
  }
}

/**
 * Factory helper function to instantiate a new {@link EncryptedSettingsMock}.
 *
 * @returns Fresh instance of EncryptedSettingsMock
 */
export const createInMemoryEncryptedSettings = (): EncryptedSettings => {
  return new EncryptedSettingsMock()
}
