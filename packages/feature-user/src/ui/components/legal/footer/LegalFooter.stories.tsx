import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LegalFooter } from './LegalFooter'

const meta: Meta<typeof LegalFooter> = {
  title: 'Feature/User/Legal/LegalFooter',
  component: LegalFooter,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md p-4">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    isPrivacyPolicyVisible: true,
    isTermsOfServiceVisible: true
  }
}

export default meta
type Story = StoryObj<typeof LegalFooter>

export const BothVisible: Story = {}

export const PrivacyPolicyOnly: Story = {
  args: {
    isTermsOfServiceVisible: false
  }
}

export const TermsOfServiceOnly: Story = {
  args: {
    isPrivacyPolicyVisible: false
  }
}
