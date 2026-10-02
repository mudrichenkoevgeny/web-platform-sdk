export type StorageChangeListener = (value: string | null) => void

export interface EncryptedSettings {
  put(key: string, value: string): Promise<void>
  get(key: string): Promise<string | null>
  remove(key: string): Promise<void>
  observe(key: string, listener: StorageChangeListener): () => void
}
