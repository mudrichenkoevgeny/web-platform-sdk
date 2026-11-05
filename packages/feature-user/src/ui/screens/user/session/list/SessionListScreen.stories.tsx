import type { Meta, StoryObj } from '@storybook/react-vite'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionListScreen } from './SessionListScreen'
import { createSelfSessionListDataSource } from './session-list-data-source'

const createMockDeps = () => ({
  dataSource: createSelfSessionListDataSource({
    getSessionsUseCase: {
      execute: async () =>
        appResultSuccess(createTestPagedResult({
          items: createTestUserSessionSummaryList(2)
        }))
    },
    deleteSessionUseCase: {
      execute: async () => appResultSuccess(undefined)
    },
    deleteAllOtherSessionsUseCase: {
      execute: async () => appResultSuccess(undefined)
    }
  }),
  onNavigateToSessionDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SessionListScreen> = {
  title: 'Feature/User/Main/Session/List/SessionListScreen',
  component: SessionListScreen,
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
type Story = StoryObj<typeof SessionListScreen>

export const Default: Story = {}
