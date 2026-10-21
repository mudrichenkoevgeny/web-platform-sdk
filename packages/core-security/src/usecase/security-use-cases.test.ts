import { describe, it, expect } from 'vitest'
import { RefreshOpenSecuritySettingsUseCase } from '@/usecase/refresh-open-security-settings-use-case'
import { ValidatePasswordUseCase } from '@/usecase/validate-password-use-case'
import { PasswordPolicyValidator } from '@/domain/model/password-policy-validator'
import { OpenSecuritySettingsRepositoryMock } from '@/mock/repository/open-security-settings-repository-mock'
import { ClientSecurityErrorCodes } from '@/error/naming/client-security-error-codes'

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
      const repo = new OpenSecuritySettingsRepositoryMock({
        initialSettings: {
          openPasswordPolicy: {
            minLength: 8,
            requireLetter: true,
            requireUpperCase: true,
            requireLowerCase: true,
            requireDigit: true,
            requireSpecialChar: true
          },
          otpConfirmation: {
            retryAfterSeconds: 60,
            numberOfSymbols: 6,
            expirationSeconds: 300
          }
        }
      })
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      const result = await useCase.execute('Valid123!')
      expect(result.success).toBe(true)
    })

    it('returns SecurityError if password fails validation', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock({
        initialSettings: {
          openPasswordPolicy: {
            minLength: 8,
            requireLetter: true,
            requireUpperCase: false,
            requireLowerCase: false,
            requireDigit: false,
            requireSpecialChar: false
          },
          otpConfirmation: {
            retryAfterSeconds: 60,
            numberOfSymbols: 6,
            expirationSeconds: 300
          }
        }
      })
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      const result = await useCase.execute('short')
      expect(result.success).toBe(false)
      if (!result.success && 'code' in result.error) {
        expect(result.error.code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_SHORT)
      }
    })

    it('uses fallback policy requiring min length 8 and a letter if repository fetch fails', async () => {
      const repo = new OpenSecuritySettingsRepositoryMock({ shouldFailGet: true })
      const validator = new PasswordPolicyValidator()
      const useCase = new ValidatePasswordUseCase(repo, validator)

      const resultShort = await useCase.execute('1234567')
      expect(resultShort.success).toBe(false)
      if (!resultShort.success && 'code' in resultShort.error) {
        expect(resultShort.error.code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_SHORT)
      }

      const resultNoLetter = await useCase.execute('12345678')
      expect(resultNoLetter.success).toBe(false)
      if (!resultNoLetter.success && 'code' in resultNoLetter.error) {
        expect(resultNoLetter.error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_LETTER)
      }

      const resultValid = await useCase.execute('a1234567')
      expect(resultValid.success).toBe(true)
    })
  })
})
