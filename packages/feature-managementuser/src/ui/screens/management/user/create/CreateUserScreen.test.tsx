import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { CreateUserScreen, CreateUserTestTags } from '@/ui/screens/management/user/create/CreateUserScreen'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'
import { enManagementUserStrings } from '@/locales/index'

describe('CreateUserScreen', () => {
  const createMockDeps = (): CreateUserStoreDependencies => ({
    createUserUseCase: {
      execute: vi.fn()
    } as unknown as CreateUserStoreDependencies['createUserUseCase'],
    onSuccess: vi.fn(),
    onBack: vi.fn()
  })

  it('renders create user screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <CreateUserScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(CreateUserTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.TITLE).textContent).toContain(enManagementUserStrings.create_user_title)
    expect(screen.getByTestId(CreateUserTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.EMAIL_INPUT)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.PASSWORD_INPUT)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.ROLE_SELECT)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.STATUS_SELECT)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.AUTHORITY_LEVEL_INPUT)).toBeDefined()
    expect(screen.getByTestId(CreateUserTestTags.CREATE_BUTTON)).toBeDefined()
  })
})
