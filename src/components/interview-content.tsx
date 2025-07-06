'use client'

import { useEffect, useState } from 'react'

interface InterviewContentProps {
  children: React.ReactNode
}

export function InterviewContent({
  children,
}: InterviewContentProps): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // Reading progress tracking
    const handleScroll = (): void => {
      const content = document.querySelector('.interview-content')
      if (!content) return

      const scrollTop = window.scrollY
      const docHeight =
        content.getBoundingClientRect().height +
        content.getBoundingClientRect().top
      const winHeight = window.innerHeight
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100))
    }

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

    // Add scroll listener for progress bar
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [children])

  return (
    <>
      {/* Premium Reading Progress Bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-gradient-dynamic transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="interview-content relative">
        {/* Floating gradient accent - toned down */}
        <div className="absolute -left-4 top-20 h-20 w-20 rounded-full bg-gradient-primary opacity-5 blur-xl"></div>
        <div className="absolute -right-4 top-60 h-24 w-24 rounded-full bg-gradient-accent opacity-5 blur-xl"></div>

        {children}
      </div>
    </>
  )
}
