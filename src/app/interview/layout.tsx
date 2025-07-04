import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function InterviewLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  )
}
