import { NextResponse } from 'next/server';
import { pythClient, PRICE_FEED_SYMBOLS, PRICE_FEED_IDS } from '../../../lib/pythClient';

interface PriceFeed {
  id: string;
  symbol: string;
  price: number;
  confidence: number;
  publishTime: number;
  emaPrice: number;
  emaConfidence: number;
  expo: number;
}

interface CategorizedFeeds {
  crypto: PriceFeed[];
  equity: PriceFeed[];
  metals: PriceFeed[];
  forex: PriceFeed[];
}

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

export async function GET() {
  try {
    console.log('Fetching price feeds from Pyth Network...');
    const priceFeeds = await pythClient.getPriceFeeds();
    
    const categorizedFeeds: CategorizedFeeds = {
      crypto: [],
      equity: [],
      metals: [],
      forex: []
    };

    priceFeeds.forEach(feed => {
      const price = feed.getPriceNoOlderThan(60);
      const emaPrice = feed.getEmaPriceNoOlderThan(60);
      const feedData: PriceFeed = {
        id: feed.id,
        symbol: PRICE_FEED_SYMBOLS[feed.id] || 'Unknown',
        price: toNumber(price?.price),
        confidence: toNumber(price?.conf),
        publishTime: price?.publishTime || 0,
        emaPrice: toNumber(emaPrice?.price),
        emaConfidence: toNumber(emaPrice?.conf),
        expo: price?.expo || 0,
      };

      if (PRICE_FEED_IDS.crypto.includes(feed.id)) {
        categorizedFeeds.crypto.push(feedData);
      } else if (PRICE_FEED_IDS.equity.includes(feed.id)) {
        categorizedFeeds.equity.push(feedData);
      } else if (PRICE_FEED_IDS.metals.includes(feed.id)) {
        categorizedFeeds.metals.push(feedData);
      } else if (PRICE_FEED_IDS.forex.includes(feed.id)) {
        categorizedFeeds.forex.push(feedData);
      }
    });

    console.log('Categorized feeds:', JSON.stringify(categorizedFeeds, null, 2));

    return NextResponse.json(categorizedFeeds);
  } catch (error) {
    console.error('Error in price feeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch price feeds', details: (error as Error).message }, { status: 500 });
  }
}