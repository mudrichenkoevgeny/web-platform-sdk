import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalSessionListScreen } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

const createMockDeps = (): GlobalSessionListStoreDependencies => ({
  managementGetSessionsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userSessionMock(), userSessionMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as any,
  managementDeleteSessionUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onNavigateToSessionDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof GlobalSessionListScreen> = {
  title: 'Feature/ManagementUser/Session/GlobalSessionListScreen',
  component: GlobalSessionListScreen,
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
type Story = StoryObj<typeof GlobalSessionListScreen>

export const Default: Story = {}
