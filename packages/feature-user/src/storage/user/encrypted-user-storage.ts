import type { GetUserIdentifiersListParams, GetUserSessionsListParams } from '@/storage/user/user-storage'
import {
  pagedResultSchema,
  SortOrder,
  userDetailsPayloadSchema,
  userIdentifierPayloadSchema,
  userSessionPayloadSchema,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { PagedResult, UserIdentifierId, UserIdentifierPayload, UserSessionId, UserSessionPayload } from "@mudrichenkoevgeny/shared-foundation";
import { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  UserStorage
} from '@/storage/user/user-storage'
import type { UserChangeListener, UserIdentifiersListChangeListener, UserSessionsListChangeListener } from "@/storage/user/user-storage";
import {
  toUserDetails,
  toUserDetailsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetails } from "@mudrichenkoevgeny/shared-foundation";
import {
  toUserIdentifier,
  toUserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifier } from "@mudrichenkoevgeny/shared-foundation";
import {
  toUserSession,
  toUserSessionPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession } from "@mudrichenkoevgeny/shared-foundation";

const KEY_CURRENT_USER = 'current_user'
const KEY_USER_IDENTIFIERS = 'user_identifiers_list'
const KEY_USER_SESSIONS = 'user_sessions_list'

/**
 * Storage implementation of {@link UserStorage} backed by {@link EncryptedSettings}.
 */
export class EncryptedUserStorage implements UserStorage {
  /**
   * Constructs a new {@link EncryptedUserStorage}.
   *
   * @param encryptedSettings - Encrypted settings key-value store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves and deserializes the current cached user profile.
   *
   * @returns Deserialized user details or null if unreadable or absent
   */
  public async getCurrentUser(): Promise<UserDetails | null> {
    const rawData = await this.encryptedSettings.get(KEY_CURRENT_USER)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = userDetailsPayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_CURRENT_USER)
        return null
      }
      return toUserDetails(validationResult.data)
    } catch {
      await this.encryptedSettings.remove(KEY_CURRENT_USER)
      return null
    }
  }

  /**
   * Observes updates to the cached current user profile.
   *
   * @param listener - Callback function triggered on profile change
   * @returns Unsubscribe function
   */
  public observeCurrentUser(listener: UserChangeListener): () => void {
    void this.getCurrentUser().then((user) => listener(user))
    return this.encryptedSettings.observe(KEY_CURRENT_USER, async () => {
      const user = await this.getCurrentUser()
      listener(user)
    })
  }

  /**
   * Serializes and persists active user profile details.
   *
   * @param currentUser - Active user details snapshot
   */
  public async updateCurrentUser(currentUser: UserDetails): Promise<void> {
    const payload = toUserDetailsPayload(currentUser)
    await this.encryptedSettings.put(KEY_CURRENT_USER, JSON.stringify(payload))
  }

  private async getAllUserIdentifiersInternal(): Promise<UserIdentifier[]> {
    const rawData = await this.encryptedSettings.get(KEY_USER_IDENTIFIERS)
    if (!rawData) {
      return []
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = pagedResultSchema(userIdentifierPayloadSchema).safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_USER_IDENTIFIERS)
        return []
      }
      return validationResult.data.items.map((payload) => toUserIdentifier(payload))
    } catch {
      await this.encryptedSettings.remove(KEY_USER_IDENTIFIERS)
      return []
    }
  }

  /**
   * Retrieves filtered and paginated user identifiers list.
   */
  public async getUserIdentifiersList(params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifier>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userIds,
      userAuthProviders,
      identifiers
    } = params || {}

    const allItems = await this.getAllUserIdentifiersInternal()
    if (allItems.length === 0) {
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 }
    }

    const filteredItems = allItems.filter((item) => {
      const matchesUserIds = !userIds || userIds.includes(item.userId)
      const matchesProvider = !userAuthProviders || userAuthProviders.includes(item.userAuthProvider)
      const matchesValue = !identifiers || identifiers.some((pattern) => item.identifier.toLowerCase().includes(pattern.toLowerCase()))
      return matchesUserIds && matchesProvider && matchesValue
    })

    if (sortBy === UserSortValues.UserIdentifierSortBy.CREATED_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    } else if (sortBy === UserSortValues.UserIdentifierSortBy.UPDATED_AT) {
      filteredItems.sort((a, b) => {
        const timeA = a.updatedAt ?? 0
        const timeB = b.updatedAt ?? 0
        return sortOrder === SortOrder.DESC ? timeB - timeA : timeA - timeB
      })
    }

    const totalCount = filteredItems.length
    const requestedPage = pageNumber ?? 1
    const requestedSize = pageSize ?? (totalCount > 0 ? totalCount : 20)

    if (requestedSize <= 0) {
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 }
    }

    const totalPages = Math.ceil(totalCount / requestedSize)
    const startIndex = Math.min((requestedPage - 1) * requestedSize, totalCount)
    const endIndex = Math.min(startIndex + requestedSize, totalCount)
    const paginatedItems = startIndex < totalCount ? filteredItems.slice(startIndex, endIndex) : []

    return { items: paginatedItems, totalCount, pageNumber: requestedPage, pageSize: requestedSize, totalPages }
  }

  /**
   * Observes filtered and paginated user identifiers list.
   */
  public observeUserIdentifiersList(
    listener: UserIdentifiersListChangeListener,
    params?: GetUserIdentifiersListParams
  ): () => void {
    void this.getUserIdentifiersList(params).then((list) => listener(list))
    return this.encryptedSettings.observe(KEY_USER_IDENTIFIERS, async () => {
      const list = await this.getUserIdentifiersList(params)
      listener(list)
    })
  }

  /**
   * Replaces stored identifiers paged result.
   */
  public async updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifier>): Promise<void> {
    const payloadItems = userIdentifiersList.items.map((item) => toUserIdentifierPayload(item))
    const pagedPayload = {
      items: payloadItems,
      total_count: userIdentifiersList.totalCount,
      page_number: userIdentifiersList.pageNumber,
      page_size: userIdentifiersList.pageSize,
      total_pages: userIdentifiersList.totalPages
    }
    await this.encryptedSettings.put(KEY_USER_IDENTIFIERS, JSON.stringify(pagedPayload))
  }

  /**
   * Replaces stored identifiers payload list.
   */
  public async updateUserIdentifiersPayloadList(
    userIdentifiersList: PagedResult<UserIdentifierPayload>
  ): Promise<void> {
    await this.encryptedSettings.put(KEY_USER_IDENTIFIERS, JSON.stringify(userIdentifiersList))
await this.encryptedSettings.put(KEY_USER_IDENTIFIERS, JSON.stringify(userIdentifiersList))
  }

  /**
   * Adds or updates a single user identifier.
   */
  public async addUserIdentifier(userIdentifier: UserIdentifier): Promise<void> {
    const allItems = await this.getAllUserIdentifiersInternal()
    let updated = false

    const newItems = allItems.map((item) => {
      if (item.id === userIdentifier.id) {
        updated = true
        return userIdentifier
      }
      return item
    })

    if (!updated) {
      newItems.push(userIdentifier)
    }

    const defaultSize = 20
    const totalCount = newItems.length
    const totalPages = Math.ceil(totalCount / defaultSize)

    await this.updateUserIdentifiersList({
      items: newItems,
      totalCount,
      pageNumber: 1,
      pageSize: defaultSize,
      totalPages
    })
  }

  /**
   * Removes a user identifier by ID.
   */
  public async removeUserIdentifier(identifierId: UserIdentifierId): Promise<void> {
    const allItems = await this.getAllUserIdentifiersInternal()
    const newItems = allItems.filter((item) => item.id !== identifierId)

    if (newItems.length === allItems.length) {
      return
    }

    const defaultSize = 20
    const totalCount = newItems.length
    const totalPages = Math.ceil(totalCount / defaultSize)

    await this.updateUserIdentifiersList({
      items: newItems,
      totalCount,
      pageNumber: 1,
      pageSize: defaultSize,
      totalPages
    })
  }

  private async getAllUserSessionsInternal(): Promise<UserSession[]> {
    const rawData = await this.encryptedSettings.get(KEY_USER_SESSIONS)
    if (!rawData) {
      return []
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = pagedResultSchema(userSessionPayloadSchema).safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_USER_SESSIONS)
        return []
      }
      return validationResult.data.items.map((payload) => toUserSession(payload))
    } catch {
      await this.encryptedSettings.remove(KEY_USER_SESSIONS)
      return []
    }
  }

  /**
   * Retrieves filtered and paginated active sessions list.
   */
  public async getUserSessionsList(params?: GetUserSessionsListParams): Promise<PagedResult<UserSession>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userIds,
      userRoles,
      identifiers,
      identifierIds,
      userAuthProviders,
      clientTypes,
      userAgents,
      ipAddresses,
      languages,
      deviceIds,
      deviceNames,
      appVersions,
      operationSystemVersions
    } = params || {}

    const allItems = await this.getAllUserSessionsInternal()
    if (allItems.length === 0) {
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 }
    }

    const filteredItems = allItems.filter((item) => {
      const matchesUserIds = !userIds || userIds.includes(item.userId)
      const matchesUserRoles = !userRoles || userRoles.includes(item.userRole)
      const matchesIdentifiers = !identifiers || identifiers.some((pattern) => item.identifier.toLowerCase().includes(pattern.toLowerCase()))
      const matchesIdentifierIds = !identifierIds || identifierIds.includes(item.identifierId)
      const matchesProviders = !userAuthProviders || userAuthProviders.includes(item.identifierAuthProvider)
      const matchesClientTypes = !clientTypes || (item.deviceInfo.clientType && clientTypes.includes(item.deviceInfo.clientType))
      const matchesUserAgents = !userAgents || (item.userAgent && userAgents.some((pattern) => item.userAgent?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesIpAddresses = !ipAddresses || (item.ipAddress && ipAddresses.some((pattern) => item.ipAddress?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesLanguages = !languages || (item.deviceInfo.language && languages.some((pattern) => item.deviceInfo.language?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesDeviceIds = !deviceIds || (item.deviceInfo.deviceId && deviceIds.includes(item.deviceInfo.deviceId))
      const matchesDeviceNames = !deviceNames || (item.deviceInfo.deviceName && deviceNames.some((pattern) => item.deviceInfo.deviceName?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesAppVersions = !appVersions || (item.deviceInfo.appVersion && appVersions.some((pattern) => item.deviceInfo.appVersion?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesOsVersions = !operationSystemVersions || (item.deviceInfo.operationSystemVersion && operationSystemVersions.some((pattern) => item.deviceInfo.operationSystemVersion?.toLowerCase().includes(pattern.toLowerCase())))

      return matchesUserIds && matchesUserRoles && matchesIdentifiers && matchesIdentifierIds &&
        matchesProviders && matchesClientTypes && matchesUserAgents && matchesIpAddresses &&
        matchesLanguages && matchesDeviceIds && matchesDeviceNames && matchesAppVersions &&
        matchesOsVersions
    })

    if (sortBy === UserSortValues.UserSessionSortBy.LAST_ACCESSED_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.lastAccessedAt - a.lastAccessedAt : a.lastAccessedAt - b.lastAccessedAt))
    } else if (sortBy === UserSortValues.UserSessionSortBy.LAST_REAUTHENTICATED_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.lastReauthenticatedAt - a.lastReauthenticatedAt : a.lastReauthenticatedAt - b.lastReauthenticatedAt))
    } else if (sortBy === UserSortValues.UserSessionSortBy.EXPIRES_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.expiresAt - a.expiresAt : a.expiresAt - b.expiresAt))
    } else if (sortBy === UserSortValues.UserSessionSortBy.CREATED_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    } else if (sortBy === UserSortValues.UserSessionSortBy.UPDATED_AT) {
      filteredItems.sort((a, b) => {
        const timeA = a.updatedAt ?? 0
        const timeB = b.updatedAt ?? 0
        return sortOrder === SortOrder.DESC ? timeB - timeA : timeA - timeB
      })
    }

    const totalCount = filteredItems.length
    const requestedPage = pageNumber ?? 1
    const requestedSize = pageSize ?? (totalCount > 0 ? totalCount : 20)

    if (requestedSize <= 0) {
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 }
    }

    const totalPages = Math.ceil(totalCount / requestedSize)
    const startIndex = Math.min((requestedPage - 1) * requestedSize, totalCount)
    const endIndex = Math.min(startIndex + requestedSize, totalCount)
    const paginatedItems = startIndex < totalCount ? filteredItems.slice(startIndex, endIndex) : []

    return { items: paginatedItems, totalCount, pageNumber: requestedPage, pageSize: requestedSize, totalPages }
  }

  /**
   * Observes filtered and paginated active sessions list.
   */
  public observeUserSessionsList(
    listener: UserSessionsListChangeListener,
    params?: GetUserSessionsListParams
  ): () => void {
    void this.getUserSessionsList(params).then((list) => listener(list))
    return this.encryptedSettings.observe(KEY_USER_SESSIONS, async () => {
      const list = await this.getUserSessionsList(params)
      listener(list)
    })
  }

  /**
   * Replaces stored sessions paged result.
   */
  public async updateUserSessionsList(userSessionsList: PagedResult<UserSession>): Promise<void> {
    const payloadItems = userSessionsList.items.map((item) => toUserSessionPayload(item))
    const pagedPayload = {
      items: payloadItems,
      total_count: userSessionsList.totalCount,
      page_number: userSessionsList.pageNumber,
      page_size: userSessionsList.pageSize,
      total_pages: userSessionsList.totalPages
    }
    await this.encryptedSettings.put(KEY_USER_SESSIONS, JSON.stringify(pagedPayload))
  }

  /**
   * Replaces stored sessions payload list.
   */
  public async updateUserSessionsPayloadList(userSessionsList: PagedResult<UserSessionPayload>): Promise<void> {
    const pagedPayload = {
      items: userSessionsList.items,
      total_count: userSessionsList.totalCount,
      page_number: userSessionsList.pageNumber,
      page_size: userSessionsList.pageSize,
      total_pages: userSessionsList.totalPages
    }
    await this.encryptedSettings.put(KEY_USER_SESSIONS, JSON.stringify(pagedPayload))
  }

  /**
   * Adds or updates a single user session.
   */
  public async addUserSession(userSession: UserSession): Promise<void> {
    const allItems = await this.getAllUserSessionsInternal()
    let updated = false

    const newItems = allItems.map((item) => {
      if (item.id === userSession.id) {
        updated = true
        return userSession
      }
      return item
    })

    if (!updated) {
      newItems.push(userSession)
    }

    const defaultSize = 20
    const totalCount = newItems.length
    const totalPages = Math.ceil(totalCount / defaultSize)

    await this.updateUserSessionsList({
      items: newItems,
      totalCount,
      pageNumber: 1,
      pageSize: defaultSize,
      totalPages
    })
  }

  /**
   * Removes a user session by ID.
   */
  public async removeUserSession(sessionId: UserSessionId): Promise<void> {
    await this.removeUserSessions([sessionId])
  }

  /**
   * Removes multiple user sessions by ID list.
   */
  public async removeUserSessions(sessionIds: UserSessionId[]): Promise<void> {
    const allItems = await this.getAllUserSessionsInternal()
    const targetSet = new Set(sessionIds)
    const newItems = allItems.filter((item) => !targetSet.has(item.id))

    if (newItems.length === allItems.length) {
      return
    }

    const defaultSize = 20
    const totalCount = newItems.length
    const totalPages = Math.ceil(totalCount / defaultSize)

    await this.updateUserSessionsList({
      items: newItems,
      totalCount,
      pageNumber: 1,
      pageSize: defaultSize,
      totalPages
    })
  }

  /**
   * Clears all cached user data.
   */
  public async clear(): Promise<void> {
    await this.encryptedSettings.remove(KEY_CURRENT_USER)
    await this.encryptedSettings.remove(KEY_USER_IDENTIFIERS)
    await this.encryptedSettings.remove(KEY_USER_SESSIONS)
  }
}
