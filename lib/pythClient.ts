import { PriceServiceConnection, PriceFeed } from '@pythnetwork/price-service-client';

const PYTH_ENDPOINT = "https://hermes.pyth.network";

export const PRICE_FEED_IDS = {
  crypto: [
    '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
    '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', // SOL/USD
    '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
    '0x67be9f519b95cf24338801051f9a808eff0a578ccb388db73b7f6fe1de019ffb', // JITOSOL/USD
  ],
  equity: [
    '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688', // AAPL/USD
    '0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2', // GOOG/USD
    '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a', // AMZN/USD
    '0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593', // NVDA/USD
  ],
  metals: [
    '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e', // XAG/USD
    '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', // XAU/USD
  ],
  forex: [
    '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b', // EUR/USD
    '0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80', // AUD/USD
    '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1', // GBP/USD
  ],
};

export const PRICE_FEED_SYMBOLS: { [key: string]: string } = {
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43': 'BTC/USD',
  '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d': 'SOL/USD',
  '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace': 'ETH/USD',
  '0x67be9f519b95cf24338801051f9a808eff0a578ccb388db73b7f6fe1de019ffb': 'JITOSOL/USD',
  '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688': 'AAPL/USD',
  '0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2': 'GOOG/USD',
  '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a': 'AMZN/USD',
  '0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593': 'NVDA/USD',
  '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e': 'XAG/USD',
  '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2': 'XAU/USD',
  '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b': 'EUR/USD',
  '0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80': 'AUD/USD',
  '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1': 'GBP/USD',
};

class PythClient {
  private connection: PriceServiceConnection;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    this.connection = new PriceServiceConnection(PYTH_ENDPOINT);
  }

  async getPriceFeeds(): Promise<PriceFeed[]> {
    const allPriceIds = Object.values(PRICE_FEED_IDS).flat();
    try {
      console.log('Fetching price feeds...');
      const feeds = await this.connection.getLatestPriceFeeds(allPriceIds);
      if (!feeds) {
        console.warn('No price feeds returned from Pyth Network');
        return [];
      }
      return feeds;
    } catch (error) {
      console.error('Error fetching price feeds:', error);
      throw error;
    }
  }

  subscribeToUpdates(callback: (priceFeed: PriceFeed) => void, onError: (error: Error) => void) {
    const allPriceIds = Object.values(PRICE_FEED_IDS).flat();
    
    const handleWebSocketError = (error: Error) => {
      console.error('WebSocket error:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.subscribeToUpdates(callback, onError), 5000);
      } else {
        console.error('Max reconnection attempts reached.');
        onError(new Error('Failed to establish WebSocket connection after multiple attempts'));
      }
    };

    try {
      this.connection.subscribePriceFeedUpdates(allPriceIds, (priceFeed) => {
        try {
          callback(priceFeed);
        } catch (error) {
          console.error('Error in price feed callback:', error);
          handleWebSocketError(error as Error);
        }
      });
    } catch (error) {
      console.error('Error subscribing to price feed updates:', error);
      handleWebSocketError(error as Error);
    }
  }

  closeConnection() {
    try {
      this.connection.closeWebSocket();
    } catch (error) {
      console.error('Error closing WebSocket connection:', error);
    }
  }
}

export const pythClient = new PythClient();