import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserIdentifierListScreen } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'

const createMockDeps = (): UserIdentifierListStoreDependencies => ({
  userId: 'usr_123' as any,
  managementGetIdentifiersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userIdentifierMock(), userIdentifierMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as any,
  onIdentifierSelect: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UserIdentifierListScreen> = {
  title: 'Feature/ManagementUser/Identifier/UserIdentifierListScreen',
  component: UserIdentifierListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof UserIdentifierListScreen>

export const Default: Story = {}
