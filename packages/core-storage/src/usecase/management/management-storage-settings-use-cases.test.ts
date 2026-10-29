import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsRepository } from '../../repository/management/management-storage-settings-repository'
import { GetManagementStorageSettingsUseCase } from './get-management-storage-settings-use-case'
import { RefreshManagementStorageSettingsUseCase } from './refresh-management-storage-settings-use-case'
import { ResetManagementStorageSettingsUseCase } from './reset-management-storage-settings-use-case'
import { UpdateManagementStorageSettingsUseCase } from './update-management-storage-settings-use-case'
import { ObserveManagementStorageSettingsUseCase } from './observe-management-storage-settings-use-case'

describe('Management Storage Settings UseCases', () => {
  let repository: ManagementStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      observeSettings: vi.fn()
    }
  })

  it('delegates GetManagementStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.getSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new GetManagementStorageSettingsUseCase(repository)
    await useCase.execute()
    expect(repository.getSettings).toHaveBeenCalled()
  })

  it('delegates RefreshManagementStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.refreshSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new RefreshManagementStorageSettingsUseCase(repository)
    await useCase.execute()
    expect(repository.refreshSettings).toHaveBeenCalled()
  })

  it('delegates ResetManagementStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.resetSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new ResetManagementStorageSettingsUseCase(repository)
    await useCase.execute()
    expect(repository.resetSettings).toHaveBeenCalled()
  })

  it('delegates UpdateManagementStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.updateSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new UpdateManagementStorageSettingsUseCase(repository)
    await useCase.execute({ maxUploadSizeBytes: 1000 })
    expect(repository.updateSettings).toHaveBeenCalledWith({ maxUploadSizeBytes: 1000 })
  })

  it('delegates ObserveManagementStorageSettingsUseCase to repository', () => {
    const observer = vi.fn()
    const useCase = new ObserveManagementStorageSettingsUseCase(repository)
    useCase.execute(observer)
    expect(repository.observeSettings).toHaveBeenCalledWith(observer)
  })
})
