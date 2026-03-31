import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { passcode } = body;
  
  if (!passcode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Passcode is required',
    });
  }

  // Security: Validate Admin Passcode
  const actualPasscode = process.env.ADMIN_UPLOAD_PASSCODE;
  if (!actualPasscode || passcode !== actualPasscode) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid Passcode',
    });
  }

  // Generate secure session ID
  const sessionId = randomUUID();
  
  // Store session in Nitro cache for 24 hours
  const storage = useStorage('cache');
  await storage.setItem(`admin:session:${sessionId}`, {
    createdAt: Date.now(),
  }, { ttl: 60 * 60 * 24 }); // 24 hours

  // Set highly secure HTTP-only cookie for server-side auth checks
  setCookie(event, 'admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  // Set readable cookie for frontend navigation guards (doesn't hold secure data)
  setCookie(event, 'admin_auth_status', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return { 
    success: true, 
    message: 'Admin login successful' 
  };
});
