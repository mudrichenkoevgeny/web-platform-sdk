import type { GetUserIdentifiersListParams, GetUserSessionsListParams } from '@/storage/user/user-storage'
import {
  pagedResultSchema,
  SortOrder,
  toUserIdentifierSummary,
  toUserIdentifierSummaryPayload,
  toUserPrivate,
  toUserPrivatePayload,
  toUserSessionSummary,
  toUserSessionSummaryPayload,
  userIdentifierSummaryPayloadSchema,
  userPrivatePayloadSchema,
  userSessionSummaryPayloadSchema,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  PagedResult,
  UserIdentifierId,
  UserIdentifierSummary,
  UserIdentifierSummaryPayload,
  UserPrivate,
  UserSessionId,
  UserSessionSummary,
  UserSessionSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserStorage } from '@/storage/user/user-storage'
import type {
  UserChangeListener,
  UserIdentifiersListChangeListener,
  UserSessionsListChangeListener
} from '@/storage/user/user-storage'

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
  public async getCurrentUser(): Promise<UserPrivate | null> {
    const rawData = await this.encryptedSettings.get(KEY_CURRENT_USER)
    if (!rawData) {
      return null
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = userPrivatePayloadSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_CURRENT_USER)
        return null
      }
      return toUserPrivate(validationResult.data)
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
  public async updateCurrentUser(currentUser: UserPrivate): Promise<void> {
    const payload = toUserPrivatePayload(currentUser)
    await this.encryptedSettings.put(KEY_CURRENT_USER, JSON.stringify(payload))
  }

  private async getAllUserIdentifiersInternal(): Promise<UserIdentifierSummary[]> {
    const rawData = await this.encryptedSettings.get(KEY_USER_IDENTIFIERS)
    if (!rawData) {
      return []
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = pagedResultSchema(userIdentifierSummaryPayloadSchema).safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_USER_IDENTIFIERS)
        return []
      }
      return validationResult.data.items.map((payload) => toUserIdentifierSummary(payload))
    } catch {
      await this.encryptedSettings.remove(KEY_USER_IDENTIFIERS)
      return []
    }
  }

  /**
   * Retrieves filtered and paginated user identifiers list.
   */
  public async getUserIdentifiersList(params?: GetUserIdentifiersListParams): Promise<PagedResult<UserIdentifierSummary>> {
    const {
      pageNumber,
      pageSize,
      userAuthProviders,
      identifiers
    } = params || {}

    const allItems = await this.getAllUserIdentifiersInternal()
    if (allItems.length === 0) {
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 }
    }

    const filteredItems = allItems.filter((item) => {
      const matchesProvider = !userAuthProviders || userAuthProviders.includes(item.userAuthProvider)
      const matchesValue = !identifiers || identifiers.some((pattern) => item.identifier.toLowerCase().includes(pattern.toLowerCase()))
      return matchesProvider && matchesValue
    })

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
  public async updateUserIdentifiersList(userIdentifiersList: PagedResult<UserIdentifierSummary>): Promise<void> {
    const payloadItems = userIdentifiersList.items.map((item) => toUserIdentifierSummaryPayload(item))
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
    userIdentifiersList: PagedResult<UserIdentifierSummaryPayload>
  ): Promise<void> {
    const pagedPayload = {
      items: userIdentifiersList.items,
      total_count: userIdentifiersList.totalCount,
      page_number: userIdentifiersList.pageNumber,
      page_size: userIdentifiersList.pageSize,
      total_pages: userIdentifiersList.totalPages
    }
    await this.encryptedSettings.put(KEY_USER_IDENTIFIERS, JSON.stringify(pagedPayload))
  }

  /**
   * Adds or updates a single user identifier.
   */
  public async addUserIdentifier(userIdentifier: UserIdentifierSummary): Promise<void> {
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

  private async getAllUserSessionsInternal(): Promise<UserSessionSummary[]> {
    const rawData = await this.encryptedSettings.get(KEY_USER_SESSIONS)
    if (!rawData) {
      return []
    }

    try {
      const parsedJson = JSON.parse(rawData)
      const validationResult = pagedResultSchema(userSessionSummaryPayloadSchema).safeParse(parsedJson)
      if (!validationResult.success) {
        await this.encryptedSettings.remove(KEY_USER_SESSIONS)
        return []
      }
      return validationResult.data.items.map((payload) => toUserSessionSummary(payload))
    } catch {
      await this.encryptedSettings.remove(KEY_USER_SESSIONS)
      return []
    }
  }

  /**
   * Retrieves filtered and paginated active sessions list.
   */
  public async getUserSessionsList(params?: GetUserSessionsListParams): Promise<PagedResult<UserSessionSummary>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userAuthProviders,
      clientTypes,
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
      const matchesProviders = !userAuthProviders || userAuthProviders.includes(item.identifierAuthProvider)
      const matchesClientTypes = !clientTypes || (item.clientDeviceInfo.clientType && clientTypes.includes(item.clientDeviceInfo.clientType))
      const matchesLanguages = !languages || (item.clientDeviceInfo.language && languages.some((pattern) => item.clientDeviceInfo.language?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesDeviceIds = !deviceIds || (item.clientDeviceInfo.deviceId && deviceIds.includes(item.clientDeviceInfo.deviceId))
      const matchesDeviceNames = !deviceNames || (item.clientDeviceInfo.deviceName && deviceNames.some((pattern) => item.clientDeviceInfo.deviceName?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesAppVersions = !appVersions || (item.clientDeviceInfo.appVersion && appVersions.some((pattern) => item.clientDeviceInfo.appVersion?.toLowerCase().includes(pattern.toLowerCase())))
      const matchesOsVersions = !operationSystemVersions || (item.clientDeviceInfo.operationSystemVersion && operationSystemVersions.some((pattern) => item.clientDeviceInfo.operationSystemVersion?.toLowerCase().includes(pattern.toLowerCase())))

      return matchesProviders && matchesClientTypes &&
        matchesLanguages && matchesDeviceIds && matchesDeviceNames && matchesAppVersions &&
        matchesOsVersions
    })

    if (sortBy === UserSortValues.UserSessionSortBy.EXPIRES_AT) {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.expiresAt - a.expiresAt : a.expiresAt - b.expiresAt))
    } else {
      filteredItems.sort((a, b) => (sortOrder === SortOrder.DESC ? b.lastAccessedAt - a.lastAccessedAt : a.lastAccessedAt - b.lastAccessedAt))
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
  public async updateUserSessionsList(userSessionsList: PagedResult<UserSessionSummary>): Promise<void> {
    const payloadItems = userSessionsList.items.map((item) => toUserSessionSummaryPayload(item))
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
  public async updateUserSessionsPayloadList(userSessionsList: PagedResult<UserSessionSummaryPayload>): Promise<void> {
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
  public async addUserSession(userSession: UserSessionSummary): Promise<void> {
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
