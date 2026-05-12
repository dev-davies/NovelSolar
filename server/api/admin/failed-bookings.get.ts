import type { FailedBooking } from '../../types/database'
import { logger } from '../../utils/logger'
export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-bookings')
    
    // Get all the keys (Booking IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, bookings: [], count: 0 }
    }

    // Fetch the full data for each failed booking
    const failedBookings = (await Promise.all(
      keys.map((key) => storage.getItem<FailedBooking>(key))
    )).filter((b): b is FailedBooking => b !== null)

    // Sort by timestamp (newest first)
    failedBookings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedBookings.length,
      bookings: failedBookings
    }
  } catch (error) {
    logger.error('Failed Bookings', 'Could not fetch fallback queue', { error })
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback bookings queue.' })
  }
})