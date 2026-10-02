import { EncryptedSettings } from './EncryptedSettings'

export interface SettingsFactory {
  create(): EncryptedSettings
}
