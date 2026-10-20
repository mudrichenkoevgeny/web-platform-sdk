import { describe, it, expect } from 'vitest'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAuthProvider, createTestOpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
import { OpenAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/open-auth-settings-repository-mock'

describe('GetAvailableUserAuthProvidersUseCase', () => {
  it('returns hardcoded EMAIL for MANAGEMENT app type', async () => {
    const useCase = new GetAvailableUserAuthProvidersUseCase(AppType.MANAGEMENT)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.primary).toEqual([UserAuthProvider.EMAIL])
    }
  })

  it('fetches providers from repository for CLIENT app type', async () => {
    const mockRepo = new OpenAuthSettingsRepositoryMock()
    mockRepo.openAuthSettingsResult = createTestOpenAuthSettings({
      availableAuthProviders: {
        primary: [UserAuthProvider.EMAIL, UserAuthProvider.PHONE],
        secondary: [UserAuthProvider.GOOGLE]
      }
    })

    const useCase = new GetAvailableUserAuthProvidersUseCase(AppType.CLIENT, mockRepo)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.primary).toEqual([UserAuthProvider.EMAIL, UserAuthProvider.PHONE])
    }
  })
})
