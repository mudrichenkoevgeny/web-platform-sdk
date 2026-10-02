import { EncryptedSettings, StorageChangeListener } from './EncryptedSettings'
import { SettingsFactory } from './SettingsFactory'

const MASTER_KEY_STORAGE_KEY = '__sdk_master_key__'

export class WebCryptoSettings implements EncryptedSettings {
  private readonly storage: Storage
  private readonly listeners = new Map<string, Set<StorageChangeListener>>()
  private cryptoKeyPromise: Promise<CryptoKey> | null = null

  public constructor(storage: Storage = window.localStorage) {
    this.storage = storage
    this.initStorageEventListener()
  }

  public async put(key: string, value: string): Promise<void> {
    const cryptoKey = await this.getOrCreateCryptoKey()
    const encoder = new TextEncoder()
    const encodedData = encoder.encode(value)

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedData
    )

    const ivBase64 = this.arrayBufferToBase64(iv.buffer)
    const encryptedBase64 = this.arrayBufferToBase64(encryptedBuffer)
    const payload = `${ivBase64}:${encryptedBase64}`

    this.storage.setItem(key, payload)
    this.notifyListeners(key, value)
  }

  public async get(key: string): Promise<string | null> {
    const payload = this.storage.getItem(key)
    if (!payload) {
      return null
    }

    const parts = payload.split(':')
    if (parts.length !== 2) {
      return null
    }

    const [ivBase64, encryptedBase64] = parts
    if (!ivBase64 || !encryptedBase64) {
      return null
    }

    try {
      const cryptoKey = await this.getOrCreateCryptoKey()
      const iv = new Uint8Array(this.base64ToArrayBuffer(ivBase64))
      const encryptedBuffer = this.base64ToArrayBuffer(encryptedBase64)

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedBuffer
      )

      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch {
      return null
    }
  }

  public async remove(key: string): Promise<void> {
    this.storage.removeItem(key)
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

  private async getOrCreateCryptoKey(): Promise<CryptoKey> {
    if (this.cryptoKeyPromise) {
      return this.cryptoKeyPromise
    }

    this.cryptoKeyPromise = (async () => {
      const storedKeyJwk = this.storage.getItem(MASTER_KEY_STORAGE_KEY)
      if (storedKeyJwk) {
        try {
          const jwk = JSON.parse(storedKeyJwk) as JsonWebKey
          return await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
          )
        } catch {
          this.storage.removeItem(MASTER_KEY_STORAGE_KEY)
        }
      }

      const newKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )

      const exportedJwk = await crypto.subtle.exportKey('jwk', newKey)
      this.storage.setItem(MASTER_KEY_STORAGE_KEY, JSON.stringify(exportedJwk))

      return newKey
    })()

    return this.cryptoKeyPromise
  }

  private notifyListeners(key: string, value: string | null): void {
    const keyListeners = this.listeners.get(key)
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener(value)
      }
    }
  }

  private initStorageEventListener(): void {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', (event) => {
        if (event.key === null) {
          for (const keyListeners of this.listeners.values()) {
            for (const listener of keyListeners) {
              listener(null)
            }
          }
        } else {
          this.get(event.key).then((newValue) => {
            this.notifyListeners(event.key as string, newValue)
          })
        }
      })
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    return btoa(binary)
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}

export class WebCryptoSettingsFactory implements SettingsFactory {
  public constructor(private readonly storage?: Storage) {}

  public create(): EncryptedSettings {
    return new WebCryptoSettings(this.storage)
  }
}

export const getSettingsFactory = (storage?: Storage): SettingsFactory => {
  return new WebCryptoSettingsFactory(storage)
}
