import { describe, it, expect } from 'vitest'
import { RefreshOpenSecuritySettingsUseCase } from './RefreshOpenSecuritySettingsUseCase'
import { ValidatePasswordUseCase } from './ValidatePasswordUseCase'
import { PasswordPolicyValidator } from '@/domain/model/PasswordPolicyValidator'
import { OpenSecuritySettingsRepositoryMock } from '@/mock/repository/OpenSecuritySettingsRepositoryMock'
import { ClientSecurityErrorCodes } from '@/error/naming/ClientSecurityErrorCodes'
import { SecurityError } from '@/error/model/SecurityError'

describe('Security Use Cases', () => {
  describe('RefreshOpenSecuritySettingsUseCase', () => {
    it('delegates to repository refresh method', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock()
      const useCase = new RefreshOpenSecuritySettingsUseCase(repo)

      expect(repo.refreshCallCount).toBe(0)
      const result = await useCase.execute()

      expect(repo.refreshCallCount).toBe(1)
      expect(result.success).toBe(true)
    })
  })

  describe('ValidatePasswordUseCase', () => {
    it('validates password successfully using repository policy', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock()
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      const result = await useCase.execute('Valid123!')
      expect(result.success).toBe(true)
    })

    it('returns SecurityError if password fails validation', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock()
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      const result = await useCase.execute('short')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect((result.error as SecurityError).code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_SHORT)
      }
    })

    it('uses fallback policy if repository fetch fails', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock({ shouldFailGet: true })
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      // Fallback policy requires min length 8 and a letter.
      const resultShort = await useCase.execute('1234567')
      expect(resultShort.success).toBe(false)
      if (!resultShort.success) {
        expect((resultShort.error as SecurityError).code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_SHORT)
      }

      const resultNoLetter = await useCase.execute('12345678')
      expect(resultNoLetter.success).toBe(false)
      if (!resultNoLetter.success) {
        expect((resultNoLetter.error as SecurityError).code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_LETTER)
      }

      const resultValid = await useCase.execute('a1234567')
      expect(resultValid.success).toBe(true)
    })
  })
})
