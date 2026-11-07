import type { Meta, StoryObj } from '@storybook/react'
import { UserRootContainer } from '@/ui/screens/user/root/UserRootContainer'

const meta: Meta<typeof UserRootContainer> = {
  title: 'Feature/User/Root/UserRootContainer',
  component: UserRootContainer,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onDismiss: () => alert('Dismiss clicked'),
    children: (
      <div className="p-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">User Dialog Content</h2>
        <p className="text-sm text-muted-foreground">This is sample content inside UserRootContainer.</p>
      </div>
    )
  }
}

export default meta
type Story = StoryObj<typeof UserRootContainer>

export const Default: Story = {}

export const Mobile: Story = {
  args: {
    isMobile: true
  }
}
