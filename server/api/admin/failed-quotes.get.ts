import type { FailedQuote } from '../../types/database'
export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-quotes')
    
    // Get all the keys (Quote IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, quotes: [], count: 0 }
    }

    // Fetch the full data for each failed quote
    const failedQuotes = (await Promise.all(
      keys.map((key) => storage.getItem<FailedQuote>(key))
    )).filter((q): q is FailedQuote => q !== null)

    // Sort by timestamp (newest first)
    failedQuotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedQuotes.length,
      quotes: failedQuotes
    }
  } catch (error) {
    console.error('Failed to fetch fallback quotes:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback quotes queue.' })
  }
})