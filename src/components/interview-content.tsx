'use client'

import { ReadingProgress, StyleEnhancer, ContentWrapper } from './interview'

interface InterviewContentProps {
  children: React.ReactNode
}

export function InterviewContent({
  children,
}: InterviewContentProps): JSX.Element {
  return (
    <>
      <ReadingProgress />
      <StyleEnhancer />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  )
}
