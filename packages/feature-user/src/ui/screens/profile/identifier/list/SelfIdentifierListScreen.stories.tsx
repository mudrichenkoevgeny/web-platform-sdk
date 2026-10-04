import type { Meta, StoryObj } from '@storybook/react'
import { AppType, toUserIdentifierIdOrThrow, toUserIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { SelfIdentifierListScreen } from '@/ui/screens/profile/identifier/list/SelfIdentifierListScreen'
import type { SelfIdentifierListStoreDependencies } from '@/ui/screens/profile/identifier/list/SelfIdentifierListStore'

const mockIdentifier1: UserIdentifier = {
  id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
  userId: toUserIdOrThrow('usr_123'),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: 'user1@example.com',
  displayName: 'user1@example.com',
  externalProviderEmail: null,
  isSensitiveValuesMasked: false,
  createdAt: 1680000000000,
  updatedAt: null
}

const mockIdentifier2: UserIdentifier = {
  ...mockIdentifier1,
  id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440002'),
  identifier: 'user2@example.com',
  displayName: 'user2@example.com'
}

const createMockDeps = (): SelfIdentifierListStoreDependencies => ({
  appType: AppType.CLIENT,
  getUserIdentifiersUseCase: {
    invoke: async () =>
      appResultSuccess({
        items: [mockIdentifier1, mockIdentifier2],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 1
      })
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    invoke: async () =>
      appResultSuccess({
        primary: [UserAuthProvider.EMAIL],
        secondary: [UserAuthProvider.GOOGLE]
      })
  } as any,
  onIdentifierSelect: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SelfIdentifierListScreen> = {
  title: 'Feature/User/Profile/Identifier/List/SelfIdentifierListScreen',
  component: SelfIdentifierListScreen,
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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof SelfIdentifierListScreen>

export const Default: Story = {}
