import { render, screen } from '@testing-library/react'

import MDXComponents from './mdx-components'

describe('MDXComponents', () => {
  it('renders custom table component', () => {
    render(
      <MDXComponents.table>
        <tbody>
          <tr>
            <td>Test cell</td>
          </tr>
        </tbody>
      </MDXComponents.table>
    )
    expect(screen.getByText('Test cell')).toBeInTheDocument()
  })

  it('renders custom p component', () => {
    render(<MDXComponents.p>Paragraph text</MDXComponents.p>)
    expect(screen.getByText('Paragraph text')).toBeInTheDocument()
  })

  it('renders custom strong component', () => {
    render(<MDXComponents.strong>Bold text</MDXComponents.strong>)
    expect(screen.getByText('Bold text')).toBeInTheDocument()
  })
})
