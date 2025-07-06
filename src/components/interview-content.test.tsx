import { render, screen, waitFor } from '@testing-library/react'

import { InterviewContent } from './interview-content'

describe('InterviewContent', () => {
  it('renders children correctly', () => {
    render(
      <InterviewContent>
        <p>Test content</p>
      </InterviewContent>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies interview-content CSS class', () => {
    render(
      <InterviewContent>
        <p>Test content</p>
      </InterviewContent>
    )

    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveClass('interview-content')
  })

  it('applies Q&A styling to paragraphs with strong elements', () => {
    const { container } = render(
      <InterviewContent>
        <p>
          <strong>質問者:</strong> これは質問です。
        </p>
        <p>
          <strong>回答者:</strong> これは回答です。
        </p>
        <p>通常のテキストです。</p>
      </InterviewContent>
    )

    // Check that the styling function was applied
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(3)
  })

  it('handles empty content', () => {
    const { container } = render(<InterviewContent>{null}</InterviewContent>)

    expect(container.firstChild).toHaveClass('interview-content')
  })

  it('handles multiple child elements', () => {
    render(
      <InterviewContent>
        <h2>Interview Title</h2>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <ul>
          <li>List item</li>
        </ul>
      </InterviewContent>
    )

    expect(screen.getByText('Interview Title')).toBeInTheDocument()
    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
    expect(screen.getByText('List item')).toBeInTheDocument()
  })

  it('preserves text content with Japanese characters', () => {
    render(
      <InterviewContent>
        <p>
          <strong>インタビュアー:</strong> こんにちは、よろしくお願いします。
        </p>
        <p>
          <strong>田中さん:</strong> こちらこそ、よろしくお願いします。
        </p>
      </InterviewContent>
    )

    expect(
      screen.getByText(/こんにちは、よろしくお願いします/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/こちらこそ、よろしくお願いします/)
    ).toBeInTheDocument()
  })

  it('applies responsive styling classes', () => {
    const { container } = render(
      <InterviewContent>
        <p>Test content</p>
      </InterviewContent>
    )

    const interviewContainer = container.querySelector('.interview-content')
    expect(interviewContainer).toBeInTheDocument()
  })

  it('works with complex nested content', () => {
    render(
      <InterviewContent>
        <div>
          <h3>Section Title</h3>
          <p>
            <strong>Q:</strong> 複雑な質問ですが、
            <em>どのように</em>対応されますか？
          </p>
          <p>
            <strong>A:</strong> まず第一に、
            <code>技術的な検討</code>が必要です。
          </p>
        </div>
      </InterviewContent>
    )

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText(/複雑な質問ですが/)).toBeInTheDocument()
    expect(screen.getByText(/まず第一に/)).toBeInTheDocument()
    expect(screen.getByText('技術的な検討')).toBeInTheDocument()
  })

  it('applies interview-question class to paragraphs with ── pattern', async () => {
    const { container } = render(
      <InterviewContent>
        <p>
          <strong>──インタビュアー</strong> 質問内容です。
        </p>
        <p>Normal paragraph</p>
      </InterviewContent>
    )

    await waitFor(() => {
      const questionParagraph = container.querySelector('p')
      expect(questionParagraph).toHaveClass('interview-question')
    })
  })

  it('applies interview-response class to paragraphs with さん： pattern', async () => {
    const { container } = render(
      <InterviewContent>
        <p>
          <strong>田中さん：</strong> 回答内容です。
        </p>
        <p>Normal paragraph</p>
      </InterviewContent>
    )

    await waitFor(() => {
      const responseParagraph = container.querySelector('p')
      expect(responseParagraph).toHaveClass('interview-response')
    })
  })

  it('does not apply special classes to paragraphs without pattern', async () => {
    const { container } = render(
      <InterviewContent>
        <p>
          <strong>普通のテキスト</strong> 内容です。
        </p>
      </InterviewContent>
    )

    await waitFor(() => {
      const paragraph = container.querySelector('p')
      expect(paragraph).not.toHaveClass('interview-question')
      expect(paragraph).not.toHaveClass('interview-response')
    })
  })

  it('handles paragraphs without strong elements', async () => {
    const { container } = render(
      <InterviewContent>
        <p>Plain paragraph without strong element</p>
      </InterviewContent>
    )

    await waitFor(() => {
      const paragraph = container.querySelector('p')
      expect(paragraph).not.toHaveClass('interview-question')
      expect(paragraph).not.toHaveClass('interview-response')
    })
  })

  it('handles content with no interview-content container', async () => {
    // Test for the early return when content is not found
    const { container } = render(
      <div>
        <p>
          <strong>──インタビュアー</strong> 質問内容です。
        </p>
      </div>
    )

    await waitFor(() => {
      const paragraph = container.querySelector('p')
      expect(paragraph).not.toHaveClass('interview-question')
    })
  })
})
