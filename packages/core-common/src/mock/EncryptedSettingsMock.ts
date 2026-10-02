import { EncryptedSettings, StorageChangeListener } from '../storage/EncryptedSettings'

export class EncryptedSettingsMock implements EncryptedSettings {
  private readonly store = new Map<string, string>()
  private readonly listeners = new Map<string, Set<StorageChangeListener>>()

  public async put(key: string, value: string): Promise<void> {
    this.store.set(key, value)
    this.notifyListeners(key, value)
  }

  public async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null
  }

  public async remove(key: string): Promise<void> {
    this.store.delete(key)
    this.notifyListeners(key, null)
  }

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

export const createInMemoryEncryptedSettings = (): EncryptedSettings => {
  return new EncryptedSettingsMock()
}
