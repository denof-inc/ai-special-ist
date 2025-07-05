import { render, screen } from '@testing-library/react'

import MDXComponents from './mdx-components'

describe('MDXComponents', () => {
  it('renders custom table component', () => {
    const tableContent = (
      <MDXComponents.table>
        <tbody>
          <tr>
            <td>Test cell</td>
          </tr>
        </tbody>
      </MDXComponents.table>
    )

    render(tableContent)
    expect(screen.getByText('Test cell')).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveClass(
      'w-full border-collapse rounded-lg border border-slate-300 shadow-sm'
    )
  })

  it('renders custom th component', () => {
    const thContent = <MDXComponents.th>Header</MDXComponents.th>

    render(
      <table>
        <thead>
          <tr>{thContent}</tr>
        </thead>
      </table>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByRole('columnheader')).toHaveClass(
      'border border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700'
    )
  })

  it('renders custom td component', () => {
    const tdContent = <MDXComponents.td>Cell content</MDXComponents.td>

    render(
      <table>
        <tbody>
          <tr>{tdContent}</tr>
        </tbody>
      </table>
    )

    expect(screen.getByText('Cell content')).toBeInTheDocument()
    expect(screen.getByRole('cell')).toHaveClass(
      'border border-slate-300 px-4 py-3 text-sm text-slate-600'
    )
  })

  it('renders custom h1 component', () => {
    const h1Content = <MDXComponents.h1>Main Title</MDXComponents.h1>

    render(h1Content)
    expect(screen.getByText('Main Title')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'mb-8 mt-6 text-3xl font-bold'
    )
  })

  it('renders custom h2 component', () => {
    const h2Content = <MDXComponents.h2>Section Title</MDXComponents.h2>

    render(h2Content)
    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(
      'mb-6 mt-8 text-2xl font-bold'
    )
  })

  it('renders custom h3 component', () => {
    const h3Content = <MDXComponents.h3>Subsection Title</MDXComponents.h3>

    render(h3Content)
    expect(screen.getByText('Subsection Title')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass(
      'mb-4 mt-6 text-xl font-bold'
    )
  })

  it('renders custom h4 component', () => {
    const h4Content = <MDXComponents.h4>Small Title</MDXComponents.h4>

    render(h4Content)
    expect(screen.getByText('Small Title')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4 })).toHaveClass(
      'mb-3 mt-4 text-lg font-semibold'
    )
  })

  it('renders custom p component', () => {
    const pContent = <MDXComponents.p>Paragraph text</MDXComponents.p>

    render(pContent)
    expect(screen.getByText('Paragraph text')).toBeInTheDocument()
    expect(screen.getByText('Paragraph text')).toHaveClass('mb-4 leading-7')
  })

  it('renders custom strong component', () => {
    const strongContent = <MDXComponents.strong>Bold text</MDXComponents.strong>

    render(strongContent)
    expect(screen.getByText('Bold text')).toBeInTheDocument()
    expect(screen.getByText('Bold text')).toHaveClass('font-semibold')
  })

  it('renders custom ul component', () => {
    const ulContent = (
      <MDXComponents.ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </MDXComponents.ul>
    )

    render(ulContent)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveClass('mb-4 ml-6 list-disc space-y-2')
  })

  it('renders custom ol component', () => {
    const olContent = (
      <MDXComponents.ol>
        <li>First item</li>
        <li>Second item</li>
      </MDXComponents.ol>
    )

    render(olContent)
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveClass(
      'mb-4 ml-6 list-decimal space-y-2'
    )
  })

  it('renders custom li component', () => {
    const liContent = <MDXComponents.li>List item</MDXComponents.li>

    render(
      <ul>
        {liContent}
      </ul>
    )
    expect(screen.getByText('List item')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveClass('leading-7')
  })

  it('renders custom blockquote component', () => {
    const blockquoteContent = (
      <MDXComponents.blockquote>Quote text</MDXComponents.blockquote>
    )

    render(blockquoteContent)
    expect(screen.getByText('Quote text')).toBeInTheDocument()
    expect(screen.getByText('Quote text')).toHaveClass(
      'mb-4 border-l-4 border-slate-300 pl-4 italic text-slate-600'
    )
  })

  it('renders custom code component', () => {
    const codeContent = <MDXComponents.code>inline code</MDXComponents.code>

    render(<p>{codeContent}</p>)
    expect(screen.getByText('inline code')).toBeInTheDocument()
    expect(screen.getByText('inline code')).toHaveClass(
      'rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800'
    )
  })

  it('renders custom pre component', () => {
    const preContent = (
      <MDXComponents.pre>
        <code>const test = true;</code>
      </MDXComponents.pre>
    )

    render(preContent)
    expect(screen.getByText('const test = true;')).toBeInTheDocument()
    expect(screen.getByText('const test = true;').parentElement).toHaveClass(
      'mb-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-50'
    )
  })

  it('renders custom a component', () => {
    const aContent = (
      <MDXComponents.a href="https://example.com">Link text</MDXComponents.a>
    )

    render(aContent)
    expect(screen.getByText('Link text')).toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveClass('text-blue-600 underline hover:text-blue-800')
  })

  it('renders custom hr component', () => {
    render(<MDXComponents.hr />)
    const hr = document.querySelector('hr')
    expect(hr).toBeInTheDocument()
    expect(hr).toHaveClass('my-8 border-t border-slate-300')
  })

  it('renders custom img component', () => {
    const imgContent = (
      <MDXComponents.img src="test.jpg" alt="Test image" />
    )

    render(imgContent)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'test.jpg')
    expect(img).toHaveAttribute('alt', 'Test image')
    expect(img).toHaveClass('mb-4 rounded-lg')
  })
})