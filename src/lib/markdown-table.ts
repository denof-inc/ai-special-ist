// Convert markdown table syntax to HTML table
export function parseMarkdownTable(content: string): string {
  // Pattern to match markdown tables
  const tableRegex = /(\|[^\n]*\|\n)+/g
  
  return content.replace(tableRegex, (match) => {
    const lines = match.trim().split('\n')
    
    if (lines.length < 2) return match
    
    const headerLine = lines[0]
    const separatorLine = lines[1]
    const dataLines = lines.slice(2)
    
    // Check if it's a valid table (separator line contains dashes)
    if (!separatorLine.includes('-')) return match
    
    // Parse header
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h)
    
    // Parse data rows
    const rows = dataLines.map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    )
    
    // Generate HTML table
    let html = '<table className="w-full border-collapse rounded-lg border border-slate-300 shadow-sm my-8">\n'
    
    // Header
    html += '  <thead>\n    <tr>\n'
    headers.forEach(header => {
      html += `      <th className="border border-slate-300 bg-slate-100 p-4 text-left font-semibold text-slate-800">${header}</th>\n`
    })
    html += '    </tr>\n  </thead>\n'
    
    // Body
    html += '  <tbody>\n'
    rows.forEach((row, index) => {
      const evenRow = index % 2 === 0 ? '' : ' bg-slate-50'
      html += `    <tr className="hover:bg-slate-100${evenRow}">\n`
      row.forEach(cell => {
        html += `      <td className="border border-slate-300 p-4 text-slate-700">${cell}</td>\n`
      })
      html += '    </tr>\n'
    })
    html += '  </tbody>\n</table>\n'
    
    return html
  })
}