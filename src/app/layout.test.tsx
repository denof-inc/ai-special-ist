import { render } from '@testing-library/react'

import RootLayout from './layout'

// Mock Next.js font imports
jest.mock('next/font/google', () => ({
  Inter: (): { className: string } => ({
    className: 'inter-font',
  }),
}))

describe('RootLayout', () => {
  it('renders layout with children', () => {
    const { container } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    )

    expect(container.querySelector('html')).toBeInTheDocument()
    expect(container.querySelector('body')).toBeInTheDocument()
    expect(container.textContent).toContain('Test content')
  })

  it('includes proper lang attribute', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'ja')
  })

  it('includes Inter font class', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const body = container.querySelector('body')
    expect(body).toHaveClass('inter-font')
  })
})