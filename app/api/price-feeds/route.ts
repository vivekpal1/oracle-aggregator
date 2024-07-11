import { NextResponse } from 'next/server';
import { pythClient, PRICE_FEED_SYMBOLS } from '../../../lib/pythClient';

export async function GET() {
  try {
    console.log('Fetching price feeds from Pyth Network...');
    const priceFeeds = await pythClient.getPriceFeeds();
    
    const formattedPriceFeeds = Object.entries(priceFeeds).reduce((acc, [category, feeds]) => {
      acc[category] = feeds.map(feed => {
        const price = feed.getPriceNoOlderThan(60);
        return {
          id: feed.id,
          symbol: PRICE_FEED_SYMBOLS[feed.id] || 'Unknown',
          price: price?.price,
          confidence: price?.conf,
          publishTime: price?.publishTime,
          emaPrice: feed.emaPrice.price,
          emaConfidence: feed.emaPrice.conf,
        };
      });
      return acc;
    }, {} as { [key: string]: any[] });

    console.log('Formatted price feeds:', JSON.stringify(formattedPriceFeeds, null, 2));

    return NextResponse.json(formattedPriceFeeds);
  } catch (error) {
    console.error('Error in price feeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch price feeds', details: (error as Error).message }, { status: 500 });
  }
}