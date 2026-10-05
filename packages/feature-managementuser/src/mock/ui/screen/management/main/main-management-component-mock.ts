import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

export const mainManagementDependenciesMock = (
  overrides?: Partial<MainManagementStoreDependencies>
): MainManagementStoreDependencies => ({
  onEditAuthSettingsClick: () => {},
  onEditGlobalSettingsClick: () => {},
  onEditSecuritySettingsClick: () => {},
  onGlobalUserListClick: () => {},
  onAuditEventListClick: () => {},
  onGlobalSessionListClick: () => {},
  onGlobalIdentifierListClick: () => {},
  ...overrides
})
