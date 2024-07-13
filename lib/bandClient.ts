import { Client } from '@bandprotocol/bandchain.js';

const BAND_ENDPOINT = 'https://laozi-testnet6.bandchain.org/grpc-web';

class BandClient {
  private client: Client;

  constructor() {
    this.client = new Client(BAND_ENDPOINT);
  }

  async getPrices(symbols: string[]): Promise<{ [key: string]: number }> {
    try {
      const minCount = 3;
      const askCount = 4;
      const referenceData = await this.client.getReferenceData(symbols, minCount, askCount);
      
      const prices: { [key: string]: number } = {};
      referenceData.forEach((data, index) => {
        prices[symbols[index]] = data.rate;
      });
      
      return prices;
    } catch (error) {
      console.error('Error fetching prices from Band:', error);
      throw error;
    }
  }
}

export const bandClient = new BandClient();