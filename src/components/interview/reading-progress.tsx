'use client'

import { useEffect, useState } from 'react'

interface ReadingProgressProps {
  contentSelector?: string
}

export function ReadingProgress({
  contentSelector = '.interview-content',
}: ReadingProgressProps): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = (): void => {
      const content = document.querySelector(contentSelector)
      if (!content) return

      const scrollTop = window.scrollY
      const docHeight =
        content.getBoundingClientRect().height +
        content.getBoundingClientRect().top
      const winHeight = window.innerHeight
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [contentSelector])

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-200">
      <div
        className="h-full bg-gradient-dynamic transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
