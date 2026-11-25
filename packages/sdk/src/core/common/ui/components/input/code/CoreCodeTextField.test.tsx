import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreCodeTextField } from '@/core/common/ui/components/input/code/CoreCodeTextField'
import { ComponentTestHarness } from '@/core/common/testing/ComponentTestHarness'

describe('CoreCodeTextField', () => {
  it('renders input with numeric inputMode', () => {
    render(
      <ComponentTestHarness>
        <CoreCodeTextField placeholder="Enter code" />
      </ComponentTestHarness>
    )

    const input = screen.getByPlaceholderText('Enter code') as HTMLInputElement
    expect(input.inputMode).toBe('numeric')
  })
})
