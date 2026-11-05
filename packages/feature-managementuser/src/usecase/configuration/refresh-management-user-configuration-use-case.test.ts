import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { OpenStorageSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { AuthStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'
import { createTestManagementUserConfigurationPayload, createTestSessionToken } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/management-auth-settings-repository-mock'
import { RefreshManagementUserConfigurationUseCase } from './refresh-management-user-configuration-use-case'

describe('RefreshManagementUserConfigurationUseCase', () => {
  it('fetches user configuration and updates repositories on success when unauthenticated', async () => {
    const configurationPayload = createTestManagementUserConfigurationPayload()

    const mockApi: ManagementUserConfigurationApi = {
      getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload)),
      getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload))
    }

    const globalRepo = new OpenGlobalSettingsRepositoryMock()
    const securityRepo = new OpenSecuritySettingsRepositoryMock()
    const storageRepo = new OpenStorageSettingsRepositoryMock()
    const authRepo = new ManagementAuthSettingsRepositoryMock()
    const authStorage = new AuthStorageMock()

    const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
    const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
    const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')

    const useCase = new RefreshManagementUserConfigurationUseCase(
      mockApi,
      globalRepo,
      securityRepo,
      storageRepo,
      authRepo,
      authStorage
    )

    const refreshConfigResult = await useCase.execute()

    expect(isSuccess(refreshConfigResult)).toBe(true)
    expect(mockApi.getOpenUserConfiguration).toHaveBeenCalledTimes(1)
    expect(updateGlobalSpy).toHaveBeenCalledTimes(1)
    expect(updateSecuritySpy).toHaveBeenCalledTimes(1)
    expect(updateStorageSpy).toHaveBeenCalledTimes(1)
  })

  it('fetches authenticated configuration when active session exists', async () => {
    const configurationPayload = createTestManagementUserConfigurationPayload()

    const mockApi: ManagementUserConfigurationApi = {
      getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload)),
      getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload))
    }

    const globalRepo = new OpenGlobalSettingsRepositoryMock()
    const securityRepo = new OpenSecuritySettingsRepositoryMock()
    const storageRepo = new OpenStorageSettingsRepositoryMock()
    const authRepo = new ManagementAuthSettingsRepositoryMock()
    const authStorage = new AuthStorageMock()
    await authStorage.updateTokens(createTestSessionToken())

    const useCase = new RefreshManagementUserConfigurationUseCase(
      mockApi,
      globalRepo,
      securityRepo,
      storageRepo,
      authRepo,
      authStorage
    )

    const refreshConfigResult = await useCase.execute()

    expect(isSuccess(refreshConfigResult)).toBe(true)
    expect(mockApi.getManagementUserConfiguration).toHaveBeenCalledTimes(1)
  })

  it('returns failure and skips repository updates on API error', async () => {
    const mockApi: ManagementUserConfigurationApi = {
      getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown())),
      getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown()))
    }

    const globalRepo = new OpenGlobalSettingsRepositoryMock()
    const securityRepo = new OpenSecuritySettingsRepositoryMock()
    const storageRepo = new OpenStorageSettingsRepositoryMock()
    const authRepo = new ManagementAuthSettingsRepositoryMock()
    const authStorage = new AuthStorageMock()

    const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
    const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
    const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')

    const useCase = new RefreshManagementUserConfigurationUseCase(
      mockApi,
      globalRepo,
      securityRepo,
      storageRepo,
      authRepo,
      authStorage
    )

    const refreshConfigResult = await useCase.execute()

    expect(refreshConfigResult.success).toBe(false)
    expect(updateGlobalSpy).not.toHaveBeenCalled()
    expect(updateSecuritySpy).not.toHaveBeenCalled()
    expect(updateStorageSpy).not.toHaveBeenCalled()
  })
})
