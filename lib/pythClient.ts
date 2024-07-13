import { PriceServiceConnection, PriceFeed } from '@pythnetwork/price-service-client';
import { PYTH_FEED_IDS, PYTH_FEED_SYMBOLS } from './feedIds';

const PYTH_ENDPOINT = "https://hermes.pyth.network";

class PythClient {
  private connection: PriceServiceConnection;

  constructor() {
    this.connection = new PriceServiceConnection(PYTH_ENDPOINT);
  }

  async getPriceFeeds(): Promise<PriceFeed[]> {
    const allPriceIds = Object.values(PYTH_FEED_IDS).flat();
    try {
      console.log('Fetching price feeds...');
      const feeds = await this.connection.getLatestPriceFeeds(allPriceIds);
      if (!feeds) {
        console.warn('No price feeds returned from Pyth Network');
        return [];
      }
      console.log(`Received ${feeds.length} price feeds`);
      feeds.forEach(feed => {
        const price = feed.getPriceNoOlderThan(60);
        console.log(`Feed ID: ${feed.id}, Symbol: ${PYTH_FEED_SYMBOLS[feed.id]}, Price: ${price?.price}`);
      });
      return feeds;
    } catch (error) {
      console.error('Error fetching price feeds:', error);
      throw error;
    }
  }

  async subscribeToPriceFeeds(callback: (feed: PriceFeed) => void): Promise<void> {
    const allPriceIds = Object.values(PYTH_FEED_IDS).flat();
    try {
      await this.connection.subscribePriceFeedUpdates(allPriceIds, callback);
    } catch (error) {
      console.error('Error subscribing to price feeds:', error);
      throw error;
    }
  }

  closeConnection(): void {
    this.connection.closeWebSocket();
  }
}

export const pythClient = new PythClient();