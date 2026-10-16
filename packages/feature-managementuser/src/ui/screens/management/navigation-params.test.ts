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
import { appendQueryParamsToPath, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createAuditEventListStore } from '@/ui/screens/management/audit/list/AuditEventListStore'
import { createGlobalUserListStore } from '@/ui/screens/management/user/global-list/GlobalUserListStore'
import { createGlobalSessionListStore } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'
import { createGlobalIdentifierListStore } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

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
      const mockExecute = vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [],
          pageNumber: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0
        })
      )

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
        getAuditEventsUseCase: { execute: mockExecute } as any,
        onNavigateToEventDetail: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(mockExecute).toHaveBeenCalledWith(typedParams)
    })

    it('GlobalUserListStore passes typed KMP searchParams directly to UseCase', async () => {
      const mockExecute = vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [],
          pageNumber: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0
        })
      )

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
        getUsersUseCase: { execute: mockExecute } as any,
        onNavigateToUserDetail: vi.fn(),
        onNavigateToCreateUser: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(mockExecute).toHaveBeenCalledWith(typedParams)
    })

    it('GlobalSessionListStore passes typed KMP searchParams directly to UseCase', async () => {
      const mockExecute = vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [],
          pageNumber: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0
        })
      )

      const typedParams = managementGlobalSessionListParamsSchema.parse({
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userIds: ['usr_123'],
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
      })

      const store = createGlobalSessionListStore({
        managementGetSessionsUseCase: { execute: mockExecute } as any,
        managementDeleteSessionUseCase: { execute: vi.fn() } as any,
        onNavigateToSessionDetail: vi.fn(),
        onNavigateToUserDetail: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(mockExecute).toHaveBeenCalledWith(typedParams)
    })

    it('GlobalIdentifierListStore passes typed KMP searchParams directly to UseCase', async () => {
      const mockExecute = vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [],
          pageNumber: 1,
          pageSize: 20,
          totalCount: 0,
          totalPages: 0
        })
      )

      const typedParams = managementGlobalIdentifierListParamsSchema.parse({
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userIds: [],
        userAuthProviders: [],
        identifiers: ['user@example.com']
      })

      const store = createGlobalIdentifierListStore({
        managementGetIdentifiersUseCase: { execute: mockExecute } as any,
        managementDeleteIdentifierUseCase: { execute: vi.fn() } as any,
        onNavigateToIdentifierDetail: vi.fn(),
        onBack: vi.fn(),
        searchParams: typedParams
      })

      await store.getState().initScreen()

      expect(mockExecute).toHaveBeenCalledWith(typedParams)
    })
  })
})
