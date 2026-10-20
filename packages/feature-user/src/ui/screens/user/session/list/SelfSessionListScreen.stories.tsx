import type { Meta, StoryObj } from '@storybook/react'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfSessionListScreen } from '@/ui/screens/user/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/user/session/list/self-session-list-store'

const createMockDeps = (): SelfSessionListStoreDependencies => ({
  getSessionsUseCase: {
    execute: async () =>
      appResultSuccess(createTestPagedResult({
        items: createTestUserSessionSummaryList(2)
      }))
  } as unknown as SelfSessionListStoreDependencies['getSessionsUseCase'],
  deleteSessionUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as SelfSessionListStoreDependencies['deleteSessionUseCase'],
  deleteAllOtherSessionsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as SelfSessionListStoreDependencies['deleteAllOtherSessionsUseCase'],
  onNavigateToSessionDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SelfSessionListScreen> = {
  title: 'Feature/User/Main/Session/List/SelfSessionListScreen',
  component: SelfSessionListScreen,
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
type Story = StoryObj<typeof SelfSessionListScreen>

export const Default: Story = {}
