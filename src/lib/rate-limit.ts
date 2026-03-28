// Simple in-memory rate limiter (resets on deploy/restart — good enough for serverless)
const attempts = new Map<string, { count: number; resetAt: number }>();

// Clean stale entries periodically
setInterval(() => {
  const now = Date.now();
  attempts.forEach((val, key) => {
    if (val.resetAt < now) attempts.delete(key);
  });
}, 60_000);

export function rateLimit(key: string, maxAttempts: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

// Extract IP from request headers
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
