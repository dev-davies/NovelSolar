import 'dotenv/config'

async function checkBitrixFields() {
  const webhookUrl = process.env.NUXT_BITRIX_WEBHOOK_URL || process.env.BITRIX_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('No Bitrix webhook URL found in environment variables.')
    process.exit(1)
  }

  const formattedUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`

  try {
    const res = await fetch(`${formattedUrl}crm.product.fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    if (data.error) {
      console.error('Error fetching fields:', data)
      return
    }

    console.log('Available Product Fields:')
    for (const [key, field] of Object.entries(data.result)) {
      console.log(`- ${key} (${(field as any).type}): ${(field as any).title}`)
    }
  } catch (err) {
    console.error('Failed to query Bitrix API:', err)
  }
}

checkBitrixFields()
