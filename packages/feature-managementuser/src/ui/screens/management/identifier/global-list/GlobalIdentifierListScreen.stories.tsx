import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalIdentifierListScreen } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

const createMockDeps = (): GlobalIdentifierListStoreDependencies => ({
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

const meta: Meta<typeof GlobalIdentifierListScreen> = {
  title: 'Feature/ManagementUser/Identifier/GlobalIdentifierListScreen',
  component: GlobalIdentifierListScreen,
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
type Story = StoryObj<typeof GlobalIdentifierListScreen>

export const Default: Story = {}
