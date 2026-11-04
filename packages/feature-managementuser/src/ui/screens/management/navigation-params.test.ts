import { describe, expect, it, vi } from 'vitest'
import {
  managementAuditEventListParamsSchema,
  managementGlobalIdentifierListParamsSchema,
  managementGlobalSessionListParamsSchema,
  managementUserListParamsSchema,
  selfIdentifierListParamsSchema,
  selfSessionListParamsSchema,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createAuditEventListStore } from '@/ui/screens/management/audit/list/audit-event-list-store'
import { createGlobalUserListStore } from '@/ui/screens/management/user/global-list/global-user-list-store'
import { GetAuditEventsUseCaseMock } from '@/mock/usecase/audit/get-audit-events-use-case-mock'
import { GetUsersUseCaseMock } from '@/mock/usecase/user/get-users-use-case-mock'

describe('Unified Navigation Parameters & API Architecture Suite', () => {
  describe('Zod Search Parameter Schema Robustness & Defaults', () => {
    it('parses raw search input into ManagementAuditEventListParams without crashing', () => {
      const rawInput = {
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        actorIds: [],
        actorTypes: [],
        actorUserRoles: [],
        actions: [],
        resources: [],
        resourceIds: [],
        statuses: [],
        messages: []
      }
      const parsed = managementAuditEventListParamsSchema.parse(rawInput)
      expect(parsed).toBeDefined()
      expect(parsed.pageNumber).toBe(1)
      expect(parsed.pageSize).toBe(20)
      expect(parsed.sortBy).toBe('created_at')
      expect(parsed.sortOrder).toBe(SortOrder.DESC)
      expect(parsed.actorIds).toEqual([])
      expect(parsed.actorTypes).toEqual([])
      expect(parsed.actions).toEqual([])
    })

    it('parses raw search input into ManagementUserListParams', () => {
      const rawInput = {
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userRoles: [],
        accountStatuses: [],
        accountStatusesOnRestore: [],
        accountLockoutTypes: [],
        authorityLevelFrom: null,
        authorityLevelTo: null,
        isTotpEnabled: null,
        permissionCodes: []
      }
      const parsed = managementUserListParamsSchema.parse(rawInput)
      expect(parsed).toBeDefined()
      expect(parsed.pageNumber).toBe(1)
      expect(parsed.pageSize).toBe(20)
      expect(parsed.sortOrder).toBe(SortOrder.DESC)
      expect(parsed.userRoles).toEqual([])
      expect(parsed.accountStatuses).toEqual([])
    })

    it('parses raw search input into ManagementGlobalSessionListParams', () => {
      const rawInput = {
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userIds: [],
        userRoles: [],
        identifiers: [],
        identifierIds: [],
        userAuthProviders: [],
        clientTypes: [],
        userAgents: [],
        ipAddresses: [],
        languages: [],
        deviceIds: [],
        deviceNames: [],
        appVersions: [],
        osVersions: []
      }
      const parsed = managementGlobalSessionListParamsSchema.parse(rawInput)
      expect(parsed).toBeDefined()
      expect(parsed.pageNumber).toBe(1)
      expect(parsed.pageSize).toBe(20)
      expect(parsed.sortOrder).toBe(SortOrder.DESC)
      expect(parsed.userIds).toEqual([])
    })

    it('parses raw search input into ManagementGlobalIdentifierListParams', () => {
      const rawInput = {
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userAuthProviders: [],
        userIds: [],
        identifiers: []
      }
      const parsed = managementGlobalIdentifierListParamsSchema.parse(rawInput)
      expect(parsed).toBeDefined()
      expect(parsed.pageNumber).toBe(1)
      expect(parsed.pageSize).toBe(20)
      expect(parsed.sortOrder).toBe(SortOrder.DESC)
      expect(parsed.userAuthProviders).toEqual([])
    })

    it('parses raw search input into SelfSessionListParams and SelfIdentifierListParams', () => {
      const parsedSessions = selfSessionListParamsSchema.parse({
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        identifiers: [],
        identifierIds: [],
        userAuthProviders: [],
        clientTypes: [],
        userAgents: [],
        ipAddresses: [],
        languages: [],
        deviceIds: [],
        deviceNames: [],
        appVersions: [],
        osVersions: []
      })
      expect(parsedSessions.pageNumber).toBe(1)
      expect(parsedSessions.pageSize).toBe(20)

      const parsedIdentifiers = selfIdentifierListParamsSchema.parse({
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userAuthProviders: [],
        identifiers: []
      })
      expect(parsedIdentifiers.pageNumber).toBe(1)
      expect(parsedIdentifiers.pageSize).toBe(20)
    })
  })

  describe('Clean URL Generation & appendQueryParamsToPath', () => {
    it('generates clean URL path when search params contain default values', () => {
      const mockParams = {
        toQueryMap: () => new Map<string, string[]>()
      }
      const url = appendQueryParamsToPath('/management/audit/events', mockParams)
      expect(url).toBe('/management/audit/events')
    })

    it('generates query string correctly for custom filters', () => {
      const mockParams = {
        toQueryMap: () =>
          new Map<string, string[]>([
            ['page_number', ['2']],
            ['actor_user_role', [UserRole.ADMIN]]
          ])
      }
      const url = appendQueryParamsToPath('/management/audit/events', mockParams)
      expect(url).toBe('/management/audit/events?page_number=2&actor_user_role=admin')
    })
  })

  describe('Store Integration with Typed KMP Search Params', () => {
    it('AuditEventListStore passes typed KMP searchParams directly to UseCase', async () => {
      const getAuditEventsUseCase = new GetAuditEventsUseCaseMock()
      vi.spyOn(getAuditEventsUseCase, 'execute')

      const typedParams = managementAuditEventListParamsSchema.parse({
        pageNumber: 2,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        actorIds: [],
        actorTypes: [],
        actorUserRoles: [],
        actions: ['user.login'],
        resources: [],
        resourceIds: [],
        statuses: [],
        messages: []
      })

      const store = createAuditEventListStore({
        getAuditEventsUseCase,
        onNavigateToEventDetail: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(getAuditEventsUseCase.execute).toHaveBeenCalledWith(typedParams)
    })

    it('GlobalUserListStore passes typed KMP searchParams directly to UseCase', async () => {
      const getUsersUseCase = new GetUsersUseCaseMock()
      vi.spyOn(getUsersUseCase, 'execute')

      const typedParams = managementUserListParamsSchema.parse({
        pageNumber: 3,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userRoles: [UserRole.ADMIN],
        accountStatuses: [],
        accountStatusesOnRestore: [],
        accountLockoutTypes: [],
        authorityLevelFrom: null,
        authorityLevelTo: null,
        isTotpEnabled: null,
        permissionCodes: []
      })

      const store = createGlobalUserListStore({
        getUsersUseCase,
        onNavigateToUserDetail: vi.fn(),
        onNavigateToCreateUser: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(getUsersUseCase.execute).toHaveBeenCalledWith(typedParams)
    })
  })
})
