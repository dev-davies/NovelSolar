import type { FailedContact } from '../../types/database'
import { logger } from '../../utils/logger'
export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-contacts')
    
    // Get all the keys (Contact IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, contacts: [], count: 0 }
    }

    // Fetch the full data for each failed contact
    const failedContacts = (await Promise.all(
      keys.map((key) => storage.getItem<FailedContact>(key))
    )).filter((c): c is FailedContact => c !== null)

    // Sort by timestamp (newest first)
    failedContacts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedContacts.length,
      contacts: failedContacts
    }
  } catch (error) {
    logger.error('Failed Contacts', 'Could not fetch fallback queue', { error })
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback contacts queue.' })
  }
})