import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRootContainer } from '@/ui/screens/auth/unlock/root/UnlockRootContainer'

const meta: Meta<typeof UnlockRootContainer> = {
  title: 'Feature/User/Auth/Unlock/Root/UnlockRootContainer',
  component: UnlockRootContainer,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    onDismiss: () => {}
  }
}

export default meta
type Story = StoryObj<typeof UnlockRootContainer>

export const DesktopDialog: Story = {
  args: {
    children: (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Account Unlock Flow</h2>
        <p className="text-sm text-muted-foreground mt-2">Desktop dialog surface</p>
      </div>
    )
  }
}
