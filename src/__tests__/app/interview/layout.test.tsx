import { render } from '@testing-library/react'

import InterviewLayout from '@/app/interview/layout'

describe('InterviewLayout', () => {
  it('renders layout with children', () => {
    const { container } = render(
      <InterviewLayout>
        <div>Interview content</div>
      </InterviewLayout>
    )

    expect(container.textContent).toContain('Interview content')
  })

  it('renders children correctly', () => {
    const { container } = render(
      <InterviewLayout>
        <h1>Test Title</h1>
        <p>Test paragraph</p>
      </InterviewLayout>
    )

    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('p')).toBeInTheDocument()
    expect(container.textContent).toContain('Test Title')
    expect(container.textContent).toContain('Test paragraph')
  })
})
