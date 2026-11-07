import type { Meta, StoryObj } from '@storybook/react'
import { CoreScrollableScreenContent } from '@/ui/components/container/scrollable-screen-content/CoreScrollableScreenContent'

const meta: Meta<typeof CoreScrollableScreenContent> = {
  title: 'Core/Container/CoreScrollableScreenContent',
  component: CoreScrollableScreenContent
}

export default meta
type Story = StoryObj<typeof CoreScrollableScreenContent>

export const Default: Story = {
  render: () => (
    <CoreScrollableScreenContent>
      <p>Scrollable Screen Content Example</p>
    </CoreScrollableScreenContent>
  )
}
