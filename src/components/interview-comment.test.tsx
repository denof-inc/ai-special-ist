import { render, screen } from '@testing-library/react'

import { InterviewComment, InterviewSpeaker } from './interview-comment'

describe('InterviewComment', () => {
  it('renders interviewer comment correctly', () => {
    render(
      <InterviewComment
        type="interviewer"
        author="John Doe"
        avatar="https://example.com/avatar.jpg"
      >
        <p>This is a test question</p>
      </InterviewComment>
    )

    expect(screen.getByText('John Doe (インタビュアー)')).toBeInTheDocument()
    expect(screen.getByText('This is a test question')).toBeInTheDocument()
    expect(screen.getByAltText('John Doe')).toBeInTheDocument()
  })

  it('renders interviewee comment correctly', () => {
    render(
      <InterviewComment type="interviewee" author="Jane Smith">
        <p>This is a test response</p>
      </InterviewComment>
    )

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('This is a test response')).toBeInTheDocument()
    expect(screen.getByText('J')).toBeInTheDocument() // Initial when no avatar
  })

  it('renders without avatar correctly', () => {
    render(
      <InterviewComment type="interviewer" author="Test User">
        <p>Test content</p>
      </InterviewComment>
    )

    expect(screen.getByText('T')).toBeInTheDocument() // First letter of name
    expect(screen.getByText('Test User (インタビュアー)')).toBeInTheDocument()
  })
})

describe('InterviewSpeaker', () => {
  it('renders question correctly', () => {
    render(
      <InterviewSpeaker role="Q" name="Interviewer">
        <p>What is your opinion?</p>
      </InterviewSpeaker>
    )

    expect(screen.getByText('Q')).toBeInTheDocument()
    expect(screen.getByText('Interviewer (インタビュアー)')).toBeInTheDocument()
    expect(screen.getByText('What is your opinion?')).toBeInTheDocument()
  })

  it('renders answer correctly', () => {
    render(
      <InterviewSpeaker role="A" name="Respondent">
        <p>My answer is...</p>
      </InterviewSpeaker>
    )

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Respondent')).toBeInTheDocument()
    expect(screen.getByText('My answer is...')).toBeInTheDocument()
  })
})
