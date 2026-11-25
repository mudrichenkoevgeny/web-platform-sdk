import type { Meta, StoryObj } from '@storybook/react'
import { FullscreenError } from '@/core/common/ui/components/error/fullscreen/FullscreenError'
import { CommonError } from '@/core/common/error/model/common-error'

const meta: Meta<typeof FullscreenError> = {
  title: 'Core/Error/FullscreenError',
  component: FullscreenError,
  args: {
    error: CommonError.network(new Error('Connection error'), true),
    onRetry: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof FullscreenError>

export const Retryable: Story = {}

export const NonRetryable: Story = {
  args: {
    error: CommonError.unknown(false)
  }
}
