import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfSessionListScreen, SelfSessionListTestTags } from '@/ui/screens/user/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/user/session/list/self-session-list-store'

describe('SelfSessionListScreen', () => {
  const sessions = createTestUserSessionSummaryList(2, (index) => ({
    identifierDisplayName: `user${index + 1}@example.com`
  }))

  const createMockDeps = (): SelfSessionListStoreDependencies => ({
    getSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess(
          createTestPagedResult({
            items: sessions
          })
        )
      )
    } as unknown as SelfSessionListStoreDependencies['getSessionsUseCase'],
    deleteSessionUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfSessionListStoreDependencies['deleteSessionUseCase'],
    deleteAllOtherSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfSessionListStoreDependencies['deleteAllOtherSessionsUseCase'],
    onNavigateToSessionDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders sessions list and revoke all others button when multiple sessions exist', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(sessions[0]?.identifierDisplayName ?? '')).not.toBeNull()
    expect(screen.getByText(sessions[1]?.identifierDisplayName ?? '')).not.toBeNull()
    expect(screen.getByTestId(SelfSessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)).not.toBeNull()
  })

  it('executes deleteAllOtherSessionsUseCase when revoke all others button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')

    const revokeAllBtn = screen.getByTestId(SelfSessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)
    await user.click(revokeAllBtn)

    expect(deps.deleteAllOtherSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')

    await user.click(screen.getByTestId(SelfSessionListTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('executes getSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')
    expect(deps.getSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })
})
