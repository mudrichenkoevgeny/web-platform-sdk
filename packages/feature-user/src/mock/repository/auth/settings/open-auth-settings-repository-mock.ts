import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { OpenAuthSettingsRepository } from '@/repository/auth/settings/open-auth-settings-repository'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Mock implementation of {@link OpenAuthSettingsRepository}.
 */
export class OpenAuthSettingsRepositoryMock implements OpenAuthSettingsRepository {
  private currentSettings: OpenAuthSettings | null = null
  private readonly listeners = new Set<(settings: OpenAuthSettings | null) => void>()

  public resultProvider: () => Promise<AppResult<OpenAuthSettings, AppError>> = async () => {
    if (this.currentSettings) {
      return appResultSuccess(this.currentSettings)
    }
    return appResultFailure(
      CommonError.contractViolation(
        new Error('No mock settings provided. Call emit() or updateOpenAuthSettings() first.')
      )
    )
  }

  public async getOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.resultProvider()
  }

  public async refreshOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    return this.resultProvider()
  }

  public async updateOpenAuthSettings(authSettings: OpenAuthSettings): Promise<void> {
    this.currentSettings = authSettings
    this.notifyListeners()
  }

  public observeOpenAuthSettings(listener: (settings: OpenAuthSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.currentSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(authSettings: OpenAuthSettings): void {
    this.currentSettings = authSettings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentSettings)
    }
  }
}
