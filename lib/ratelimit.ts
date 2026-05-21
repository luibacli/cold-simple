import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function makeRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Lazy singletons — only instantiated when Redis is configured
let _generateLimiter: Ratelimit | null = null;
let _sequenceLimiter: Ratelimit | null = null;
let _bulkLimiter: Ratelimit | null = null;

function getLimiter(
  slot: "generate" | "sequence" | "bulk"
): Ratelimit | null {
  const redis = makeRedis();
  if (!redis) return null;

  if (slot === "generate" && !_generateLimiter) {
    _generateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 req/min per user
      prefix: "rl:generate",
    });
  }
  if (slot === "sequence" && !_sequenceLimiter) {
    _sequenceLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 req/min (3× more expensive)
      prefix: "rl:sequence",
    });
  }
  if (slot === "bulk" && !_bulkLimiter) {
    _bulkLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "5 m"), // 3 bulk runs per 5 min
      prefix: "rl:bulk",
    });
  }

  if (slot === "generate") return _generateLimiter;
  if (slot === "sequence") return _sequenceLimiter;
  return _bulkLimiter;
}

export async function checkRateLimit(
  slot: "generate" | "sequence" | "bulk",
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter = getLimiter(slot);
  if (!limiter) return { allowed: true }; // fail open if Redis not configured

  const { success, reset } = await limiter.limit(identifier);
  return {
    allowed: success,
    retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000),
  };
}
