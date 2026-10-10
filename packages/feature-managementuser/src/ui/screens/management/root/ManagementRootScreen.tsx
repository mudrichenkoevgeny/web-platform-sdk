import React, { forwardRef, useEffect, useState } from 'react'
import type { UserId, UserIdentifierId, UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import {
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import {
  appResultFailure,
  cn,
  CommonError,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierDetailScreen, SessionDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type {
  GetSessionUseCase,
  DeleteSessionUseCase,
  GetUserIdentifierUseCase,
  DeleteUserIdentifierUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import { AuditEventDetailScreen } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import { AuditEventListScreen } from '@/ui/screens/management/audit/list/AuditEventListScreen'
import { GlobalIdentifierListScreen } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import { UserIdentifierListScreen } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import { MainManagementScreen } from '@/ui/screens/management/main/MainManagementScreen'
import {
  ManagementRootProvider,
  useManagementRootStore
} from '@/ui/screens/management/root/ManagementRootStore'
import type { ManagementRootStoreDependencies } from '@/ui/screens/management/root/ManagementRootStore'
import { GlobalSessionListScreen } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import { UserSessionListScreen } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import { EditAuthSettingsScreen } from '@/ui/screens/management/settings/auth/EditAuthSettingsScreen'
import { EditGlobalSettingsScreen } from '@/ui/screens/management/settings/global/EditGlobalSettingsScreen'
import { EditSecuritySettingsScreen } from '@/ui/screens/management/settings/security/EditSecuritySettingsScreen'
import { CreateUserScreen } from '@/ui/screens/management/user/create/CreateUserScreen'
import { UserDetailScreen } from '@/ui/screens/management/user/detail/UserDetailScreen'
import { GlobalUserListScreen } from '@/ui/screens/management/user/global-list/GlobalUserListScreen'

const ManagementRootContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const stack = useManagementRootStore((s) => s.stack)
  const deps = useManagementRootStore((s) => s.dependencies)
  const push = useManagementRootStore((s) => s.push)
  const pop = useManagementRootStore((s) => s.pop)

  const [observedUserId, setObservedUserId] = useState<UserId | null>(null)

  useEffect(() => {
    if (!deps.selfManagementUserRepository) {
      return
    }
    return deps.selfManagementUserRepository.observeCurrentUser((user) => {
      setObservedUserId(user?.id ?? null)
    })
  }, [deps.selfManagementUserRepository])

  const activeUserId = observedUserId ?? deps.currentUserId ?? null

  const handleNavigateToProfile = deps.onNavigateToProfile ?? (() => {
    if (activeUserId) {
      push({ type: 'user_detail', userId: activeUserId })
    } else {
      push({ type: 'main' })
    }
  })

  const activeDestination = stack[stack.length - 1] ?? { type: 'main' }

  switch (activeDestination.type) {
    case 'main':
      return (
        <MainManagementScreen
          dependencies={{
            onEditAuthSettingsClick: () => push({ type: 'edit_auth_settings' }),
            onEditGlobalSettingsClick: () => push({ type: 'edit_global_settings' }),
            onEditSecuritySettingsClick: () => push({ type: 'edit_security_settings' }),
            onGlobalUserListClick: () => push({ type: 'global_user_list' }),
            onAuditEventListClick: () => push({ type: 'audit_event_list' }),
            onGlobalSessionListClick: () => push({ type: 'global_session_list' }),
            onGlobalIdentifierListClick: () => push({ type: 'global_identifier_list' })
          }}
          strings={strings}
        />
      )

    case 'edit_auth_settings':
      return (
        <EditAuthSettingsScreen
          dependencies={{
            getManagementAuthSettingsUseCase: deps.getManagementAuthSettingsUseCase,
            saveRemoteAuthSettingsUseCase: deps.saveRemoteAuthSettingsUseCase,
            resetRemoteAuthSettingsUseCase: deps.resetRemoteAuthSettingsUseCase,
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'edit_global_settings':
      return (
        <EditGlobalSettingsScreen
          dependencies={{
            getManagementGlobalSettingsUseCase: deps.getManagementGlobalSettingsUseCase,
            saveRemoteGlobalSettingsUseCase: deps.saveRemoteGlobalSettingsUseCase,
            resetRemoteGlobalSettingsUseCase: deps.resetRemoteGlobalSettingsUseCase,
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'edit_security_settings':
      return (
        <EditSecuritySettingsScreen
          dependencies={{
            getManagementSecuritySettingsUseCase: deps.getManagementSecuritySettingsUseCase,
            saveRemoteSecuritySettingsUseCase: deps.saveRemoteSecuritySettingsUseCase,
            resetRemoteSecuritySettingsUseCase: deps.resetRemoteSecuritySettingsUseCase,
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'global_user_list':
      return (
        <GlobalUserListScreen
          dependencies={{
            getUsersUseCase: deps.getUsersUseCase,
            onNavigateToUserDetail: (userId) => push({ type: 'user_detail', userId }),
            onNavigateToCreateUser: () => push({ type: 'create_user' }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'create_user':
      return (
        <CreateUserScreen
          dependencies={{
            createUserUseCase: deps.createUserUseCase,
            onSuccess: pop,
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'user_detail':
      return (
        <UserDetailScreen
          dependencies={{
            userId: activeDestination.userId,
            getUserUseCase: deps.getUserUseCase,
            updateUserUseCase: deps.updateUserUseCase,
            deleteUserUseCase: deps.deleteUserUseCase,
            managementDisableTotpUseCase: deps.managementDisableTotpUseCase,
            onNavigateToSessions: (userId) => push({ type: 'user_session_list', userId }),
            onNavigateToIdentifiers: (userId) => push({ type: 'user_identifier_list', userId }),
            onNavigateToAuditEvents: (userId) => push({
              type: 'audit_event_list',
              params: {
                filters: {
                  actorIds: [userId]
                }
              }
            }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'user_session_list':
      return (
        <UserSessionListScreen
          dependencies={{
            userId: activeDestination.userId,
            managementGetSessionsUseCase: deps.managementGetSessionsUseCase,
            managementDeleteSessionUseCase: deps.managementDeleteSessionUseCase,
            managementDeleteAllUserSessionsUseCase: deps.managementDeleteAllUserSessionsUseCase,
            onNavigateToSessionDetail: (session) => push({ type: 'session_detail', sessionId: session.id }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'user_identifier_list':
      return (
        <UserIdentifierListScreen
          dependencies={{
            userId: activeDestination.userId,
            managementGetIdentifiersUseCase: deps.managementGetIdentifiersUseCase,
            onIdentifierSelect: (identifierId) => push({ type: 'identifier_detail', identifierId: toUserIdentifierIdOrThrow(identifierId) }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'audit_event_list':
      return (
        <AuditEventListScreen
          dependencies={{
            getAuditEventsUseCase: deps.getAuditEventsUseCase,
            params: activeDestination.params,
            onNavigateToEventDetail: (eventId) => push({ type: 'audit_event_detail', eventId }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'audit_event_detail':
      return (
        <AuditEventDetailScreen
          dependencies={{
            eventId: activeDestination.eventId,
            getAuditEventUseCase: deps.getAuditEventUseCase,
            currentUserId: activeUserId,
            onNavigateToUserDetail: (userId) => push({ type: 'user_detail', userId }),
            onNavigateToSessionDetail: (sessionId) => push({ type: 'session_detail', sessionId }),
            onNavigateToIdentifierDetail: (identifierId) => push({ type: 'identifier_detail', identifierId }),
            onNavigateToProfile: handleNavigateToProfile,
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'global_session_list':
      return (
        <GlobalSessionListScreen
          dependencies={{
            managementGetSessionsUseCase: deps.managementGetSessionsUseCase,
            managementDeleteSessionUseCase: deps.managementDeleteSessionUseCase,
            onNavigateToSessionDetail: (session) => push({ type: 'session_detail', sessionId: session.id }),
            onNavigateToUserDetail: (userId) => push({ type: 'user_detail', userId: toUserIdOrThrow(userId) }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'session_detail': {
      const getSessionUseCase: GetSessionUseCase = {
        execute: async (id: UserSessionId) => {
          if (deps.managementGetSessionUseCase) {
            return deps.managementGetSessionUseCase.execute(id)
          }
          return appResultFailure(CommonError.unknown())
        }
      }

      const deleteSessionUseCase: DeleteSessionUseCase = {
        execute: async (sessionId: UserSessionId) => {
          if (!deps.managementGetSessionUseCase) {
            return appResultFailure(CommonError.unknown())
          }

          const sessionRes = await deps.managementGetSessionUseCase.execute(sessionId)
          if (!isSuccess(sessionRes)) {
            return sessionRes
          }

          return deps.managementDeleteSessionUseCase.execute(sessionRes.data.userId, sessionId)
        }
      }

      return (
        <SessionDetailScreen
          dependencies={{
            sessionId: activeDestination.sessionId,
            getSessionUseCase,
            deleteSessionUseCase,
            onNavigateToIdentifierDetail: (identifierId) => push({ type: 'identifier_detail', identifierId }),
            onNavigateToUserDetail: (userId) => push({ type: 'user_detail', userId }),
            onNavigateToProfile: handleNavigateToProfile,
            onBack: pop
          }}
          strings={strings}
        />
      )
    }

    case 'global_identifier_list':
      return (
        <GlobalIdentifierListScreen
          dependencies={{
            managementGetIdentifiersUseCase: deps.managementGetIdentifiersUseCase,
            managementDeleteIdentifierUseCase: deps.managementDeleteIdentifierUseCase,
            onNavigateToIdentifierDetail: (identifierId) => push({ type: 'identifier_detail', identifierId: toUserIdentifierIdOrThrow(identifierId) }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'identifier_detail': {
      const getUserIdentifierUseCase: GetUserIdentifierUseCase = {
        execute: async (id: UserIdentifierId) => {
          if (deps.managementGetIdentifierUseCase) {
            return deps.managementGetIdentifierUseCase.execute(id)
          }
          return appResultFailure(CommonError.unknown())
        }
      }

      const deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase = {
        execute: async (id: UserIdentifierId) => {
          if (!deps.managementGetIdentifierUseCase) {
            return appResultFailure(CommonError.unknown())
          }

          const idRes = await deps.managementGetIdentifierUseCase.execute(id)
          if (!isSuccess(idRes)) {
            return idRes
          }

          return deps.managementDeleteIdentifierUseCase.execute(idRes.data.userId, id)
        }
      }

      return (
        <IdentifierDetailScreen
          dependencies={{
            identifierId: activeDestination.identifierId,
            getUserIdentifierUseCase,
            deleteUserIdentifierUseCase,
            deletePasswordUseCase: {
              execute: async (id: UserIdentifierId) => {
                if (!deps.managementGetIdentifierUseCase) {
                  return appResultFailure(CommonError.unknown())
                }

                const idRes = await deps.managementGetIdentifierUseCase.execute(id)
                if (!isSuccess(idRes)) {
                  return idRes
                }

                return deps.managementDeleteIdentifierPasswordUseCase.execute(idRes.data.userId, id)
              }
            },
            onNavigateToUserDetail: (userId) => push({ type: 'user_detail', userId }),
            onNavigateToProfile: handleNavigateToProfile,
            onBack: pop
          }}
          strings={strings}
        />
      )
    }
  }
}

export interface ManagementRootScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: ManagementRootStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const ManagementRootScreen = forwardRef<HTMLDivElement, ManagementRootScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <ManagementRootProvider dependencies={dependencies}>
          <ManagementRootContent strings={strings} />
        </ManagementRootProvider>
      </div>
    )
  }
)

ManagementRootScreen.displayName = 'ManagementRootScreen'
