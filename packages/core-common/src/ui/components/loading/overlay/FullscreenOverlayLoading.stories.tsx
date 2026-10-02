import type { Meta, StoryObj } from '@storybook/react'
import { FullscreenOverlayLoading } from './FullscreenOverlayLoading'

const meta: Meta<typeof FullscreenOverlayLoading> = {
  title: 'Core/Loading/FullscreenOverlayLoading',
  component: FullscreenOverlayLoading
}

export default meta
type Story = StoryObj<typeof FullscreenOverlayLoading>

export const Default: Story = {
  render: () => (
    <div className="relative w-80 h-60 border p-4">
      <p>Content behind loading overlay</p>
      <FullscreenOverlayLoading />
    </div>
  )
}
