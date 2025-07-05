import { parseMarkdownTable } from './markdown-table'

describe('Markdown Table Parser', () => {
  it('converts simple markdown table to HTML', () => {
    const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('<table')
    expect(result).toContain('<thead>')
    expect(result).toContain('<tbody>')
    expect(result).toContain('Header 1')
    expect(result).toContain('Header 2')
    expect(result).toContain('Cell 1')
    expect(result).toContain('Cell 2')
    expect(result).toContain('Cell 3')
    expect(result).toContain('Cell 4')
  })

  it('handles tables with different alignment', () => {
    const markdown = `
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('<table')
    expect(result).toContain('Left')
    expect(result).toContain('Center')
    expect(result).toContain('Right')
    expect(result).toContain('L1')
    expect(result).toContain('C1')
    expect(result).toContain('R1')
  })

  it('preserves non-table content unchanged', () => {
    const markdown = `
# Title

This is a paragraph.

## Another heading

More content here.
`

    const result = parseMarkdownTable(markdown)

    expect(result).toBe(markdown)
    expect(result).toContain('# Title')
    expect(result).toContain('This is a paragraph.')
    expect(result).toContain('## Another heading')
    expect(result).toContain('More content here.')
  })

  it('handles mixed content with tables and other elements', () => {
    const markdown = `
# Interview Content

Some introduction text.

| Question | Answer |
|----------|--------|
| Q1       | A1     |
| Q2       | A2     |

More text after table.

## Another section
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('# Interview Content')
    expect(result).toContain('Some introduction text.')
    expect(result).toContain('<table')
    expect(result).toContain('Question')
    expect(result).toContain('Answer')
    expect(result).toContain('Q1')
    expect(result).toContain('A1')
    expect(result).toContain('More text after table.')
    expect(result).toContain('## Another section')
  })

  it('handles multiple tables in the same content', () => {
    const markdown = `
First table:

| A | B |
|---|---|
| 1 | 2 |

Second table:

| X | Y | Z |
|---|---|---|
| 3 | 4 | 5 |
| 6 | 7 | 8 |
`

    const result = parseMarkdownTable(markdown)

    // Check that both tables are processed
    const tableMatches = result.match(/<table/g)
    expect(tableMatches).toHaveLength(2)

    expect(result).toContain('A')
    expect(result).toContain('B')
    expect(result).toContain('X')
    expect(result).toContain('Y')
    expect(result).toContain('Z')
  })

  it('handles empty tables gracefully', () => {
    const markdown = `
| Header |
|--------|
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('<table')
    expect(result).toContain('Header')
  })

  it('handles malformed tables gracefully', () => {
    const markdown = `
| Header 1 | Header 2
|----------|
| Cell 1   |
`

    const result = parseMarkdownTable(markdown)

    // Should either convert what it can or leave it unchanged
    // The exact behavior depends on implementation
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('preserves table styling classes', () => {
    const markdown = `
| Name | Role |
|------|------|
| John | Dev  |
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('<table')
    // Should contain styling classes for proper presentation
    expect(result).toMatch(/<table[^>]*class/)
  })

  it('handles Japanese content in tables', () => {
    const markdown = `
| 質問 | 回答 |
|------|------|
| 名前は？ | 田中です |
| 会社は？ | ABC株式会社 |
`

    const result = parseMarkdownTable(markdown)

    expect(result).toContain('質問')
    expect(result).toContain('回答')
    expect(result).toContain('名前は？')
    expect(result).toContain('田中です')
    expect(result).toContain('会社は？')
    expect(result).toContain('ABC株式会社')
  })
})