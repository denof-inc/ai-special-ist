'use client'

import { useEffect } from 'react'

interface InterviewContentProps {
  children: React.ReactNode
}

export function InterviewContent({ children }: InterviewContentProps) {
  useEffect(() => {
    // Style interview Q&A after content loads
    const styleInterviewContent = () => {
      const content = document.querySelector('.interview-content')
      if (!content) return

      const paragraphs = content.querySelectorAll('p')
      
      paragraphs.forEach((p) => {
        const strongElement = p.querySelector('strong:first-child')
        if (!strongElement) return

        const text = strongElement.textContent || ''
        
        // Check if it's an interviewer question (contains ──)
        if (text.includes('──')) {
          p.className = 'mb-4 pl-4 border-l-2 border-slate-200 text-slate-600'
          strongElement.className = 'font-medium text-slate-700'
        } 
        // Check if it's an interviewee response (contains さん：)
        else if (text.includes('さん：')) {
          p.className = 'mb-6 rounded-lg bg-primary/5 px-6 py-4 border-l-4 border-primary text-foreground'
          p.style.borderLeftColor = 'hsl(var(--primary))'
          p.style.backgroundColor = 'hsl(var(--primary) / 0.05)'
          strongElement.className = 'font-bold text-primary'
          strongElement.style.color = 'hsl(var(--primary))'
        }
      })
    }

    // Run immediately and after a short delay to ensure content is rendered
    styleInterviewContent()
    const timer = setTimeout(styleInterviewContent, 100)

    return () => clearTimeout(timer)
  }, [children])

  return <div className="interview-content">{children}</div>
}