'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { pythClient, PRICE_FEED_SYMBOLS } from '../lib/pythClient';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import AggregatedPrice from './AggregatedPrice';

interface PriceFeed {
  id: string;
  symbol: string;
  pythPrice: number;
  switchboardPrice: number | undefined;
  aggregatedPrice: number;
  confidence: number;
  publishTime: number;
  emaPrice: number;
  emaConfidence: number;
  expo: number;
}

interface PriceFeeds {
  crypto: PriceFeed[];
  equity: PriceFeed[];
  metals: PriceFeed[];
  forex: PriceFeed[];
}

const PriceDisplay: React.FC = () => {
  const [priceFeeds, setPriceFeeds] = useState<PriceFeeds>({ crypto: [], equity: [], metals: [], forex: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPriceFeeds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/price-feeds');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setPriceFeeds(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching price feeds:', err);
      setError('Failed to fetch price feeds');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPriceFeeds();
    const intervalId = setInterval(fetchPriceFeeds, 60000); // Fetch every minute
    return () => clearInterval(intervalId);
  }, [fetchPriceFeeds]);

  const allFeeds = Object.values(priceFeeds).flat();
  const filteredFeeds = allFeeds.filter(feed => 
    feed.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayFeeds = activeTab === 'All' ? filteredFeeds : priceFeeds[activeTab.toLowerCase() as keyof PriceFeeds];

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading price feeds...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Oracle Aggregator</h1>
        
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-4">
            {['All', 'Crypto', 'Equity', 'Metals', 'Forex'].map(tab => (
              <button
                key={tab}
                className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700'} mb-2 md:mb-0 transition-colors`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full md:w-64 px-4 py-2 bg-gray-800 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayFeeds.map((feed) => (
            <AggregatedPrice
              key={feed.id}
              symbol={feed.symbol}
              pythPrice={feed.pythPrice}
              switchboardPrice={feed.switchboardPrice}
              aggregatedPrice={feed.aggregatedPrice}
              expo={feed.expo}
            />
          ))}
        </div>

        {displayFeeds.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No results found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;