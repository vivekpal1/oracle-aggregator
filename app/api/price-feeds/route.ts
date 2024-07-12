import { NextResponse } from 'next/server';
import { pythClient, PRICE_FEED_SYMBOLS, PRICE_FEED_IDS } from '../../../lib/pythClient';

export async function GET() {
  try {
    console.log('Fetching price feeds from Pyth Network...');
    const priceFeeds = await pythClient.getPriceFeeds();
    
    const categorizedFeeds = Object.entries(PRICE_FEED_IDS).reduce((acc, [category, ids]) => {
      acc[category] = priceFeeds
        .filter(feed => ids.includes(feed.id))
        .map(feed => {
          const price = feed.getPriceNoOlderThan(60);
          return {
            id: feed.id,
            symbol: PRICE_FEED_SYMBOLS[feed.id] || 'Unknown',
            price: price?.price,
            confidence: price?.conf,
            publishTime: price?.publishTime,
            emaPrice: feed.emaPrice.price,
            emaConfidence: feed.emaPrice.conf,
            expo: price?.expo,
          };
        });
      return acc;
    }, {} as { [key: string]: any[] });

    console.log('Categorized feeds:', JSON.stringify(categorizedFeeds, null, 2));

    return NextResponse.json(categorizedFeeds);
  } catch (error) {
    console.error('Error in price feeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch price feeds', details: (error as Error).message }, { status: 500 });
  }
}