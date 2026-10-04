import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LegalFooter } from '@/ui/components/legal/footer/LegalFooter'
import { enUserStrings } from '@/locales/index'

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

    expect(screen.getByText(enUserStrings.legal_agreement_prefix)).toBeDefined()

    const privacyButton = screen.getByRole('button', { name: enUserStrings.privacy_policy })
    const termsButton = screen.getByRole('button', { name: enUserStrings.terms_of_service })

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

    expect(screen.getByRole('button', { name: enUserStrings.privacy_policy })).toBeDefined()
    expect(screen.queryByRole('button', { name: enUserStrings.terms_of_service })).toBeNull()
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
