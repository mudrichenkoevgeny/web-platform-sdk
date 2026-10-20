import type { Meta, StoryObj } from '@storybook/react'
import { TEST_EMAIL, TEST_IDENTIFIER_ID, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierDetailScreen } from '@/ui/screens/user/identifier/detail/IdentifierDetailScreen'
import type { IdentifierDetailStoreDependencies } from '@/ui/screens/user/identifier/detail/identifier-detail-store'

const mockIdentifier: UserIdentifierPrivate = {
  id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID),
  userId: toUserIdOrThrow(TEST_USER_ID),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: TEST_EMAIL,
  displayName: TEST_EMAIL,
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
  },
  emailChangePasswordUseCase: {
    execute: async () => appResultSuccess(undefined)
  },
  onIdentifierDeleted: () => {},
  onNavigateToUserDetail: () => {},
  onNavigateToUserMain: () => {},
  onBack: () => {}
})

const meta: Meta<typeof IdentifierDetailScreen> = {
  title: 'Feature/User/Main/Identifier/Detail/IdentifierDetailScreen',
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
