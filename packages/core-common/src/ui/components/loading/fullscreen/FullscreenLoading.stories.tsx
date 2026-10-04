import type { Meta, StoryObj } from '@storybook/react'
import { FullscreenLoading } from '@/ui/components/loading/fullscreen/FullscreenLoading'

const meta: Meta<typeof FullscreenLoading> = {
  title: 'Core/Loading/FullscreenLoading',
  component: FullscreenLoading,
  args: {
    delayMillis: 0
  }
}

export default meta
type Story = StoryObj<typeof FullscreenLoading>

export const Immediate: Story = {}

export const WithDelay: Story = {
  args: {
    delayMillis: 250
  }
}
