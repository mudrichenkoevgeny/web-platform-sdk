import type { Meta, StoryObj } from '@storybook/react'
import { CoreErrorText } from './CoreErrorText'

const meta: Meta<typeof CoreErrorText> = {
  title: 'Core/Text/CoreErrorText',
  component: CoreErrorText,
  args: {
    text: 'An error occurred.'
  }
}

export default meta
type Story = StoryObj<typeof CoreErrorText>

export const Default: Story = {}
