import { EncryptedSettings } from '../storage/EncryptedSettings'
import { getSettingsFactory } from '../storage/WebCryptoSettings'

export class EncryptedSettingsComponent {
  public readonly encryptedSettings: EncryptedSettings

  public constructor(storage?: Storage) {
    this.encryptedSettings = getSettingsFactory(storage).create()
  }
}
