'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CategorizedFeeds, PriceFeed } from '../types';
import AggregatedPrice from './AggregatedPrice';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

const PriceDisplay: React.FC = () => {
  const [feeds, setFeeds] = useState<CategorizedFeeds>({ crypto: [], equity: [], metals: [], forex: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        console.log('PriceDisplay: Fetching feeds from client-side');
        const response = await fetch('/api/price-feeds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('PriceDisplay: Received data on client-side:', data);
        setFeeds(data);
        setLoading(false);
        setDataLoaded(true);
      } catch (err) {
        console.error('PriceDisplay: Error fetching feeds:', err);
        setError('Failed to fetch price feeds');
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const allFeeds = useMemo(() => {
    const allFeedsArray = Object.values(feeds).flat();
    console.log('PriceDisplay: All feeds:', allFeedsArray);
    return allFeedsArray;
  }, [feeds]);

  const filteredFeeds = useMemo(() => {
    const filtered = allFeeds.filter(feed => 
      feed.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('PriceDisplay: Filtered feeds:', filtered);
    return filtered;
  }, [allFeeds, searchTerm]);

  const displayFeeds = activeTab === 'All' ? filteredFeeds : feeds[activeTab.toLowerCase() as keyof CategorizedFeeds] || [];
  console.log('PriceDisplay: Display feeds:', displayFeeds);

  if (loading) {
    console.log('PriceDisplay: Rendering loading state');
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-blue-400">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  if (error) {
    console.log('PriceDisplay: Rendering error state:', error);
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  console.log('PriceDisplay: Rendering main component');
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-100">Search out your favorite asset!</h2>
      
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start space-x-2">
            {['All', 'Crypto', 'Equity', 'Metals', 'Forex'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search assets"
              className="w-full px-4 py-2 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayFeeds.map((feed) => (
            <div key={feed.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-blue-400">{feed.symbol}</h3>
                  <span className={`flex items-center ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.random() > 0.5 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    {(Math.random() * 5).toFixed(2)}%
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
          ))}
        </div>

        {displayFeeds.length === 0 && dataLoaded && (
          <div className="text-center py-8 text-gray-400">
            No results found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;