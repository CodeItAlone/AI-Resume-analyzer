interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter (Local dev / fallback)
const ipRequests = new Map<string, RateLimitEntry>();

// Purge expired in-memory IP records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRequests.entries()) {
      if (entry.resetTime <= now) {
        ipRequests.delete(ip);
      }
    }
  }, 60000);
}

/**
 * Checks rate limits. Uses Upstash Redis REST API if configured via environment variables,
 * otherwise falls back seamlessly to the in-memory store.
 */
export async function checkRateLimit(
  clientIp: string,
  maxRequests: number = 15,
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number; resetInMs: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Upstash Redis Serverless REST Limiter
  if (upstashUrl && upstashToken) {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const key = `ratelimit:analyze:${clientIp}`;

      // Atomic increment + expire via pipeline
      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSec, 'NX'],
          ['TTL', key],
        ]),
        signal: AbortSignal.timeout(2000),
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        const currentCount = Number(results[0]?.result || 1);
        const ttlSec = Number(results[2]?.result || windowSec);
        const resetInMs = Math.max(0, ttlSec * 1000);

        if (currentCount > maxRequests) {
          return {
            success: false,
            remaining: 0,
            resetInMs,
          };
        }

        return {
          success: true,
          remaining: Math.max(0, maxRequests - currentCount),
          resetInMs,
        };
      }
    } catch (err) {
      console.warn('Upstash Redis check failed, falling back to in-memory rate limit:', err);
    }
  }

  // In-memory fallback
  const now = Date.now();
  const entry = ipRequests.get(clientIp);

  if (!entry || entry.resetTime <= now) {
    ipRequests.set(clientIp, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, entry.resetTime - now),
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetInMs: Math.max(0, entry.resetTime - now),
  };
}

/**
 * Extracts client IP using hosting platform trusted headers (Vercel, Cloudflare)
 * before falling back to X-Forwarded-For or localhost.
 */
export function extractClientIp(headers: Headers): string {
  // 1. Vercel Hosting Trusted IP
  const xVercelForwardedFor = headers.get('x-vercel-forwarded-for');
  if (xVercelForwardedFor) {
    return xVercelForwardedFor.split(',')[0].trim();
  }

  // 2. Cloudflare Trusted IP
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // 3. X-Real-IP
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  // 4. Standard X-Forwarded-For (first hop)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return '127.0.0.1';
}
