'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CategorizedFeeds, PriceFeed } from '../types';
import AggregatedPrice from './AggregatedPrice';
import { Search } from 'lucide-react';

const PriceDisplay: React.FC = () => {
  const [feeds, setFeeds] = useState<CategorizedFeeds>({ crypto: [], equity: [], metals: [], forex: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        console.log('Fetching feeds from client-side');
        const response = await fetch('/api/price-feeds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data on client-side:', data);
        setFeeds(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        setError('Failed to fetch price feeds');
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const allFeeds = useMemo(() => {
    const allFeedsArray = Object.values(feeds).flat();
    console.log('All feeds:', allFeedsArray);
    return allFeedsArray;
  }, [feeds]);

  const filteredFeeds = useMemo(() => {
    const filtered = allFeeds.filter(feed => 
      feed.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered feeds:', filtered);
    return filtered;
  }, [allFeeds, searchTerm]);

  const displayFeeds = activeTab === 'All' ? filteredFeeds : feeds[activeTab.toLowerCase() as keyof CategorizedFeeds] || [];
  console.log('Display feeds:', displayFeeds);

  if (loading) return <div className="text-center py-8">Loading price feeds...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap justify-center sm:justify-start space-x-2">
          {['All', 'Crypto', 'Equity', 'Metals', 'Forex'].map(tab => (
            <button
              key={tab}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search assets"
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayFeeds.map((feed) => (
          <AggregatedPrice key={feed.id} feed={feed} />
        ))}
      </div>

      {displayFeeds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No results found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;