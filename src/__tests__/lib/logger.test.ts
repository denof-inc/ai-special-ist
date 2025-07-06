import { LoggerClass, logger } from '@/lib/logger'

// モック
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()
const mockFetch = jest.fn()

// グローバルfetchをモック
global.fetch = mockFetch as jest.MockedFunction<typeof fetch>

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    } as Response)
  })

  afterEach(() => {
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()
  })

  describe('LoggerClass', () => {
    it('creates logger with default config', () => {
      const testLogger = new LoggerClass()
      expect(testLogger).toBeDefined()
    })

    it('creates logger with custom config', () => {
      const customLogger = new LoggerClass({
        level: 'debug',
        environment: 'test',
        enableJson: true,
      })
      expect(customLogger).toBeDefined()
    })
  })

  describe('Log levels', () => {
    it('respects log level filtering', () => {
      const testLogger = new LoggerClass({ level: 'warn', enableConsole: true })

      testLogger.debug('debug message')
      testLogger.info('info message')
      testLogger.warn('warn message')
      testLogger.error('error message')

      // debug と info は出力されない
      expect(mockConsoleLog).toHaveBeenCalledTimes(2)
    })

    it('logs debug level when level is debug', () => {
      const testLogger = new LoggerClass({ level: 'debug', enableConsole: true })

      testLogger.debug('debug message')
      expect(mockConsoleLog).toHaveBeenCalledTimes(1)
    })
  })

  describe('Log formatting', () => {
    it('formats console output correctly', () => {
      const testLogger = new LoggerClass({
        level: 'info',
        enableConsole: true,
        enableJson: false,
      })

      testLogger.info('test message')
      expect(mockConsoleLog).toHaveBeenCalled()

      const logCall = mockConsoleLog.mock.calls[0][0]
      expect(logCall).toContain('[INFO]')
      expect(logCall).toContain('test message')
    })

    it('formats JSON output when enableJson is true', () => {
      const testLogger = new LoggerClass({
        level: 'info',
        enableConsole: true,
        enableJson: true,
      })

      testLogger.info('test message')
      expect(mockConsoleLog).toHaveBeenCalled()

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)
      expect(parsedLog.level).toBe('info')
      expect(parsedLog.message).toBe('test message')
      expect(parsedLog.timestamp).toBeDefined()
    })
  })

  describe('Context handling', () => {
    it('includes context in log entries', () => {
      const testLogger = new LoggerClass({
        level: 'info',
        enableConsole: true,
        enableJson: true,
      })

      const context = {
        userId: 'user123',
        component: 'TestComponent',
        metadata: { key: 'value' },
      }

      testLogger.info('test with context', context)
      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.context).toEqual(context)
    })
  })

  describe('Error handling', () => {
    it('logs errors with stack trace', () => {
      const testLogger = new LoggerClass({
        level: 'error',
        enableConsole: true,
        enableJson: true,
      })

      const testError = new Error('Test error')
      testLogger.error('Error occurred', testError)

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.error.name).toBe('Error')
      expect(parsedLog.error.message).toBe('Test error')
      expect(parsedLog.error.stack).toBeDefined()
    })

    it('handles fatal errors', () => {
      const testLogger = new LoggerClass({
        level: 'fatal',
        enableConsole: true,
        enableJson: true,
      })

      const fatalError = new Error('Fatal error')
      testLogger.fatal('System failure', fatalError)

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.level).toBe('fatal')
      expect(parsedLog.message).toBe('System failure')
    })
  })

  describe('Convenience methods', () => {
    let testLogger: LoggerClass

    beforeEach(() => {
      testLogger = new LoggerClass({
        level: 'debug',
        enableConsole: true,
        enableJson: true,
      })
    })

    it('logs requests correctly', () => {
      testLogger.request('GET', '/api/users', { requestId: 'req123' })

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.message).toBe('GET /api/users')
      expect(parsedLog.context.action).toBe('request')
      expect(parsedLog.context.requestId).toBe('req123')
    })

    it('logs performance metrics', () => {
      testLogger.performance('database_query', 150, { component: 'UserService' })

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.message).toBe('Performance: database_query took 150ms')
      expect(parsedLog.context.action).toBe('performance')
      expect(parsedLog.context.metadata.duration).toBe(150)
    })

    it('logs user actions', () => {
      testLogger.userAction('login', 'user123', { component: 'AuthComponent' })

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.message).toBe('User action: login')
      expect(parsedLog.context.userId).toBe('user123')
      expect(parsedLog.context.action).toBe('user_action')
    })

    it('captures exceptions', () => {
      const exception = new Error('Uncaught error')
      testLogger.captureException(exception, { component: 'ErrorBoundary' })

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)

      expect(parsedLog.level).toBe('error')
      expect(parsedLog.message).toBe('Uncaught exception')
      expect(parsedLog.context.action).toBe('exception')
      expect(parsedLog.error.message).toBe('Uncaught error')
    })
  })

  describe('Remote logging', () => {
    it('sends logs to remote endpoint when enabled', async () => {
      const testLogger = new LoggerClass({
        level: 'info',
        enableRemote: true,
        remoteEndpoint: 'https://logs.example.com/api',
        enableConsole: false,
      })

      testLogger.info('remote log test')

      // 非同期処理なので少し待つ
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(mockFetch).toHaveBeenCalledWith(
        'https://logs.example.com/api',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('remote log test'),
        })
      )
    })

    it('handles remote logging failures gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const testLogger = new LoggerClass({
        level: 'info',
        enableRemote: true,
        remoteEndpoint: 'https://logs.example.com/api',
        enableConsole: false,
      })

      testLogger.info('test message')

      await new Promise((resolve) => setTimeout(resolve, 0))

      // エラーが発生してもログ処理は継続される
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to send remote log:',
        expect.any(Error)
      )
    })
  })

  describe('Configuration updates', () => {
    it('updates configuration correctly', () => {
      const testLogger = new LoggerClass({ level: 'info' })

      testLogger.updateConfig({ level: 'debug', enableJson: true })

      // 新しい設定でdebugログが出力されることを確認
      testLogger.debug('debug after config update')
      expect(mockConsoleLog).toHaveBeenCalled()
    })
  })

  describe('Singleton logger', () => {
    it('provides singleton instance', () => {
      expect(logger).toBeDefined()
      expect(logger.info).toBeDefined()
      expect(logger.error).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('handles undefined context gracefully', () => {
      const testLogger = new LoggerClass({
        level: 'info',
        enableConsole: true,
        enableJson: true,
      })

      testLogger.info('message without context')

      const logCall = mockConsoleLog.mock.calls[0][0]
      const parsedLog = JSON.parse(logCall)
      expect(parsedLog.context).toBeUndefined()
    })

    it('handles logger internal errors gracefully', () => {
      // JSON.stringify が失敗するケースをシミュレート
      const circularObj = { a: {} }
      circularObj.a = circularObj

      const testLogger = new LoggerClass({
        level: 'info',
        enableConsole: true,
        enableJson: true,
      })

      // 循環参照があってもクラッシュしない
      expect(() => {
        testLogger.info('test', { metadata: circularObj })
      }).not.toThrow()
    })
  })
})