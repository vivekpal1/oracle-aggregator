import { NextResponse } from 'next/server';
import { pythClient } from '../../../lib/pythClient';
import { switchboardClient } from '../../../lib/switchboardClient';
import { PYTH_FEED_SYMBOLS, PYTH_FEED_IDS, SWITCHBOARD_SUPPORTED_SYMBOLS } from '../../../lib/feedIds';
import { CategorizedFeeds, PriceFeed } from '../../../types';

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

export async function GET() {
  try {
    const pythFeeds = await pythClient.getPriceFeeds();
    
    const categorizedFeeds: CategorizedFeeds = {
      crypto: [],
      equity: [],
      metals: [],
      forex: []
    };

    for (const feed of pythFeeds) {
      const price = feed.getPriceNoOlderThan(60);
      const emaPrice = feed.getEmaPriceNoOlderThan(60);
      const symbol = PYTH_FEED_SYMBOLS[feed.id] || 'Unknown';
      
      let switchboardPrice: number | undefined;
      if (SWITCHBOARD_SUPPORTED_SYMBOLS.includes(symbol)) {
        const sbResponse = await switchboardClient.fetchPrice(symbol);
        switchboardPrice = sbResponse.price;
      }

      const pythPrice = toNumber(price?.price);
      const aggregatedPrice = switchboardPrice ? (pythPrice + switchboardPrice) / 2 : pythPrice;

      const feedData: PriceFeed = {
        id: feed.id,
        symbol,
        pythPrice,
        switchboardPrice,
        aggregatedPrice,
        confidence: toNumber(price?.conf),
        publishTime: price?.publishTime || 0,
        emaPrice: toNumber(emaPrice?.price),
        emaConfidence: toNumber(emaPrice?.conf),
        expo: price?.expo || 0,
      };

      if (PYTH_FEED_IDS.crypto.includes(feed.id)) {
        categorizedFeeds.crypto.push(feedData);
      } else if (PYTH_FEED_IDS.equity.includes(feed.id)) {
        categorizedFeeds.equity.push(feedData);
      } else if (PYTH_FEED_IDS.metals.includes(feed.id)) {
        categorizedFeeds.metals.push(feedData);
      } else if (PYTH_FEED_IDS.forex.includes(feed.id)) {
        categorizedFeeds.forex.push(feedData);
      }
    }

    return NextResponse.json(categorizedFeeds);
  } catch (error) {
    console.error('API: Error in price feeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch price feeds' }, { status: 500 });
  }
}