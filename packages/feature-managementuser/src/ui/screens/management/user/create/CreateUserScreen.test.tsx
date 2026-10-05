import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { CreateUserScreen } from '@/ui/screens/management/user/create/CreateUserScreen'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'
import { enManagementUserStrings } from '@/locales/index'

describe('CreateUserScreen', () => {
  const createMockDeps = (): CreateUserStoreDependencies => ({
    createUserUseCase: {
      execute: vi.fn()
    } as any,
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

    expect(await screen.findByText(enManagementUserStrings.create_user_title)).toBeDefined()
  })
})
