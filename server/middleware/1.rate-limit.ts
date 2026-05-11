function getClientIp(event: any) {
  const headerValue =
    getHeader(event, 'cf-connecting-ip')
    || getHeader(event, 'x-real-ip')
    || getHeader(event, 'x-forwarded-for')

  const rawIp = Array.isArray(headerValue)
    ? headerValue[0]
    : String(headerValue || event.node.req.socket.remoteAddress || 'unknown-ip')

  return rawIp
    .split(',')[0]
    .trim()
    .replace(/^\[|\]$/g, '')
    .replace(/:\d+$/, '')
    || 'unknown-ip'
}

function getRateLimitConfig(path: string) {
  if (path.startsWith('/api/admin/auth/')) return { maxRequests: 20, windowSizeInSeconds: 60, bucket: 'admin-auth' }
  if (path.startsWith('/api/auth/')) return { maxRequests: 20, windowSizeInSeconds: 60, bucket: 'auth' }
  if (['/api/checkout', '/api/contact', '/api/quote', '/api/book-service'].includes(path)) return { maxRequests: 30, windowSizeInSeconds: 60, bucket: 'lead' }
  if (path.startsWith('/api/admin/')) return { maxRequests: 60, windowSizeInSeconds: 60, bucket: 'admin' }
  return { maxRequests: 100, windowSizeInSeconds: 60, bucket: 'api' }
}

export default defineEventHandler(async (event) => {
  // Only rate limit API routes and exclude internal or static paths
  if (!event.path.startsWith('/api/')) return;
  
  // Exclude bitrix callback/webhook from rate limiting and CSRF
  if (event.path.startsWith('/api/bitrix/') || event.path.includes('webhook')) return;

  const storage = useStorage('rateLimit');
  
  const ip = getClientIp(event);
  const { maxRequests, windowSizeInSeconds, bucket } = getRateLimitConfig(event.path);

  // The KV key for this IP's current window bucket
  const currentMinute = Math.floor(Date.now() / 1000 / windowSizeInSeconds);
  const key = `${bucket}:${ip}:${currentMinute}`;

  let requestCount = (await storage.getItem<number>(key)) || 0;

  if (requestCount >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Temporarily blocked due to too many requests. Try again in a minute.',
    });
  }

  requestCount++;
  await storage.setItem(key, requestCount, { ttl: windowSizeInSeconds });
});
