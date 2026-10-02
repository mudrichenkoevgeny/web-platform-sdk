import type { Meta, StoryObj } from '@storybook/react'
import { CoreScreenTitleText } from './CoreScreenTitleText'

const meta: Meta<typeof CoreScreenTitleText> = {
  title: 'Core/Text/CoreScreenTitleText',
  component: CoreScreenTitleText,
  args: {
    text: 'Screen Title'
  }
}

export default meta
type Story = StoryObj<typeof CoreScreenTitleText>

export const Default: Story = {}
