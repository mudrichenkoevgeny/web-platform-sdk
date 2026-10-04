import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreEmailTextField } from '@/ui/components/input/email/CoreEmailTextField'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('CoreEmailTextField', () => {
  it('renders default Email label and type', () => {
    render(
      <ComponentTestHarness>
        <CoreEmailTextField />
      </ComponentTestHarness>
    )

    const input = screen.getByLabelText('Email') as HTMLInputElement
    expect(input.type).toBe('email')
  })
})
