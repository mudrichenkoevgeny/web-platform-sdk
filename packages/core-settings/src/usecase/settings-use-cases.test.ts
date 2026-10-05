import { describe, it, expect } from 'vitest'
import { GetOpenGlobalSettingsUseCase } from '@/usecase/get-open-global-settings-use-case'
import { RefreshOpenGlobalSettingsUseCase } from '@/usecase/refresh-open-global-settings-use-case'
import { OpenGlobalSettingsRepositoryMock } from '@/mock/repository/open-global-settings-repository-mock'

describe('Settings Use Cases', () => {
  describe('GetOpenGlobalSettingsUseCase', () => {
    it('delegates to repository get method', async () => {
      const repo = new OpenGlobalSettingsRepositoryMock()
      const useCase = new GetOpenGlobalSettingsUseCase(repo)

      expect(repo.getCallCount).toBe(0)
      const result = await useCase.execute()

      expect(repo.getCallCount).toBe(1)
      expect(result.success).toBe(true)
    })
  })

  describe('RefreshOpenGlobalSettingsUseCase', () => {
    it('delegates to repository refresh method', async () => {
      const repo = new OpenGlobalSettingsRepositoryMock()
      const useCase = new RefreshOpenGlobalSettingsUseCase(repo)

      expect(repo.refreshCallCount).toBe(0)
      const result = await useCase.execute()

      expect(repo.refreshCallCount).toBe(1)
      expect(result.success).toBe(true)
    })
  })
})
