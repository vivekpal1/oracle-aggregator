import { SWITCHBOARD_FEED_IDS } from './feedIds';

interface SwitchboardResponse {
  result: {
    result: string;
    timestamp: number;
  };
}

export interface FetchPriceResponse {
  price: number | undefined;
  timestamp: number;
}

async function fetchSwitchboardPrice(symbol: string): Promise<FetchPriceResponse> {
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
  } catch (error) {
    console.error(`Failed to fetch Switchboard price for ${symbol}:`, error);
    return { price: undefined, timestamp: Date.now() };
  }
}

export const switchboardClient = {
  fetchPrice: fetchSwitchboardPrice,
};