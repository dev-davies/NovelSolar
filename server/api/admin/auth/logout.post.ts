export default defineEventHandler((event) => {
  // Delete the secure cookie by setting its maxAge to 0
  deleteCookie(event, 'admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })

  return { success: true, message: 'Logged out successfully.' }
})
