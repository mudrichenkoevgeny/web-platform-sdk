import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestUserPrivate,
  toFileIdOrThrow,
  StorageCategory,
  StorageFileVisibility,
  UserStorageTargetScopes
} from '@mudrichenkoevgeny/shared-foundation'
import { UserEditScreen, UserEditTestTags } from './UserEditScreen'
import type { UserEditStoreDependencies } from './user-edit-store'
import { GetUserUseCaseMock } from '@/mock/usecase/user/get-user-use-case-mock'
import { SelfUpdateUserUseCaseMock } from '@/mock/usecase/user/self-update-user-use-case-mock'
import { ValidateNicknameUseCaseMock } from '@/mock/usecase/user/validation/validate-nickname-use-case-mock'
import { ValidateDisplayNameUseCaseMock } from '@/mock/usecase/user/validation/validate-display-name-use-case-mock'

describe('UserEditScreen', () => {
  let getUserUseCase: GetUserUseCaseMock
  let selfUpdateUserUseCase: SelfUpdateUserUseCaseMock
  let validateNicknameUseCase: ValidateNicknameUseCaseMock
  let validateDisplayNameUseCase: ValidateDisplayNameUseCaseMock
  let uploadFileUseCase: NonNullable<UserEditStoreDependencies['uploadFileUseCase']>
  let onBack: () => void
  let onSuccess: () => void
  let deps: UserEditStoreDependencies

  const mockUser = createTestUserPrivate({
    nickname: 'jdoe',
    displayName: 'John Doe',
    avatarFileId: null,
    avatarUrls: null
  })

  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-avatar-url'),
      revokeObjectURL: vi.fn()
    })

    getUserUseCase = new GetUserUseCaseMock()
    getUserUseCase.resultProvider = async () => appResultSuccess(mockUser)

    selfUpdateUserUseCase = new SelfUpdateUserUseCaseMock()
    selfUpdateUserUseCase.resultProvider = async () => appResultSuccess(mockUser)

    validateNicknameUseCase = new ValidateNicknameUseCaseMock()
    validateNicknameUseCase.resultProvider = async () => appResultSuccess(undefined)

    validateDisplayNameUseCase = new ValidateDisplayNameUseCaseMock()
    validateDisplayNameUseCase.resultProvider = async () => appResultSuccess(undefined)

    uploadFileUseCase = {
      execute: vi.fn(async () =>
        appResultSuccess({
          id: 'file-avatar-123',
          fileUrls: { originalUrl: 'https://cdn.example.com/avatars/file-avatar-123.jpg' }
        })
      )
    }

    onBack = vi.fn()
    onSuccess = vi.fn()

    deps = {
      getUserUseCase,
      selfUpdateUserUseCase,
      validateNicknameUseCase,
      validateDisplayNameUseCase,
      uploadFileUseCase,
      onSuccess,
      onBack
    }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders content when loaded successfully', async () => {
    render(
      <ComponentTestHarness>
        <UserEditScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.TITLE)).toBeDefined()
      expect(screen.getByTestId(UserEditTestTags.DISPLAY_NAME_INPUT)).toBeDefined()
    })
  })

  it('disables save button when no changes exist', async () => {
    render(
      <ComponentTestHarness>
        <UserEditScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await waitFor(() => {
      const saveBtn = screen.getByTestId(UserEditTestTags.SAVE_BUTTON) as HTMLButtonElement
      expect(saveBtn.disabled).toBe(true)
    })
  })

  it('enables save button and submits update when inputs change', async () => {
    render(
      <ComponentTestHarness>
        <UserEditScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.DISPLAY_NAME_INPUT)).toBeDefined()
    })

    const nameInput = screen.getByTestId(UserEditTestTags.DISPLAY_NAME_INPUT)
    fireEvent.change(nameInput, { target: { value: 'John Smith' } })

    const saveBtn = screen.getByTestId(UserEditTestTags.SAVE_BUTTON) as HTMLButtonElement
    expect(saveBtn.disabled).toBe(false)

    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(selfUpdateUserUseCase.executeCalls).toBe(1)
      expect(selfUpdateUserUseCase.lastRequest).toEqual({
        nickname: 'jdoe',
        displayName: 'John Smith',
        avatarFileId: null,
        birthdate: 1700000000000
      })
      expect(onSuccess).toHaveBeenCalled()
      expect(onBack).toHaveBeenCalled()
    })
  })

  it('handles avatar file upload and save flow using UserStorageTargetScopes.AVATAR', async () => {
    render(
      <ComponentTestHarness>
        <UserEditScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.AVATAR_CHANGE_BUTTON)).toBeDefined()
    })

    const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toBeDefined()

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.AVATAR_IMAGE)).toBeDefined()
      const img = screen.getByTestId(UserEditTestTags.AVATAR_IMAGE) as HTMLImageElement
      expect(img.src).toContain('blob:mock-avatar-url')
    })

    const saveBtn = screen.getByTestId(UserEditTestTags.SAVE_BUTTON) as HTMLButtonElement
    expect(saveBtn.disabled).toBe(false)

    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
        file,
        category: StorageCategory.IMAGE,
        visibility: StorageFileVisibility.PUBLIC,
        targetScope: UserStorageTargetScopes.AVATAR
      })
      expect(selfUpdateUserUseCase.executeCalls).toBe(1)
      expect(onSuccess).toHaveBeenCalled()
      expect(onBack).toHaveBeenCalled()
    })
  })

  it('handles avatar removal when clicking remove avatar button', async () => {
    const userWithAvatar = createTestUserPrivate({
      avatarFileId: toFileIdOrThrow('file-avatar-123'),
      avatarUrls: { originalUrl: 'https://cdn.example.com/avatar.jpg' }
    })
    getUserUseCase.resultProvider = async () => appResultSuccess(userWithAvatar)

    render(
      <ComponentTestHarness>
        <UserEditScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.REMOVE_AVATAR_BUTTON)).toBeDefined()
    })

    const removeBtn = screen.getByTestId(UserEditTestTags.REMOVE_AVATAR_BUTTON)
    fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(screen.queryByTestId(UserEditTestTags.AVATAR_IMAGE)).toBeNull()
    })
  })
})
