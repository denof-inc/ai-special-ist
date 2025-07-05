import { ReactNode } from 'react'

interface InterviewCommentProps {
  type: 'interviewer' | 'interviewee'
  author: string
  children: ReactNode
  avatar?: string
}

export function InterviewComment({
  type,
  author,
  children,
  avatar,
}: InterviewCommentProps): JSX.Element {
  const isInterviewer = type === 'interviewer'

  return (
    <div
      className={`mb-6 flex gap-4 ${
        isInterviewer ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${
            isInterviewer ? 'bg-blue-500' : 'bg-green-500'
          }`}
        >
          {avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatar}
              alt={author}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            author.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* Comment Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isInterviewer
            ? 'bg-blue-50 text-blue-900'
            : 'bg-green-50 text-green-900'
        }`}
      >
        {/* Author Name */}
        <div className="mb-2 text-sm font-semibold opacity-70">
          {author}
          {isInterviewer && ' (インタビュアー)'}
        </div>

        {/* Comment Content */}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

// Alternative speaker role component
export function InterviewSpeaker({
  role,
  name,
  children,
}: {
  role: 'Q' | 'A'
  name: string
  children: ReactNode
}): JSX.Element {
  const isQuestion = role === 'Q'

  return (
    <div className="mb-8">
      {/* Speaker Header */}
      <div
        className={`mb-3 flex items-center gap-3 ${
          isQuestion ? 'text-blue-600' : 'text-green-600'
        }`}
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
            isQuestion ? 'bg-blue-500' : 'bg-green-500'
          }`}
        >
          {role}
        </div>
        <span className="font-semibold">
          {name}
          {isQuestion && ' (インタビュアー)'}
        </span>
      </div>

      {/* Content */}
      <div
        className={`ml-11 rounded-lg p-4 ${
          isQuestion
            ? 'border-l-4 border-blue-500 bg-blue-50'
            : 'border-l-4 border-green-500 bg-green-50'
        }`}
      >
        <div className="prose prose-sm max-w-none">{children}</div>
      </div>
    </div>
  )
}
