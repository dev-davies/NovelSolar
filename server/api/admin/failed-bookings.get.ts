export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-bookings')
    
    // Get all the keys (Booking IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, bookings: [], count: 0 }
    }

    // Fetch the full data for each failed booking
    const failedBookings = await Promise.all(
      keys.map(async (key) => {
        const bookingData = await storage.getItem(key)
        return bookingData
      })
    )

    // Sort by timestamp (newest first)
    failedBookings.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedBookings.length,
      bookings: failedBookings
    }
  } catch (error: any) {
    console.error('Failed to fetch fallback bookings:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback bookings queue.' })
  }
})