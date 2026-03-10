export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  
  // body expected: { user: { firstName, lastName, address, city, state, zip }, items: [], total: number }

  try {
    // Step 1: Create the Deal in Bitrix24
    const dealResponse = await $fetch<{ result: any }>(`${config.bitrixWebhook}crm.deal.add`, {
      method: 'POST',
      body: {
        fields: {
          TITLE: `New Web Order: ${body.user.firstName} ${body.user.lastName}`,
          NAME: body.user.firstName,
          LAST_NAME: body.user.lastName,
          OPPORTUNITY: body.total,
          CURRENCY_ID: 'NGN',
          COMMENTS: `Shipping Address: ${body.user.address}, ${body.user.city}, ${body.user.state} ${body.user.zip}`
        }
      }
    });

    const dealId = dealResponse.result;

    if (!dealId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create deal in Bitrix24',
      });
    }

    // Step 2: Attach Product Rows to the Deal
    const mappedItems = body.items.map((item: any) => ({
      PRODUCT_ID: item.ID,
      PRICE: item.PRICE,
      QUANTITY: 1
    }));

    await $fetch(`${config.bitrixWebhook}crm.deal.productrows.set`, {
      method: 'POST',
      body: {
        id: dealId,
        rows: mappedItems
      }
    });

    return { success: true, dealId };
  } catch (error) {
    console.error('Checkout execution error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Checkout process failed',
    });
  }
});
