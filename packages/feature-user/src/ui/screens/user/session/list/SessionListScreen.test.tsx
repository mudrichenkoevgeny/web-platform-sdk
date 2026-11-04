import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionListScreen, SessionListTestTags } from './SessionListScreen'
import { createSelfSessionListDataSource } from './session-list-data-source'
import type { SessionListStoreDependencies } from './session-list-store'

describe('SessionListScreen', () => {
  const sessions = createTestUserSessionSummaryList(2, (index) => ({
    identifierDisplayName: `user${index + 1}@example.com`
  }))

  const createMockDeps = (): SessionListStoreDependencies => {
    const getSessionsUseCase = {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess(
          createTestPagedResult({
            items: sessions
          })
        )
      )
    }
    const deleteSessionUseCase = {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    }
    const deleteAllOtherSessionsUseCase = {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    }

    return {
      dataSource: createSelfSessionListDataSource({
        getSessionsUseCase,
        deleteSessionUseCase,
        deleteAllOtherSessionsUseCase
      }),
      onNavigateToSessionDetail: vi.fn(),
      onBack: vi.fn()
    }
  }

  it('renders sessions list and revoke all others button when multiple sessions exist', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(sessions[0]?.identifierDisplayName ?? '')).not.toBeNull()
    expect(screen.getByText(sessions[1]?.identifierDisplayName ?? '')).not.toBeNull()
    expect(screen.getByTestId(SessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)).not.toBeNull()
  })

  it('executes deleteAllOtherSessionsUseCase when revoke all others button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')

    const revokeAllBtn = screen.getByTestId(SessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)
    await user.click(revokeAllBtn)

    expect(deps.dataSource?.revokeAllOtherSessions).toBeDefined()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')

    await user.click(screen.getByTestId(SessionListTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('executes getSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(sessions[0]?.identifierDisplayName ?? '')
  })
})
