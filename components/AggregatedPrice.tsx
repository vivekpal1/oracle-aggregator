'use client';

import React from 'react';
import { PriceFeed } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AggregatedPriceProps {
  feed: PriceFeed;
}

const AggregatedPrice: React.FC<AggregatedPriceProps> = ({ feed }) => {
  console.log('AggregatedPrice: Rendering for:', feed);
  const priceChange = Math.random() * 0.1 - 0.05; // Mock price change

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-blue-400">{feed.symbol}</h3>
          <span className={`flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(priceChange * 100).toFixed(2)}%
          </span>
        </div>
        <p className="text-2xl font-bold mb-2">${feed.aggregatedPrice.toFixed(2)}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-400">Pyth</p>
            <p>${feed.pythPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Switchboard</p>
            <p>${feed.switchboardPrice?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Band</p>
            <p>${feed.bandPrice?.toFixed(2) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Confidence</p>
            <p>±${feed.confidence.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregatedPrice;