import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestPagedResultPayload,
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

const IDENTIFIER_ID = '123e4567-e89b-12d3-a456-426614174000'

const server = setupServer(
  http.get(`https://api.example.com/user/identifiers/${IDENTIFIER_ID}`, () => {
    return HttpResponse.json(createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) }))
  }),
  http.get('https://api.example.com/user/identifiers*', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) })] }))
  }),
  http.get(`https://api.example.com/open/v1/identifiers/${IDENTIFIER_ID}`, () => {
    return HttpResponse.json(createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) }))
  }),
  http.get('https://api.example.com/open/v1/identifiers*', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(IDENTIFIER_ID) })] }))
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
      getIdentifiersUseCase: clientUserComponent.getUserIdentifiersUseCase
    })

    render(
      <IdentifierListScreen
        dependencies={{
          dataSource,
          addUserIdentifierEmailUseCase: clientUserComponent.addUserIdentifierEmailUseCase,
          addUserIdentifierPhoneUseCase: clientUserComponent.addUserIdentifierPhoneUseCase,
          addUserIdentifierGoogleUseCase: clientUserComponent.addUserIdentifierGoogleUseCase,
          onNavigateToIdentifierDetail: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(IdentifierListTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Identifier Detail - View identifier information and handle actions', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    const dataSource = createSelfIdentifierDetailDataSource({
      getIdentifierUseCase: clientUserComponent.getUserIdentifierUseCase,
      deleteIdentifierUseCase: clientUserComponent.deleteUserIdentifierUseCase,
      deletePasswordUseCase: clientUserComponent.deletePasswordUseCase
    })

    render(
      <IdentifierDetailScreen
        dependencies={{
          identifierId: toUserIdentifierIdOrThrow(IDENTIFIER_ID),
          dataSource,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(IdentifierDetailTestTags.TITLE)).toBeDefined()
    })
  })
})
