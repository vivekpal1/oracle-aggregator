'use client';

import React, { useState, useEffect } from 'react';
import { pythClient, PRICE_FEED_SYMBOLS } from '../lib/pythClient';
import { Search } from 'lucide-react';

interface PriceFeed {
  id: string;
  symbol: string;
  price: number;
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

  const toNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    return 0;
  };

  useEffect(() => {
    const fetchPriceFeeds = async () => {
      try {
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
    };

    fetchPriceFeeds();

    // Subscribe to real-time updates
    pythClient.subscribeToUpdates((updatedFeed) => {
      setPriceFeeds((prevFeeds) => {
        const newFeeds = { ...prevFeeds };
        for (const category of Object.keys(newFeeds) as (keyof PriceFeeds)[]) {
          const index = newFeeds[category].findIndex((feed) => feed.id === updatedFeed.id);
          if (index !== -1) {
            const price = updatedFeed.getPriceNoOlderThan(60);
            const emaPrice = updatedFeed.getEmaPriceNoOlderThan(60);
            newFeeds[category][index] = {
              id: updatedFeed.id,
              symbol: PRICE_FEED_SYMBOLS[updatedFeed.id] || 'Unknown',
              price: toNumber(price?.price),
              confidence: toNumber(price?.conf),
              publishTime: price?.publishTime || 0,
              emaPrice: toNumber(emaPrice?.price),
              emaConfidence: toNumber(emaPrice?.conf),
              expo: price?.expo || 0,
            };
          }
        }
        return newFeeds;
      });
    });

    return () => {
      pythClient.closeConnection();
    };
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading price feeds...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">Error: {error}</div>;

  const formatPrice = (price: number, expo: number) => {
    return (price * Math.pow(10, expo)).toFixed(2);
  };

  const allFeeds = Object.values(priceFeeds).flat();
  const filteredFeeds = allFeeds.filter(feed => 
    feed.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayFeeds = activeTab === 'All' ? filteredFeeds : priceFeeds[activeTab.toLowerCase() as keyof PriceFeeds];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Oracle Aggregator</h1>
        
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-4">
            {['All', 'Crypto', 'Equity', 'Metals', 'Forex'].map(tab => (
              <button
                key={tab}
                className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700'} mb-2 md:mb-0`}
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
              className="w-full md:w-64 px-4 py-2 bg-gray-800 rounded pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-800">
                <th className="p-3">SYMBOL</th>
                <th className="p-3">PRICE</th>
                <th className="p-3">7D</th>
                <th className="p-3">LAST 7 DAYS</th>
              </tr>
            </thead>
            <tbody>
              {displayFeeds.map((feed) => (
                <tr key={feed.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{feed.symbol}</td>
                  <td className="p-3">${formatPrice(feed.price, feed.expo)}</td>
                  <td className="p-3">
                    <span className={`${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                      {(Math.random() * 10 - 5).toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="w-24 h-8 bg-gray-700 rounded">
                      {/* Placeholder for chart */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;