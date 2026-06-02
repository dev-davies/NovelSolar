import 'dotenv/config'

async function testBitrixUpdate() {
  const webhookUrl = process.env.NUXT_BITRIX_WEBHOOK_URL || process.env.BITRIX_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('No Bitrix webhook URL found.')
    process.exit(1)
  }
  const formattedUrl = webhookUrl.endsWith('/') ? webhookUrl : `${webhookUrl}/`

  try {
    // 1. Get a product
    console.log('Fetching a product...')
    const listRes = await fetch(`${formattedUrl}crm.product.list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ select: ['ID', 'NAME', 'PROPERTY_116'], limit: 1 }),
    })
    const listData = await listRes.json()
    const product = listData.result[0]
    if (!product) {
      console.log('No products found.')
      return
    }
    console.log('Found product:', product.ID, product.NAME, 'Current PROPERTY_116:', product.PROPERTY_116)

    // 2. Try updating with plain string
    console.log('\n--- Test 1: Plain String ---')
    await fetch(`${formattedUrl}crm.product.update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.ID, fields: { PROPERTY_116: '5555' } }),
    })

    let getRes = await fetch(`${formattedUrl}crm.product.get?id=${product.ID}`)
    let getData = await getRes.json()
    console.log('After Plain String update:', getData.result.PROPERTY_116)

    // 3. Try updating with value object
    console.log('\n--- Test 2: Value Object ---')
    await fetch(`${formattedUrl}crm.product.update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.ID, fields: { PROPERTY_116: { value: '6666' } } }),
    })

    getRes = await fetch(`${formattedUrl}crm.product.get?id=${product.ID}`)
    getData = await getRes.json()
    console.log('After Value Object update:', getData.result.PROPERTY_116)

    // 4. Try updating with array of value objects (sometimes required for multiple or specific properties)
    console.log('\n--- Test 3: Array of Value Objects ---')
    await fetch(`${formattedUrl}crm.product.update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.ID, fields: { PROPERTY_116: [{ value: '7777' }] } }),
    })

    getRes = await fetch(`${formattedUrl}crm.product.get?id=${product.ID}`)
    getData = await getRes.json()
    console.log('After Array update:', getData.result.PROPERTY_116)

    // 5. Try updating with n0 indexed object (standard for some bitrix custom fields)
    console.log('\n--- Test 4: n0 Object ---')
    await fetch(`${formattedUrl}crm.product.update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.ID, fields: { PROPERTY_116: { n0: { value: '8888' } } } }),
    })

    getRes = await fetch(`${formattedUrl}crm.product.get?id=${product.ID}`)
    getData = await getRes.json()
    console.log('After n0 Object update:', getData.result.PROPERTY_116)
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testBitrixUpdate()
