// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    return <img {...props} />
  },
}))

// Mock MDX components if needed
jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }) => <div data-testid="mdx-content">{source}</div>,
}))
