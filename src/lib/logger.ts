/**
 * 強力なLoggerクラス - 運用・デバッグ対応
 * 
 * 設計方針:
 * - 構造化ログ（JSON形式）
 * - 環境別出力制御
 * - パフォーマンス最適化
 * - Next.js SSR/CSR対応
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  userId?: string
  requestId?: string
  component?: string
  action?: string
  metadata?: Record<string, unknown>
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  environment: string
  version: string
}

export interface LoggerConfig {
  level: LogLevel
  environment: string
  version: string
  enableConsole: boolean
  enableJson: boolean
  enableRemote: boolean
  remoteEndpoint?: string
}

class LoggerClass {
  private config: LoggerConfig
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  }

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: 'info',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      enableConsole: true,
      enableJson: process.env.NODE_ENV === 'production',
      enableRemote: false,
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.config.level]
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      environment: this.config.environment,
      version: this.config.version,
    }
  }

  private formatConsoleOutput(entry: LogEntry): void {
    const { timestamp, level, message, context, error } = entry
    const time = new Date(timestamp).toLocaleTimeString()
    
    const levelColors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
      fatal: '\x1b[35m', // magenta
    }
    
    const reset = '\x1b[0m'
    const color = levelColors[level]
    
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : ''
    
    // eslint-disable-next-line no-console
    console.log(`${color}${time} [${level.toUpperCase()}]${reset} ${message}${contextStr}`)
    
    if (error?.stack && this.config.environment === 'development') {
      // eslint-disable-next-line no-console
      console.error(error.stack)
    }
  }

  private async sendLog(entry: LogEntry): Promise<void> {
    try {
      if (this.config.enableConsole) {
        if (this.config.enableJson) {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(entry))
        } else {
          this.formatConsoleOutput(entry)
        }
      }

      if (this.config.enableRemote && this.config.remoteEndpoint) {
        // 非同期でリモートログ送信（パフォーマンス影響なし）
        void fetch(this.config.remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to send remote log:', error)
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logger error:', error)
    }
  }

  // メインログメソッド
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context, error)
    void this.sendLog(entry) // 非同期実行
  }

  // パブリックAPIメソッド
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error)
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log('fatal', message, context, error)
  }

  // 便利メソッド
  request(method: string, url: string, context?: LogContext): void {
    this.info(`${method} ${url}`, { ...context, action: 'request' })
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      ...context,
      action: 'performance',
      metadata: { operation, duration },
    })
  }

  userAction(action: string, userId: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      userId,
      action: 'user_action',
    })
  }

  // 設定更新
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  // エラーバウンダリ用
  captureException(error: Error, context?: LogContext): void {
    this.error('Uncaught exception', error, {
      ...context,
      action: 'exception',
    })
  }
}

// シングルトンインスタンス
export const logger = new LoggerClass()

// 便利な型エクスポート
export type Logger = typeof logger
export { LoggerClass }