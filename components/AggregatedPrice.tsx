'use client';

import React from 'react';
import { PriceFeed } from '../types';
import { formatPrice, formatPercentage } from '../utils/formatters';

interface AggregatedPriceProps {
  feed: PriceFeed;
}

const AggregatedPrice: React.FC<AggregatedPriceProps> = ({ feed }) => {
  console.log('Rendering AggregatedPrice for:', feed);
  const priceChange = Math.random() * 0.1 - 0.05; // Mock price change

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{feed.symbol}</h3>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-sm text-gray-500">Pyth</p>
          <p className="text-md font-medium">${formatPrice(feed.pythPrice, feed.expo)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Switchboard</p>
          <p className="text-md font-medium">
            {feed.switchboardPrice
              ? `$${formatPrice(feed.switchboardPrice, feed.expo)}`
              : 'N/A'}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">Aggregated Price</p>
        <p className="text-xl font-bold">${formatPrice(feed.aggregatedPrice, feed.expo)}</p>
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