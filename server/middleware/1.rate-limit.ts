export default defineEventHandler(async (event) => {
  // Only rate limit API routes and exclude internal or static paths
  if (!event.path.startsWith('/api/')) return;
  
  // Exclude bitrix callback/webhook from rate limiting and CSRF
  if (event.path.startsWith('/api/bitrix/') || event.path.includes('webhook')) return;

  const storage = useStorage('rateLimit');
  
  // Ensure we uniquely identify the IP
  const ip =
    event.node.req.headers['x-forwarded-for'] ||
    event.node.req.socket.remoteAddress ||
    'unknown-ip';

  const windowSizeInSeconds = 60;
  const maxRequests = 100;

  // The KV key for this IP's current window bucket
  const currentMinute = Math.floor(Date.now() / 1000 / windowSizeInSeconds);
  const key = `ip:${ip}:${currentMinute}`;

  let requestCount: number = (await storage.getItem(key)) || 0;

  if (requestCount >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Temporarily blocked due to too many requests. Try again in a minute.',
    });
  }

  requestCount++;
  await storage.setItem(key, requestCount);
});
