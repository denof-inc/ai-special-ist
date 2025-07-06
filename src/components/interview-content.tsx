'use client'

import { useEffect } from 'react'

interface InterviewContentProps {
  children: React.ReactNode
}

export function InterviewContent({
  children,
}: InterviewContentProps): JSX.Element {
  useEffect(() => {
    // Add classes for styling
    const styleInterviewContent = (): void => {
      const content = document.querySelector('.interview-content')
      if (!content) return

      const paragraphs = content.querySelectorAll('p')

      paragraphs.forEach((p): void => {
        const strongElement = p.querySelector('strong:first-child')
        if (!strongElement) return

        const text = strongElement.textContent || ''

        // Check if it's an interviewer question (contains ──)
        if (text.includes('──')) {
          p.classList.add('interview-question')
        }
        // Check if it's an interviewee response (contains さん：)
        else if (text.includes('さん：')) {
          p.classList.add('interview-response')
        }
      })
    }

    // Run after a delay to ensure MDX content is rendered
    const timer = setTimeout(styleInterviewContent, 300)

    return () => clearTimeout(timer)
  }, [children])

  return <div className="interview-content">{children}</div>
}
