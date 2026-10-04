import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginRootContainer } from '@/ui/screens/auth/login/root/LoginRootContainer'

const meta: Meta<typeof LoginRootContainer> = {
  title: 'Feature/User/Auth/Login/LoginRootContainer',
  component: LoginRootContainer,
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
type Story = StoryObj<typeof LoginRootContainer>

export const DesktopDialog: Story = {
  args: {
    children: (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Login Flow Container</h2>
        <p className="text-sm text-muted-foreground mt-2">Desktop dialog surface</p>
      </div>
    )
  }
}

export const MobileBottomSheet: Story = {
  args: {
    isMobile: true,
    children: (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Login Flow Container</h2>
        <p className="text-sm text-muted-foreground mt-2">Mobile bottom sheet surface</p>
      </div>
    )
  }
}
