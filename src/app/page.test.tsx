import { render, screen } from '@testing-library/react'

import Home from './page'

describe('Home Page', () => {
  it('renders main content', () => {
    render(<Home />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders page content correctly', () => {
    const { container } = render(<Home />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
