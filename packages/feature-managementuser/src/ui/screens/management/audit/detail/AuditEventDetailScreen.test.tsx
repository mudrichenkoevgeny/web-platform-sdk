import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventDetailScreen, AuditEventDetailTestTags } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'
import { enManagementUserStrings } from '@/locales/index'

describe('AuditEventDetailScreen', () => {
  const currentUserId = toUserIdOrThrow('usr_current_123')
  const otherUserId = toUserIdOrThrow('usr_other_456')

  const createMockDeps = (overrides?: Partial<AuditEventDetailStoreDependencies>): AuditEventDetailStoreDependencies => ({
    eventId: auditEventMock().id,
    getAuditEventUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(auditEventMock()))
    },
    currentUserId,
    onNavigateToProfile: vi.fn(),
    onNavigateToUserDetail: vi.fn(),
    onBack: vi.fn(),
    ...overrides
  })

  it('renders event details and handles back button click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventDetailTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(AuditEventDetailTestTags.TITLE).textContent).toContain(enManagementUserStrings.audit_event_details_title)
    expect(screen.getByTestId(AuditEventDetailTestTags.BACK_BUTTON)).toBeDefined()

    const backButton = screen.getByTestId(AuditEventDetailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('navigates to profile when clicking resource representing current user', async () => {
    const mockEvent = auditEventMock({
      resource: 'user',
      resourceId: currentUserId
    })

    const deps = createMockDeps({
      getAuditEventUseCase: {
        execute: vi.fn().mockResolvedValue(appResultSuccess(mockEvent))
      }
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const resourceRow = await screen.findByTestId(AuditEventDetailTestTags.RESOURCE_ROW)
    await user.click(resourceRow)

    expect(deps.onNavigateToProfile).toHaveBeenCalledTimes(1)
    expect(deps.onNavigateToUserDetail).not.toHaveBeenCalled()
  })

  it('navigates to user detail when clicking resource representing another user', async () => {
    const mockEvent = auditEventMock({
      resource: 'user',
      resourceId: otherUserId
    })

    const deps = createMockDeps({
      getAuditEventUseCase: {
        execute: vi.fn().mockResolvedValue(appResultSuccess(mockEvent))
      }
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const resourceRow = await screen.findByTestId(AuditEventDetailTestTags.RESOURCE_ROW)
    await user.click(resourceRow)

    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(otherUserId)
    expect(deps.onNavigateToProfile).not.toHaveBeenCalled()
  })

  it('navigates to profile when clicking subject representing current user actor', async () => {
    const mockEvent = auditEventMock({
      actorType: 'user',
      actorId: currentUserId
    })

    const deps = createMockDeps({
      getAuditEventUseCase: {
        execute: vi.fn().mockResolvedValue(appResultSuccess(mockEvent))
      }
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const subjectRow = await screen.findByTestId(AuditEventDetailTestTags.SUBJECT_ROW)
    await user.click(subjectRow)

    expect(deps.onNavigateToProfile).toHaveBeenCalledTimes(1)
    expect(deps.onNavigateToUserDetail).not.toHaveBeenCalled()
  })

  it('navigates to user detail when clicking subject representing another user actor', async () => {
    const mockEvent = auditEventMock({
      actorType: 'user',
      actorId: otherUserId
    })

    const deps = createMockDeps({
      getAuditEventUseCase: {
        execute: vi.fn().mockResolvedValue(appResultSuccess(mockEvent))
      }
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const subjectRow = await screen.findByTestId(AuditEventDetailTestTags.SUBJECT_ROW)
    await user.click(subjectRow)

    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(otherUserId)
    expect(deps.onNavigateToProfile).not.toHaveBeenCalled()
  })
})
