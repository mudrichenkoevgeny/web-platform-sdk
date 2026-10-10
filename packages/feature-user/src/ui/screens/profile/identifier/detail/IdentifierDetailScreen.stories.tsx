import type { Meta, StoryObj } from '@storybook/react'
import { toUserIdentifierIdOrThrow, toUserIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierDetailScreen } from '@/ui/screens/profile/identifier/detail/IdentifierDetailScreen'
import type { IdentifierDetailStoreDependencies } from '@/ui/screens/profile/identifier/detail/identifier-detail-store'

const mockIdentifier: UserIdentifierPrivate = {
  id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
  userId: toUserIdOrThrow('usr_12345'),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: 'user@example.com',
  displayName: 'user@example.com',
  externalProviderEmail: null,
  isSensitiveValuesMasked: false,
  createdAt: 1680000000000,
  updatedAt: null
}

const createMockDeps = (isCurrent = false): IdentifierDetailStoreDependencies => ({
  identifier: mockIdentifier,
  isCurrentIdentifier: isCurrent,
  deleteUserIdentifierUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  emailChangePasswordUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  onIdentifierDeleted: () => {},
  onNavigateToUserDetail: () => {},
  onNavigateToProfile: () => {},
  onBack: () => {}
})

const meta: Meta<typeof IdentifierDetailScreen> = {
  title: 'Feature/User/Profile/Identifier/Detail/IdentifierDetailScreen',
  component: IdentifierDetailScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md h-[36rem] border rounded-xl overflow-hidden bg-background">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps(false)
  }
}

export default meta
type Story = StoryObj<typeof IdentifierDetailScreen>

export const Default: Story = {}

export const CurrentIdentifier: Story = {
  args: {
    dependencies: createMockDeps(true)
  }
}
