# 認証・認可システム

**更新日**: 2025-07-04  
**担当者**: 技術リード  
**対象フェーズ**: v0.1 PoC → Year-1

## 概要

AIスペシャリスト.comの認証・認可システムについて、実装方針、セキュリティ設計、実装例を詳細に説明します。

## 認証アーキテクチャ

### システム全体図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Login Form    │───▶│   Auth Service  │───▶│   User Table    │
│   Token Storage │◄───│   JWT Issue     │◄───│   Credentials   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Protected     │    │   Token         │    │   Session       │
│   Routes        │◄───│   Validation    │───▶│   Management    │
│   (Guards)      │    │   Middleware    │    │   (Redis)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 認証フロー

### 1. ユーザー登録フロー

```
1. ユーザー情報入力
   ├── Email形式検証
   ├── Password強度チェック
   ├── Role選択（client/specialist）
   └── 利用規約同意

2. サーバー側検証
   ├── Email重複チェック
   ├── Input Sanitization
   ├── Password Hash化
   └── Database保存

3. アカウント確認
   ├── 確認メール送信
   ├── Email Verification Token
   ├── ユーザーによる確認
   └── アカウント有効化

4. 初回ログイン
   ├── JWT Token発行
   ├── Refresh Token発行
   └── プロフィール設定へ
```

### 2. ログインフロー

```
1. 認証情報入力
   ├── Email/Password
   ├── Rate Limiting適用
   └── CAPTCHA（必要時）

2. 認証処理
   ├── User存在確認
   ├── Password検証
   ├── Account Status確認
   └── 2FA確認（将来）

3. Token発行
   ├── JWT Access Token（15分）
   ├── Refresh Token（7日）
   ├── Session情報Redis保存
   └── HttpOnly Cookie設定

4. クライアント設定
   ├── Authorization Header設定
   ├── User Context更新
   └── Dashboard遷移
```

## JWT設計

### Token構造

```typescript
// Access Token
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",           // Subject (User ID)
    "email": "user@example.com",
    "role": "specialist",       // User Role
    "permissions": ["read:questions", "write:answers"],
    "subscription": {
      "plan": "specialist_monthly",
      "status": "active"
    },
    "iat": 1625097600,         // Issued At
    "exp": 1625098500,         // Expires (15 minutes)
    "jti": "token_id"          // JWT ID
  },
  "signature": "..."
}

// Refresh Token
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1625097600,
  "exp": 1625702400,           // Expires (7 days)
  "jti": "refresh_token_id"
}
```

### Token管理戦略

```typescript
// フロントエンド: Token Storage
class AuthTokenManager {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  setTokens(access: string, refresh: string) {
    this.accessToken = access
    this.refreshToken = refresh

    // HttpOnly Cookieに保存
    document.cookie = `refresh_token=${refresh}; HttpOnly; Secure; SameSite=Strict`
  }

  async getValidToken(): Promise<string | null> {
    if (!this.accessToken || this.isTokenExpired(this.accessToken)) {
      return await this.refreshAccessToken()
    }
    return this.accessToken
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Cookieを送信
      })

      const { access_token } = await response.json()
      this.accessToken = access_token
      return access_token
    } catch (error) {
      this.logout()
      return null
    }
  }
}
```

## 認可システム

### Role-Based Access Control (RBAC)

```typescript
// User Roles
enum UserRole {
  CLIENT = 'client', // 質問者
  SPECIALIST = 'specialist', // 専門家
  ADMIN = 'admin', // 管理者
}

// Permissions
enum Permission {
  // Question管理
  READ_QUESTIONS = 'read:questions',
  CREATE_QUESTIONS = 'create:questions',
  UPDATE_OWN_QUESTIONS = 'update:own_questions',
  DELETE_OWN_QUESTIONS = 'delete:own_questions',

  // Answer管理
  READ_ANSWERS = 'read:answers',
  CREATE_ANSWERS = 'create:answers',
  UPDATE_OWN_ANSWERS = 'update:own_answers',
  DELETE_OWN_ANSWERS = 'delete:own_answers',
  ACCEPT_ANSWERS = 'accept:answers',

  // User管理
  READ_PROFILES = 'read:profiles',
  UPDATE_OWN_PROFILE = 'update:own_profile',
  READ_ALL_USERS = 'read:all_users',

  // Subscription管理
  MANAGE_SUBSCRIPTION = 'manage:subscription',

  // Admin権限
  ADMIN_USERS = 'admin:users',
  ADMIN_CONTENT = 'admin:content',
  ADMIN_SYSTEM = 'admin:system',
}

// Role-Permission Mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CLIENT]: [
    Permission.READ_QUESTIONS,
    Permission.CREATE_QUESTIONS,
    Permission.UPDATE_OWN_QUESTIONS,
    Permission.DELETE_OWN_QUESTIONS,
    Permission.READ_ANSWERS,
    Permission.ACCEPT_ANSWERS,
    Permission.READ_PROFILES,
    Permission.UPDATE_OWN_PROFILE,
  ],

  [UserRole.SPECIALIST]: [
    Permission.READ_QUESTIONS,
    Permission.READ_ANSWERS,
    Permission.CREATE_ANSWERS,
    Permission.UPDATE_OWN_ANSWERS,
    Permission.DELETE_OWN_ANSWERS,
    Permission.READ_PROFILES,
    Permission.UPDATE_OWN_PROFILE,
    Permission.MANAGE_SUBSCRIPTION,
  ],

  [UserRole.ADMIN]: [
    ...Object.values(Permission), // All permissions
  ],
}
```

### Guards実装例

```typescript
// Next.js API Route Guard
export function withAuth(
  handler: NextApiHandler,
  requiredPermissions?: Permission[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // JWT Token検証
      const token = extractToken(req)
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload

      // User存在確認
      const user = await getUserById(payload.sub)
      if (!user || !user.is_active) {
        return res.status(401).json({ error: 'Invalid user' })
      }

      // Permission確認
      if (requiredPermissions) {
        const userPermissions = ROLE_PERMISSIONS[user.role]
        const hasPermission = requiredPermissions.every(permission =>
          userPermissions.includes(permission)
        )

        if (!hasPermission) {
          return res.status(403).json({ error: 'Insufficient permissions' })
        }
      }

      // リクエストにuser情報追加
      ;(req as any).user = user

      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}

// 使用例
export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Protected route logic
  },
  [Permission.CREATE_ANSWERS]
)
```

## セキュリティ設計

### Password Security

```typescript
// Password要件
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
}

// Password Hash化
import bcrypt from 'bcryptjs'

export class PasswordService {
  private static readonly SALT_ROUNDS = 12

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  static validate(password: string): ValidationResult {
    const errors: string[] = []

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(
        `パスワードは${PASSWORD_REQUIREMENTS.minLength}文字以上で入力してください`
      )
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を含めてください')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('小文字を含めてください')
    }

    if (!/[0-9]/.test(password)) {
      errors.push('数字を含めてください')
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('特殊文字を含めてください')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

### Session Management

```typescript
// Redis Session Store
export class SessionManager {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
  }

  async createSession(userId: string, refreshToken: string): Promise<void> {
    const sessionKey = `session:${userId}`
    const sessionData = {
      refreshToken,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    }

    await this.redis.setex(sessionKey, 604800, JSON.stringify(sessionData)) // 7 days
  }

  async validateSession(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    const sessionKey = `session:${userId}`
    const sessionData = await this.redis.get(sessionKey)

    if (!sessionData) return false

    const session = JSON.parse(sessionData)
    return session.refreshToken === refreshToken
  }

  async revokeSession(userId: string): Promise<void> {
    const sessionKey = `session:${userId}`
    await this.redis.del(sessionKey)
  }
}
```

### Rate Limiting

```typescript
// Rate Limiting設定
export const RATE_LIMITS = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    skipSuccessfulRequests: true,
  },
  register: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    skipSuccessfulRequests: true,
  },
  resetPassword: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    skipSuccessfulRequests: true,
  },
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
  },
}

// Redis Rate Limiter
export class RateLimiter {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
  }

  async checkLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    const current = await this.redis.incr(key)

    if (current === 1) {
      await this.redis.expire(key, Math.ceil(window / 1000))
    }

    const ttl = await this.redis.ttl(key)

    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetTime: Date.now() + ttl * 1000,
    }
  }
}
```

## API実装例

### 認証エンドポイント

```typescript
// POST /api/auth/register
export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name, role } = req.body

    // Input validation
    const validationResult = validateRegistrationInput({
      email,
      password,
      name,
      role,
    })
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.errors,
      })
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Create user
    const hashedPassword = await PasswordService.hash(password)
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      role,
      is_verified: false,
    })

    // Send verification email
    await sendVerificationEmail(user.email, user.verification_token)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_verified: user.is_verified,
        },
        message:
          'Registration successful. Please check your email for verification.',
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /api/auth/login
export default withRateLimit(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const { email, password } = req.body

      // Find user
      const user = await getUserByEmail(email)
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValidPassword = await PasswordService.verify(
        password,
        user.password
      )
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Check account status
      if (!user.is_verified) {
        return res
          .status(401)
          .json({ error: 'Please verify your email address' })
      }

      if (!user.is_active) {
        return res.status(401).json({ error: 'Account is disabled' })
      }

      // Generate tokens
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      // Create session
      await sessionManager.createSession(user.id, refreshToken)

      // Set cookies
      res.setHeader('Set-Cookie', [
        `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`, // 7 days
        `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=900`, // 15 minutes
      ])

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token: accessToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  RATE_LIMITS.login
)
```

## フロントエンド統合

### React Auth Context

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tokenManager = new AuthTokenManager();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await tokenManager.getValidToken();
      if (token) {
        const userData = await fetchUserData(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { data } = await response.json();
    setUser(data.user);
    tokenManager.setTokens(data.token, ''); // Refresh token is in cookie
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    setUser(null);
    tokenManager.clearTokens();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
export function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

## セキュリティチェックリスト

### 実装時確認事項

- [ ] **Password Security**
  - [ ] 強力なハッシュアルゴリズム使用（bcrypt, scrypt, Argon2）
  - [ ] 適切なソルトラウンド設定（12以上）
  - [ ] パスワード要件の実装
  - [ ] 共通パスワードの拒否

- [ ] **Token Security**
  - [ ] JWT署名検証の実装
  - [ ] 適切な有効期限設定
  - [ ] Refresh Tokenの安全な保存
  - [ ] Token RevokeationListの実装

- [ ] **Session Security**
  - [ ] HttpOnly Cookieの使用
  - [ ] Secure Flagの設定
  - [ ] SameSite属性の適切な設定
  - [ ] Session Timeoutの実装

- [ ] **Input Validation**
  - [ ] 全入力値のValidation
  - [ ] SQL Injection対策
  - [ ] XSS対策
  - [ ] CSRF Token実装

- [ ] **Rate Limiting**
  - [ ] ログイン試行回数制限
  - [ ] API Rate Limitingの実装
  - [ ] DDoS攻撃対策

---

**この認証システムは段階的に実装し、セキュリティ要件を満たしながら開発を進めてください。**
