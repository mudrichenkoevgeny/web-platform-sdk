import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type {
  GetFilesUseCase,
  GetFileDetailUseCase,
  UploadFileUseCase,
  DeleteFileUseCase,
  DeleteFilesBatchUseCase,
  GetManagementStorageSettingsUseCase,
  ResetManagementStorageSettingsUseCase,
  UpdateManagementStorageSettingsUseCase,
  ManagementGetFilesUseCase,
  ManagementGetFileDetailUseCase,
  ManagementDeleteFileUseCase,
  ManagementDeleteFilesBatchUseCase
} from '@mudrichenkoevgeny/web-platform-sdk/core/storage'
import type { GetAuditEventUseCase } from '@/feature/management-user/usecase/audit/get-audit-event-use-case'
import type { GetAuditEventsUseCase } from '@/feature/management-user/usecase/audit/get-audit-events-use-case'
import type { GetManagementAuthSettingsUseCase } from '@/feature/management-user/usecase/auth/settings/get-management-auth-settings-use-case'
import type { ResetManagementAuthSettingsUseCase } from '@/feature/management-user/usecase/auth/settings/reset-management-auth-settings-use-case'
import type { UpdateManagementAuthSettingsUseCase } from '@/feature/management-user/usecase/auth/settings/update-management-auth-settings-use-case'
import type { GetManagementGlobalSettingsUseCase } from '@/feature/management-user/usecase/global-settings/get-management-global-settings-use-case'
import type { ResetManagementGlobalSettingsUseCase } from '@/feature/management-user/usecase/global-settings/reset-management-global-settings-use-case'
import type { UpdateManagementGlobalSettingsUseCase } from '@/feature/management-user/usecase/global-settings/update-management-global-settings-use-case'
import type { ManagementDeleteIdentifierPasswordUseCase } from '@/feature/management-user/usecase/identifier/management-delete-identifier-password-use-case'
import type { ManagementDeleteIdentifierUseCase } from '@/feature/management-user/usecase/identifier/management-delete-identifier-use-case'
import type { ManagementGetIdentifierUseCase } from '@/feature/management-user/usecase/identifier/management-get-identifier-use-case'
import type { ManagementGetIdentifiersUseCase } from '@/feature/management-user/usecase/identifier/management-get-identifiers-use-case'
import type { GetManagementSecuritySettingsUseCase } from '@/feature/management-user/usecase/security/settings/get-management-security-settings-use-case'
import type { ResetManagementSecuritySettingsUseCase } from '@/feature/management-user/usecase/security/settings/reset-management-security-settings-use-case'
import type { UpdateManagementSecuritySettingsUseCase } from '@/feature/management-user/usecase/security/settings/update-management-security-settings-use-case'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/feature/management-user/usecase/session/management-delete-all-user-sessions-use-case'
import type { ManagementDeleteSessionUseCase } from '@/feature/management-user/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionUseCase } from '@/feature/management-user/usecase/session/management-get-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/feature/management-user/usecase/session/management-get-sessions-use-case'
import type { CreateUserUseCase } from '@/feature/management-user/usecase/user/create-user-use-case'
import type { DeleteUserUseCase } from '@/feature/management-user/usecase/user/delete-user-use-case'
import type { GetUserUseCase } from '@/feature/management-user/usecase/user/get-user-use-case'
import type { GetUsersUseCase } from '@/feature/management-user/usecase/user/get-users-use-case'
import type { UpdateUserUseCase } from '@/feature/management-user/usecase/user/update-user-use-case'
import type { ManagementDisableTotpUseCase } from '@/feature/management-user/usecase/user/security/management-disable-totp-use-case'
import type { SelfManagementUserRepository } from '@/feature/management-user/repository/user/self-management-user-repository'

export interface ManagementRootStoreDependencies {
  currentUserId?: UserId | null
  selfManagementUserRepository?: SelfManagementUserRepository
  getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  updateManagementAuthSettingsUseCase: UpdateManagementAuthSettingsUseCase
  resetManagementAuthSettingsUseCase: ResetManagementAuthSettingsUseCase
  getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  updateManagementGlobalSettingsUseCase: UpdateManagementGlobalSettingsUseCase
  resetManagementGlobalSettingsUseCase: ResetManagementGlobalSettingsUseCase
  getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  updateManagementSecuritySettingsUseCase: UpdateManagementSecuritySettingsUseCase
  resetManagementSecuritySettingsUseCase: ResetManagementSecuritySettingsUseCase
  getManagementStorageSettingsUseCase: GetManagementStorageSettingsUseCase
  updateManagementStorageSettingsUseCase: UpdateManagementStorageSettingsUseCase
  resetManagementStorageSettingsUseCase: ResetManagementStorageSettingsUseCase
  managementGetFilesUseCase: ManagementGetFilesUseCase
  managementGetFileDetailUseCase?: ManagementGetFileDetailUseCase
  managementDeleteFileUseCase: ManagementDeleteFileUseCase
  managementDeleteFilesBatchUseCase: ManagementDeleteFilesBatchUseCase
  selfManagementGetFilesUseCase?: GetFilesUseCase
  selfManagementGetFileDetailUseCase?: GetFileDetailUseCase
  selfManagementUploadFileUseCase?: UploadFileUseCase
  selfManagementDeleteFileUseCase?: DeleteFileUseCase
  selfManagementDeleteFilesBatchUseCase?: DeleteFilesBatchUseCase
  getUsersUseCase: GetUsersUseCase
  getUserUseCase: GetUserUseCase
  createUserUseCase: CreateUserUseCase
  updateUserUseCase: UpdateUserUseCase
  deleteUserUseCase: DeleteUserUseCase
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementGetSessionUseCase?: ManagementGetSessionUseCase
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  managementGetIdentifierUseCase?: ManagementGetIdentifierUseCase
  managementDisableTotpUseCase: ManagementDisableTotpUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  managementDeleteIdentifierPasswordUseCase: ManagementDeleteIdentifierPasswordUseCase
  getAuditEventsUseCase: GetAuditEventsUseCase
  getAuditEventUseCase: GetAuditEventUseCase
}
