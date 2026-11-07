import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestPagedResultPayload,
  createTestUserIdentifierSummaryPayload,
  createTestUserIdentifierPrivatePayload,
  toUserIdentifierIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  IdentifierListScreen,
  IdentifierDetailScreen,
  IdentifierListTestTags,
  IdentifierDetailTestTags,
  createSelfIdentifierListDataSource,
  createSelfIdentifierDetailDataSource
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const IDENTIFIER_ID = '00000000-0000-4000-8000-000000000010'

const server = setupServer(
  http.get('https://api.example.com/user/identifiers', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserIdentifierSummaryPayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) })] }))
  }),
  http.get(`https://api.example.com/user/identifiers/:id`, () => {
    return HttpResponse.json(createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) }))
  }),
  http.delete(`https://api.example.com/user/identifiers/:id`, () => {
    return HttpResponse.json({ status: 'DELETED' })
  }),
  http.get('https://api.example.com/settings/auth', () => {
    return HttpResponse.json({ primary: ['EMAIL'], secondary: ['GOOGLE'] })
  })
)

describe('Client User Identifier Management Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Identifier List - Fetch and render user authentication identifiers', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    const dataSource = createSelfIdentifierListDataSource({
      getIdentifiersUseCase: clientUserComponent.getUserIdentifiersUseCase,
      getAvailableUserAuthProvidersUseCase: clientUserComponent.getAvailableUserAuthProvidersUseCase
    })

    render(
      <IdentifierListScreen
        dependencies={{
          dataSource,
          onNavigateToIdentifierDetail: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(IdentifierListTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Identifier Detail - View identifier detail screen', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    const dataSource = createSelfIdentifierDetailDataSource({
      getIdentifierUseCase: clientUserComponent.getUserIdentifierUseCase,
      deleteUserIdentifierUseCase: clientUserComponent.deleteUserIdentifierUseCase,
      deletePasswordUseCase: clientUserComponent.deletePasswordUseCase
    })

    render(
      <IdentifierDetailScreen
        dependencies={{
          identifierId: toUserIdentifierIdOrThrow(IDENTIFIER_ID),
          dataSource,
          onBack: vi.fn(),
          onFinished: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(IdentifierDetailTestTags.TITLE)).toBeDefined()
    })
  })
})
