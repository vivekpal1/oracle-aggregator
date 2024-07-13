export interface PriceFeed {
  id: string;
  symbol: string;
  pythPrice: number;
  switchboardPrice?: number;
  bandPrice?: number;
  aggregatedPrice: number;
  confidence: number;
  publishTime: number;
  emaPrice: number;
  emaConfidence: number;
  expo: number;
}

export interface CategorizedFeeds {
  crypto: PriceFeed[];
  equity: PriceFeed[];
  metals: PriceFeed[];
  forex: PriceFeed[];
}