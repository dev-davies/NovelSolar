export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('data:failed-orders')
    
    // Get all the keys (Order IDs) currently in the fallback queue
    const keys = await storage.getKeys()
    
    if (keys.length === 0) {
      return { success: true, orders: [], count: 0 }
    }

    // Fetch the full data for each failed order
    const failedOrders = await Promise.all(
      keys.map(async (key) => {
        const orderData = await storage.getItem(key)
        return orderData
      })
    )

    // Sort by timestamp (newest first)
    failedOrders.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      success: true,
      count: failedOrders.length,
      orders: failedOrders
    }
  } catch (error: any) {
    console.error('Failed to fetch fallback orders:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not retrieve fallback queue.' })
  }
})
