import type { Meta, StoryObj } from '@storybook/react-vite'
import { createTestPagedResult, createTestUserIdentifierSummaryList, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierListScreen } from './IdentifierListScreen'
import { createSelfIdentifierListDataSource } from './identifier-list-data-source'

const createMockDeps = () => ({
  dataSource: createSelfIdentifierListDataSource({
    getIdentifiersUseCase: {
      execute: async () =>
        appResultSuccess(createTestPagedResult({
          items: createTestUserIdentifierSummaryList(2)
        }))
    },
    getAvailableUserAuthProvidersUseCase: {
      execute: async () =>
        appResultSuccess({
          primary: [UserAuthProvider.EMAIL],
          secondary: [UserAuthProvider.GOOGLE]
        })
    }
  }),
  onNavigateToIdentifierDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof IdentifierListScreen> = {
  title: 'Feature/User/Main/Identifier/List/IdentifierListScreen',
  component: IdentifierListScreen,
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
type Story = StoryObj<typeof IdentifierListScreen>

export const Default: Story = {}
