export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-quotes')
    
    // Get all the keys (Quote IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, quotes: [], count: 0 }
    }

    // Fetch the full data for each failed quote
    const failedQuotes = await Promise.all(
      keys.map(async (key) => {
        const quoteData = await storage.getItem(key)
        return quoteData
      })
    )

    // Sort by timestamp (newest first)
    failedQuotes.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedQuotes.length,
      quotes: failedQuotes
    }
  } catch (error: any) {
    console.error('Failed to fetch fallback quotes:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback quotes queue.' })
  }
})