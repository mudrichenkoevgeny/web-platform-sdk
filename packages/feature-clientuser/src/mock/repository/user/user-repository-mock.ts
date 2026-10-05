import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import type { UserRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export class UserRepositoryMock implements UserRepository {
  private currentUserSnapshot: UserDetails | null = null
  private readonly listeners = new Set<(user: UserDetails | null) => void>()

  public resultProvider: () => Promise<AppResult<UserDetails, AppError>> = async () => {
    if (this.currentUserSnapshot) {
      return appResultSuccess(this.currentUserSnapshot)
    }
    return appResultFailure(
      CommonError.contractViolation(new Error('No mock user provided.'))
    )
  }

  public observeCurrentUser(listener: (user: UserDetails | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.currentUserSnapshot)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public async refreshCurrentUser(): Promise<AppResult<UserDetails, AppError>> {
    return this.handleUpdate()
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserDetails, AppError>> {
    return this.handleUpdate()
  }

  public async restoreUser(): Promise<AppResult<UserDetails, AppError>> {
    return this.handleUpdate()
  }

  public async clearSession(): Promise<void> {
    this.currentUserSnapshot = null
    this.notifyListeners()
  }

  public emit(user: UserDetails | null): void {
    this.currentUserSnapshot = user
    this.notifyListeners()
  }

  private async handleUpdate(): Promise<AppResult<UserDetails, AppError>> {
    const result = await this.resultProvider()
    if (result.success) {
      this.currentUserSnapshot = result.data
      this.notifyListeners()
    }
    return result
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentUserSnapshot)
    }
  }
}
