import { runTask } from 'nitropack/runtime'
import { logger } from '../../utils/logger'

export default defineEventHandler((event) => {
  const nitroApp = useNitroApp()

  // Fire and forget the task in the background
  runTask('sync-products').catch((error) => {
    logger.error('ProductSync', 'Task failed from trigger', { error })
  })

  logger.info('ProductSync', 'Sync triggered', {
    user: event.context.admin?.email || 'cron',
  })

  return { success: true, message: 'Sync triggered' }
})
