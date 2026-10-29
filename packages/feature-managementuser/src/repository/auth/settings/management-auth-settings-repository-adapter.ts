import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings, OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementAuthSettingsRepository } from './management-auth-settings-repository'

/**
 * Adapter converting {@link ManagementAuthSettingsRepository} to the {@link OpenAuthSettingsRepository} contract.
 */
export class ManagementAuthSettingsRepositoryAdapter implements OpenAuthSettingsRepository {
  /**
   * Constructs a new {@link ManagementAuthSettingsRepositoryAdapter}.
   *
   * @param repository - Underlying management auth settings repository
   */
  public constructor(private readonly repository: ManagementAuthSettingsRepository) {}

  /**
   * Retrieves open auth settings by delegating to management auth settings repository.
   *
   * @returns AppResult containing {@link OpenAuthSettings}
   */
  public async getOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.repository.getManagementAuthSettings()
  }

  /**
   * Forces a fresh fetch of open auth settings.
   *
   * @returns AppResult containing fresh {@link OpenAuthSettings}
   */
  public async refreshOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.repository.refreshManagementAuthSettings()
  }

  /**
   * Updates cached open auth settings by merging updated open fields with current management settings.
   *
   * @param authSettings - Updated settings model
   */
  public async updateOpenAuthSettings(authSettings: OpenAuthSettings): Promise<void> {
    const currentResult = await this.repository.getManagementAuthSettings()
    if (currentResult.success) {
      const merged: ManagementAuthSettings = {
        ...currentResult.data,
        ...authSettings
      }
      await this.repository.updateManagementAuthSettings(merged)
    }
  }

  /**
   * Registers an observer callback for open auth settings changes.
   *
   * @param listener - Observer callback
   * @returns Unsubscribe function
   */
  public observeOpenAuthSettings(listener: (settings: OpenAuthSettings | null) => void): () => void {
    return this.repository.observeManagementAuthSettings(listener)
  }
}
