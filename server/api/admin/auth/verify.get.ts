export default defineEventHandler((event) => {
  // If the request makes it past the adminGuard middleware, the user is authenticated!
  return { authenticated: true }
})
