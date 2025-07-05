import type { MDXComponents } from 'mdx/types'

// Custom MDX components
const mdxComponents: MDXComponents = {
  // Override table elements with styled versions
  table: ({ children, ...props }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse rounded-lg border border-slate-300 shadow-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-slate-50" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-slate-300 bg-slate-100 p-4 text-left font-semibold text-slate-800" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-slate-300 p-4 text-slate-700" {...props}>
      {children}
    </td>
  ),
  // Style other elements
  h1: ({ children, ...props }) => (
    <h1 className="mb-8 mt-12 text-3xl font-bold leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-6 mt-12 border-b-2 border-slate-200 pb-2 text-2xl font-bold leading-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-4 mt-8 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-6 text-base leading-relaxed" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="my-8 rounded-lg border-l-4 border-primary bg-primary/5 py-4 pl-6 pr-4 italic" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-slate-800" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="my-8 overflow-x-auto rounded-xl bg-slate-900 p-6 text-slate-100" {...props}>
      {children}
    </pre>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-6 list-disc pl-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-6 list-decimal pl-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mb-2 leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
}

export default mdxComponents