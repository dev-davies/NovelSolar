export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-contacts')
    
    // Get all the keys (Contact IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, contacts: [], count: 0 }
    }

    // Fetch the full data for each failed contact
    const failedContacts = await Promise.all(
      keys.map(async (key) => {
        const contactData = await storage.getItem(key)
        return contactData
      })
    )

    // Sort by timestamp (newest first)
    failedContacts.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedContacts.length,
      contacts: failedContacts
    }
  } catch (error: any) {
    console.error('Failed to fetch fallback contacts:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback contacts queue.' })
  }
})