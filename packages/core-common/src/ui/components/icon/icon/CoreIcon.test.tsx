import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreIcon } from './CoreIcon'
import { icons } from '@/assets/icons/index.js'

describe('CoreIcon', () => {
  it('renders SVG component icon when src is a React component', () => {
    const { container } = render(
      <CoreIcon src={icons.warning} size={32} alt="Warning Icon" className="text-error" />
    )

    const svgElement = container.querySelector('svg')
    expect(svgElement).not.toBeNull()
    expect(svgElement?.getAttribute('width')).toBe('32')
    expect(svgElement?.getAttribute('height')).toBe('32')
    expect(svgElement?.getAttribute('aria-label')).toBe('Warning Icon')
    expect(svgElement?.classList.contains('text-error')).toBe(true)
  })

  it('renders img element when src is a string', () => {
    render(
      <CoreIcon src="/path/to/icon.png" size={20} alt="Custom Image" className="my-icon" />
    )

    const imgElement = screen.getByRole('img') as HTMLImageElement
    expect(imgElement).toBeDefined()
    expect(imgElement.src).toContain('/path/to/icon.png')
    expect(imgElement.getAttribute('width')).toBe('20')
    expect(imgElement.getAttribute('height')).toBe('20')
    expect(imgElement.getAttribute('alt')).toBe('Custom Image')
    expect(imgElement.classList.contains('my-icon')).toBe(true)
  })
})
