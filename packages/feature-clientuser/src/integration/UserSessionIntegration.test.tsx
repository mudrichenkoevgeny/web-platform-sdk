import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestPagedResultPayload,
  createTestUserSessionSummaryPayload,
  createTestUserSessionPrivatePayload,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SessionListScreen,
  SessionDetailScreen,
  SessionListTestTags,
  SessionDetailTestTags,
  createSelfSessionListDataSource,
  createSelfSessionDetailDataSource
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const SESSION_ID = '00000000-0000-4000-8000-000000000020'

const server = setupServer(
  http.get('https://api.example.com/user/sessions', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserSessionSummaryPayload()] }))
  }),
  http.get(`https://api.example.com/user/sessions/${SESSION_ID}`, () => {
    return HttpResponse.json(createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(SESSION_ID) }))
  }),
  http.delete(`https://api.example.com/user/sessions/${SESSION_ID}`, () => {
    return HttpResponse.json({ status: 'REVOKED' })
  })
)

describe('Client User Session Management Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Session List - View active user sessions', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    const dataSource = createSelfSessionListDataSource({
      getSessionsUseCase: clientUserComponent.getSessionsUseCase,
      deleteSessionUseCase: clientUserComponent.deleteSessionUseCase,
      deleteAllOtherSessionsUseCase: clientUserComponent.deleteAllOtherSessionsUseCase
    })

    render(
      <SessionListScreen
        dependencies={{
          dataSource,
          onNavigateToSessionDetail: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(SessionListTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Session Detail - View session detail and revoke session', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })
    const onSessionRevokedMock = vi.fn()

    const dataSource = createSelfSessionDetailDataSource({
      getSessionUseCase: clientUserComponent.getSessionUseCase,
      deleteSessionUseCase: clientUserComponent.deleteSessionUseCase
    })

    render(
      <SessionDetailScreen
        dependencies={{
          sessionId: toUserSessionIdOrThrow(SESSION_ID),
          dataSource,
          onBack: vi.fn(),
          onSessionRevoked: onSessionRevokedMock
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(SessionDetailTestTags.TITLE)).toBeDefined()
    })

    const revokeBtn = screen.getByTestId(SessionDetailTestTags.REVOKE_BUTTON)
    fireEvent.click(revokeBtn)

    await waitFor(() => {
      expect(onSessionRevokedMock).toHaveBeenCalled()
    })
  })
})
