// Interview Template Component - Foundation for standardized interviews

export interface InterviewQuestion {
  id: string
  category: string
  question: string
  order: number
}

export interface InterviewTemplateData {
  title: string
  author: string
  company: string
  industry: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: number
  // Template-specific fields
  questions?: InterviewQuestion[]
  responses?: Record<string, string>
}

interface InterviewTemplateProps {
  data: InterviewTemplateData
  children: React.ReactNode
}

export function InterviewTemplate({ data, children }: InterviewTemplateProps) {
  return (
    <div className="interview-template">
      {/* Template marker for future identification */}
      <div className="hidden" data-template="standard-interview" />
      
      {/* Standard header structure */}
      <header className="interview-header mb-12">
        {/* Meta information */}
        <div className="interview-meta mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            {data.industry}
          </span>
          <span className="text-sm text-muted-foreground">
            {data.date}
          </span>
          <span className="text-sm text-muted-foreground">
            読了時間 {data.readingTime}分
          </span>
        </div>

        {/* Main title */}
        <h1 className="interview-title mb-8 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
          {data.title}
        </h1>

        {/* Person profile */}
        <div className="interview-person-profile mb-10 border-l-4 border-primary bg-slate-50 p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-lg bg-slate-200 md:h-32 md:w-32">
                {/* Avatar will be injected by parent component */}
                <div className="interview-avatar-placeholder h-full w-full bg-gradient-to-br from-primary/20 to-primary/40" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="interview-person-name mb-2 text-2xl font-bold text-foreground">
                {data.author}
              </h2>
              <p className="interview-person-company mb-3 text-lg font-semibold text-primary">
                {data.company}
              </p>
              <p className="interview-person-excerpt leading-relaxed text-muted-foreground">
                {data.excerpt}
              </p>
              <div className="interview-tags mt-4 flex flex-wrap gap-2">
                {data.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content area - Q&A will be structured here */}
      <main className="interview-content">
        {children}
      </main>

      {/* Template footer with standardized CTA */}
      <footer className="interview-footer mt-16">
        <div className="rounded-lg bg-muted/50 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-bold">
                この記事について詳しく相談したい
              </h3>
              <p className="mb-4 text-muted-foreground">
                記事の内容についてより詳しく知りたい方は、専門家による無料相談をご活用ください。
              </p>
              <button className="interview-cta rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">
                無料相談を始める
              </button>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold">他のインタビュー記事</h3>
              <p className="mb-4 text-muted-foreground">
                様々な業界でのAI活用事例をご紹介しています。
              </p>
              <button className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary">
                インタビュー一覧を見る
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Standard question categories for template
export const INTERVIEW_CATEGORIES = {
  BACKGROUND: 'background',
  CHALLENGE: 'challenge', 
  SOLUTION: 'solution',
  IMPLEMENTATION: 'implementation',
  RESULTS: 'results',
  FUTURE: 'future'
} as const

// Standard question templates
export const STANDARD_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'bg-01',
    category: INTERVIEW_CATEGORIES.BACKGROUND,
    question: 'まず、御社の事業内容について教えてください。',
    order: 1
  },
  {
    id: 'challenge-01', 
    category: INTERVIEW_CATEGORIES.CHALLENGE,
    question: 'AI導入前にどのような課題を抱えていましたか？',
    order: 2
  },
  {
    id: 'solution-01',
    category: INTERVIEW_CATEGORIES.SOLUTION,
    question: 'どのようなAIソリューションを選ばれましたか？',
    order: 3
  },
  {
    id: 'implementation-01',
    category: INTERVIEW_CATEGORIES.IMPLEMENTATION,
    question: '導入プロセスについて詳しく教えてください。',
    order: 4
  },
  {
    id: 'results-01',
    category: INTERVIEW_CATEGORIES.RESULTS,
    question: '導入後の具体的な成果について教えてください。',
    order: 5
  },
  {
    id: 'future-01',
    category: INTERVIEW_CATEGORIES.FUTURE,
    question: '今後の展望について教えてください。',
    order: 6
  }
]