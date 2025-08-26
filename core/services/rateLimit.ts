import { env } from '../../lib/env';

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory store for development
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

// Redis client (if available)
let redisClient: any = null;

async function initRedis() {
  if (env.RATE_LIMIT_REDIS_URL && !redisClient) {
    try {
      // Dynamically import Redis to avoid bundling in environments that don't need it
      const { Redis } = await import('ioredis');
      redisClient = new Redis(env.RATE_LIMIT_REDIS_URL);
    } catch (error) {
      console.warn('Redis not available, falling back to in-memory rate limiting');
    }
  }
}

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  await initRedis();

  if (redisClient) {
    return rateLimitWithRedis({ key, limit, windowMs });
  } else {
    return rateLimitInMemory({ key, limit, windowMs });
  }
}

async function rateLimitWithRedis({ key, limit, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  try {
    // Use Redis sorted set to track requests within the time window
    const pipeline = redisClient.pipeline();
    
    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count current requests in window
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiry for the key
    pipeline.expire(key, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results?.[1]?.[1] as number || 0;
    
    const success = count < limit;
    const remaining = Math.max(0, limit - count - 1);
    const resetTime = now + windowMs;
    
    return { success, remaining, resetTime };
  } catch (error) {
    console.error('Redis rate limit error, falling back to in-memory:', error);
    return rateLimitInMemory({ key, limit, windowMs });
  }
}

function rateLimitInMemory({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = inMemoryStore.get(key);
  
  // If no entry or window has expired, reset
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    inMemoryStore.set(key, { count: 1, resetTime });
    return { success: true, remaining: limit - 1, resetTime };
  }
  
  // Increment count
  entry.count++;
  inMemoryStore.set(key, entry);
  
  const success = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);
  
  return { success, remaining, resetTime: entry.resetTime };
}

export async function createRateLimiter(
  limit: number,
  windowMs: number,
  keyGenerator: (identifier: string) => string = (id) => id
) {
  return async (identifier: string): Promise<RateLimitResult> => {
    const key = keyGenerator(identifier);
    return rateLimit({ key, limit, windowMs });
  };
}

// Common rate limiters
export const otpRateLimit = createRateLimiter(5, 15 * 60 * 1000, (email) => `otp:${email}`); // 5 per 15 minutes per email
export const otpIpRateLimit = createRateLimiter(20, 15 * 60 * 1000, (ip) => `otp-ip:${ip}`); // 20 per 15 minutes per IP
export const signRateLimit = createRateLimiter(3, 60 * 60 * 1000, (email) => `sign:${email}`); // 3 per hour per email
export const signIpRateLimit = createRateLimiter(10, 60 * 60 * 1000, (ip) => `sign-ip:${ip}`); // 10 per hour per IP
export const adminLoginRateLimit = createRateLimiter(5, 15 * 60 * 1000, (ip) => `admin-login:${ip}`); // 5 per 15 minutes per IP
