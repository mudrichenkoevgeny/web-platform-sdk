import type { Meta, StoryObj } from '@storybook/react'
import { AppType, toUserIdOrThrow, toUserIdentifierIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import { SelfIdentifierListScreen } from '@/ui/screens/user/identifier/list/SelfIdentifierListScreen'
import type { SelfIdentifierListStoreDependencies } from '@/ui/screens/user/identifier/list/self-identifier-list-store'

const mockIdentifier1: UserIdentifierSummary = {
  id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
  userId: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: 'user1@example.com',
  displayName: 'user1@example.com'
}

const mockIdentifier2: UserIdentifierSummary = {
  ...mockIdentifier1,
  id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440002'),
  identifier: 'user2@example.com',
  displayName: 'user2@example.com'
}

const createMockDeps = (): SelfIdentifierListStoreDependencies => ({
  appType: AppType.CLIENT,
  getUserIdentifiersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [mockIdentifier1, mockIdentifier2],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 1
      })
  } as unknown as SelfIdentifierListStoreDependencies['getUserIdentifiersUseCase'],
  getAvailableUserAuthProvidersUseCase: {
    execute: async () =>
      appResultSuccess({
        primary: [UserAuthProvider.EMAIL],
        secondary: [UserAuthProvider.GOOGLE]
      })
  } as unknown as SelfIdentifierListStoreDependencies['getAvailableUserAuthProvidersUseCase'],
  onNavigateToIdentifierDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SelfIdentifierListScreen> = {
  title: 'Feature/User/Main/Identifier/List/SelfIdentifierListScreen',
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
