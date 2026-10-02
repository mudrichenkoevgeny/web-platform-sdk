import type { Meta, StoryObj } from '@storybook/react'
import { CoreBodyText } from './CoreText'

const meta: Meta<typeof CoreBodyText> = {
  title: 'Core/Text/CoreBodyText',
  component: CoreBodyText,
  args: {
    text: 'Body text example'
  }
}

export default meta
type Story = StoryObj<typeof CoreBodyText>

export const Default: Story = {}
