export type SupportedSymbol = 'SOL/USD' | 'BTC/USD' | 'ETH/USD' | 'USDT/USD';

export type FeedIDsType = {
  [key in SupportedSymbol]: {
    pyth: string;
    switchboard: string;
    band: string;
  };
};

export const FEED_IDS: FeedIDsType = {
  "SOL/USD": {
    pyth: "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
    switchboard: "0xda11e2f7cc293f3c133a2662c70d261a03158f1c7ac32079b9bd089e81abcabb",
    band: "SOL/USD"
  },
  "BTC/USD": {
    pyth: "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
    switchboard: "0xe2ba292a366ff6138ea8b66b12e49e74243816ad4edd333884acedcd0e0c2e9d",
    band: "BTC/USD"
  },
  "ETH/USD": {
    pyth: "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    switchboard: "0x19d75fde7e2e8fe57ea14028a33b1a14a7aaa60bca2107711559ade82697b582",
    band: "ETH/USD"
  },
  "USDT/USD": {
    pyth: "2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
    switchboard: "0xb52df6d4b1b98beacf80b66830ec15e09b35a7aca22b5d75c2e1fdb16f72945f",
    band: "USDT/USD"
  }
};

export const PYTH_FEED_IDS = Object.fromEntries(
  Object.entries(FEED_IDS).map(([symbol, ids]) => [ids.pyth, symbol])
) as { [key: string]: SupportedSymbol };

export const SWITCHBOARD_FEED_IDS = Object.fromEntries(
  Object.entries(FEED_IDS).map(([symbol, ids]) => [ids.switchboard, symbol])
) as { [key: string]: SupportedSymbol };

export const BAND_SYMBOLS = Object.values(FEED_IDS).map(ids => ids.band);

export const SUPPORTED_SYMBOLS = Object.keys(FEED_IDS) as SupportedSymbol[];