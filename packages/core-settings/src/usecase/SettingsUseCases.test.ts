import { describe, it, expect } from 'vitest'
import { GetOpenGlobalSettingsUseCase } from './GetOpenGlobalSettingsUseCase'
import { RefreshOpenGlobalSettingsUseCase } from './RefreshOpenGlobalSettingsUseCase'
import { OpenGlobalSettingsRepositoryMock } from '@/mock/repository/OpenGlobalSettingsRepositoryMock'

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
