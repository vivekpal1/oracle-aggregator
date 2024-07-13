import React from 'react';
import { PriceFeed } from '../types';
import { formatPrice, formatPercentage } from '../utils/formatters';

interface AggregatedPriceProps {
  feed: PriceFeed;
}

const AggregatedPrice: React.FC<AggregatedPriceProps> = ({ feed }) => {
  const priceChange = Math.random() * 0.1 - 0.05; // Mock price change

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{feed.symbol}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-gray-400">Pyth</p>
          <p className="text-lg">${formatPrice(feed.pythPrice, feed.expo)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Switchboard</p>
          <p className="text-lg">
            {feed.switchboardPrice
              ? `$${formatPrice(feed.switchboardPrice, feed.expo)}`
              : 'N/A'}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-400">Aggregated Price</p>
        <p className="text-2xl font-bold">${formatPrice(feed.aggregatedPrice, feed.expo)}</p>
      </div>
      <div className="mt-2">
        <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatPercentage(priceChange)} (24h)
        </p>
      </div>
    </div>
  );
};

export default AggregatedPrice;