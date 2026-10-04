import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from './ComponentTestHarness'
import { useCommonComponent } from '@/context/SdkProvider'

const TestChild: React.FC = () => {
  const component = useCommonComponent()
  return <div>Component Ready: {component ? 'Yes' : 'No'}</div>
}

describe('ComponentTestHarness', () => {
  it('renders children with SdkProvider and ThemeProvider', () => {
    render(
      <ComponentTestHarness>
        <TestChild />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Component Ready: Yes')).toBeDefined()
  })
})
