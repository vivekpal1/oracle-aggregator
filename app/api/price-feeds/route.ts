import { NextResponse } from 'next/server';
import { pythClient, PRICE_FEED_SYMBOLS, PRICE_FEED_IDS } from '../../../lib/pythClient';
import { switchboardClient } from '../../../lib/switchboardClient';

interface PriceFeed {
  id: string;
  symbol: string;
  pythPrice: number;
  switchboardPrice: number | undefined;
  aggregatedPrice: number;
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
    console.log('API: Fetching price feeds from Pyth and Switchboard...');
    const pythFeeds = await pythClient.getPriceFeeds();
    console.log(`API: Received ${pythFeeds.length} feeds from Pyth`);
    
    const categorizedFeeds: CategorizedFeeds = {
      crypto: [],
      equity: [],
      metals: [],
      forex: []
    };

    for (const feed of pythFeeds) {
      const price = feed.getPriceNoOlderThan(60);
      const emaPrice = feed.getEmaPriceNoOlderThan(60);
      const symbol = PRICE_FEED_SYMBOLS[feed.id] || 'Unknown';
      
      console.log(`API: Processing ${symbol} from Pyth`);
      
      let switchboardPrice: number | undefined;
      if (['SOL/USD', 'BTC/USD', 'JUP/USD', 'JITOSOL/USD'].includes(symbol)) {
        console.log(`API: Fetching Switchboard price for ${symbol}`);
        try {
          const sbResponse = await switchboardClient.fetchPrice(symbol);
          switchboardPrice = sbResponse.price;
          console.log(`API: Received Switchboard price for ${symbol}: ${switchboardPrice}`);
        } catch (error) {
          console.error(`API: Error fetching Switchboard price for ${symbol}:`, error);
        }
      }

      const pythPrice = toNumber(price?.price);
      const aggregatedPrice = switchboardPrice ? (pythPrice + switchboardPrice) / 2 : pythPrice;

      console.log(`API: ${symbol} - Pyth: ${pythPrice}, Switchboard: ${switchboardPrice}, Aggregated: ${aggregatedPrice}`);

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

      if (PRICE_FEED_IDS.crypto.includes(feed.id)) {
        categorizedFeeds.crypto.push(feedData);
      } else if (PRICE_FEED_IDS.equity.includes(feed.id)) {
        categorizedFeeds.equity.push(feedData);
      } else if (PRICE_FEED_IDS.metals.includes(feed.id)) {
        categorizedFeeds.metals.push(feedData);
      } else if (PRICE_FEED_IDS.forex.includes(feed.id)) {
        categorizedFeeds.forex.push(feedData);
      }
    }

    console.log('API: Categorized feeds:', JSON.stringify(categorizedFeeds, null, 2));

    return NextResponse.json(categorizedFeeds);
  } catch (error) {
    console.error('API: Error in price feeds API:', error);
    return NextResponse.json({ error: 'Failed to fetch price feeds', details: (error as Error).message }, { status: 500 });
  }
}