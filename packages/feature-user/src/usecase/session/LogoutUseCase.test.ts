import { describe, it, expect, vi } from 'vitest'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LogoutUseCase } from './LogoutUseCase'
import { SessionRepository } from '@/repository/session/SessionRepository'
import { UserRepository } from '@/repository/user/UserRepository'

describe('LogoutUseCase', () => {
  it('clears local session even if remote logout fails', async () => {
    const mockSessionRepo = {
      logout: vi.fn().mockRejectedValue(new Error('Network error'))
    } as unknown as SessionRepository

    const mockUserRepo = {
      clearSession: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserRepository

    const useCase = new LogoutUseCase(mockSessionRepo, mockUserRepo)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockUserRepo.clearSession).toHaveBeenCalled()
  })
})
