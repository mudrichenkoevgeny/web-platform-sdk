import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ProfileRootContainer } from '@/ui/screens/profile/root/ProfileRootContainer'

const meta: Meta<typeof ProfileRootContainer> = {
  title: 'Feature/User/Profile/Root/ProfileRootContainer',
  component: ProfileRootContainer,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    onDismiss: () => {},
    children: (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Profile Container Preview</h2>
        <p className="text-sm text-muted-foreground mt-2">Inner screen stack goes here.</p>
      </div>
    )
  }
}

export default meta
type Story = StoryObj<typeof ProfileRootContainer>

export const Default: Story = {}

export const MobileSheet: Story = {
  args: {
    isMobile: true
  }
}
