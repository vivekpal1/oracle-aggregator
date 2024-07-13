import { NextResponse } from 'next/server';
import { pythClient } from '../../../lib/pythClient';
import { switchboardClient } from '../../../lib/switchboardClient';
import { bandClient } from '../../../lib/bandClient';
import { FEED_IDS, SUPPORTED_SYMBOLS, BAND_SYMBOLS, SupportedSymbol } from '../../../lib/feedIds';
import { CategorizedFeeds, PriceFeed } from '../../../types';

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

export async function GET() {
  console.log('API route: GET request received');
  try {
    console.log('API route: Fetching price feeds from Pyth, Switchboard, and Band...');
    const [pythFeeds, bandPrices] = await Promise.all([
      pythClient.getPriceFeeds(),
      bandClient.getPrices(BAND_SYMBOLS)
    ]);
    console.log(`API route: Received ${pythFeeds.length} feeds from Pyth and ${Object.keys(bandPrices).length} from Band`);
    
    const categorizedFeeds: CategorizedFeeds = {
      crypto: [],
      equity: [],
      metals: [],
      forex: []
    };

    for (const symbol of SUPPORTED_SYMBOLS) {
      console.log(`API route: Processing ${symbol}`);
      
      const pythFeed = pythFeeds.find(feed => feed.id === FEED_IDS[symbol].pyth);
      if (!pythFeed) {
        console.warn(`API route: No Pyth feed found for ${symbol}`);
        continue;
      }
      
      const pythPrice = pythFeed.getPriceNoOlderThan(60);
      const emaPrice = pythFeed.getEmaPriceNoOlderThan(60);
      
      let switchboardPrice: number | undefined;
      console.log(`API route: Fetching Switchboard price for ${symbol}`);
      try {
        const sbResponse = await switchboardClient.fetchPrice(symbol);
        switchboardPrice = sbResponse.price;
        console.log(`API route: Received Switchboard price for ${symbol}: ${switchboardPrice}`);
      } catch (error) {
        console.error(`API route: Error fetching Switchboard price for ${symbol}:`, error);
      }

      const bandPrice = bandPrices[FEED_IDS[symbol].band];

      const pythPriceValue = toNumber(pythPrice?.price);
      const prices = [pythPriceValue, switchboardPrice, bandPrice].filter(p => p !== undefined) as number[];
      const aggregatedPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

      console.log(`API route: ${symbol} - Pyth: ${pythPriceValue}, Switchboard: ${switchboardPrice}, Band: ${bandPrice}, Aggregated: ${aggregatedPrice}`);

      const feedData: PriceFeed = {
        id: pythFeed.id,
        symbol,
        pythPrice: pythPriceValue,
        switchboardPrice,
        bandPrice,
        aggregatedPrice,
        confidence: toNumber(pythPrice?.conf),
        publishTime: pythPrice?.publishTime || 0,
        emaPrice: toNumber(emaPrice?.price),
        emaConfidence: toNumber(emaPrice?.conf),
        expo: pythPrice?.expo || 0,
      };

      categorizedFeeds.crypto.push(feedData);
    }

    console.log('API route: Categorized feeds:', JSON.stringify(categorizedFeeds, null, 2));

    console.log('API route: Sending categorized feeds to client');
    return NextResponse.json(categorizedFeeds, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('API route: Error in price feeds API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price feeds', details: (error as Error).message },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}