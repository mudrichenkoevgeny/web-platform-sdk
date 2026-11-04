import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/main-management-store'

export const mainManagementDependenciesMock = (
  overrides?: Partial<MainManagementStoreDependencies>
): MainManagementStoreDependencies => ({
  onSettingsClick: () => {},
  onGlobalUserListClick: () => {},
  onAuditEventListClick: () => {},
  onGlobalSessionListClick: () => {},
  onGlobalIdentifierListClick: () => {},
  onStorageFileListClick: () => {},
  ...overrides
})
