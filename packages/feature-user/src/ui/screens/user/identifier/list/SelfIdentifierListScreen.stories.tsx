import type { Meta, StoryObj } from '@storybook/react'
import { AppType, createTestPagedResult, createTestUserIdentifierSummaryList, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfIdentifierListScreen } from '@/ui/screens/user/identifier/list/SelfIdentifierListScreen'
import type { SelfIdentifierListStoreDependencies } from '@/ui/screens/user/identifier/list/self-identifier-list-store'

const createMockDeps = (): SelfIdentifierListStoreDependencies => ({
  appType: AppType.CLIENT,
  getUserIdentifiersUseCase: {
    execute: async () =>
      appResultSuccess(createTestPagedResult({
        items: createTestUserIdentifierSummaryList(2)
      }))
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
