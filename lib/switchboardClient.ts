export interface SwitchboardResponse {
    result: {
      result: string;
      timestamp: number;
    };
  }
  
  export interface FetchPriceResponse {
    price: number | undefined;
    timestamp: number;
  }
  
  const SWITCHBOARD_FEED_IDS: { [key: string]: string } = {
    'SOL/USD': '0xda11e2f7cc293f3c133a2662c70d261a03158f1c7ac32079b9bd089e81abcabb',
    'BTC/USD': '0xe2ba292a366ff6138ea8b66b12e49e74243816ad4edd333884acedcd0e0c2e9d',
    'JUP/USD': '0x7d15fea6a51307c78d6f3c2262c12bfdea3d034c431f3fa5c0d46c897de15853',
  };
  
  export async function fetchSwitchboardPrice(symbol: string): Promise<FetchPriceResponse> {
    const switchboardId = SWITCHBOARD_FEED_IDS[symbol];
    if (!switchboardId) {
      throw new Error(`Unsupported symbol: ${symbol}`);
    }
    try {
      const response = await fetch(
        `https://crossbar.switchboard.xyz/simulate/${switchboardId}`,
        { method: "GET" }
      );
      const data: SwitchboardResponse = await response.json();
      if (!data || !data.result || !data.result.result) {
        return { price: undefined, timestamp: Date.now() };
      }
      return { 
        price: Number(data.result.result), 
        timestamp: data.result.timestamp || Date.now() 
      };
    } catch (error: any) {
      console.error(`Failed to fetch Switchboard price for ${symbol}:`, error);
      return { price: undefined, timestamp: Date.now() };
    }
  }
  
  export const switchboardClient = {
    fetchPrice: fetchSwitchboardPrice,
  };