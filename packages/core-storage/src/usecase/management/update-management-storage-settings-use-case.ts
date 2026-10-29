import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateManagementStorageSettingsRequest } from '../../network/api/management/management-storage-settings-api'
import type { ManagementStorageSettingsRepository } from '../../repository/management/management-storage-settings-repository'

/** Updates management storage settings. */
export class UpdateManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link UpdateManagementStorageSettingsUseCase}.
   *
   * @param repository - Management storage settings repository
   */
  public constructor(protected readonly repository: ManagementStorageSettingsRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - DTO containing updated settings properties
   * @returns Updated management storage settings domain model
   */
  public async execute(
    request: UpdateManagementStorageSettingsRequest
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.repository.updateSettings(request)
  }
}
