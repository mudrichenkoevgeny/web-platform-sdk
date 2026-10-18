import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { LegalFooter } from '@/ui/components/legal/footer/LegalFooter'

const userStrings = new UserModuleStrings()

describe('LegalFooter', () => {
  it('renders both Privacy Policy and Terms of Service links and handles clicks', async () => {
    const onPrivacyClick = vi.fn()
    const onTermsClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LegalFooter
          onPrivacyPolicyClick={onPrivacyClick}
          onTermsOfServiceClick={onTermsClick}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.legalAgreementPrefix)).toBeDefined()

    const privacyButton = screen.getByRole('button', { name: userStrings.ui.privacyPolicy })
    const termsButton = screen.getByRole('button', { name: userStrings.ui.termsOfService })

    await user.click(privacyButton)
    expect(onPrivacyClick).toHaveBeenCalledTimes(1)

    await user.click(termsButton)
    expect(onTermsClick).toHaveBeenCalledTimes(1)
  })

  it('renders only Privacy Policy link when isTermsOfServiceVisible is false', () => {
    render(
      <ComponentTestHarness>
        <LegalFooter isTermsOfServiceVisible={false} />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('button', { name: userStrings.ui.privacyPolicy })).toBeDefined()
    expect(screen.queryByRole('button', { name: userStrings.ui.termsOfService })).toBeNull()
  })

  it('returns null when both visibility flags are false', () => {
    const { container } = render(
      <ComponentTestHarness>
        <LegalFooter isPrivacyPolicyVisible={false} isTermsOfServiceVisible={false} />
      </ComponentTestHarness>
    )

    expect(container.firstChild).toBeNull()
  })
})
