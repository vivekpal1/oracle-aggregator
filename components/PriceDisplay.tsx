'use client';

import React, { useState, useEffect } from 'react';

interface PriceFeed {
  id: string;
  symbol: string;
  price: number;
  confidence: number;
  publishTime: number;
}

interface PriceFeeds {
  [category: string]: PriceFeed[];
}

const PriceDisplay: React.FC = () => {
  const [priceFeeds, setPriceFeeds] = useState<PriceFeeds>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceFeeds = async () => {
      try {
        const response = await fetch('/api/price-feeds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPriceFeeds(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching price feeds:', err);
        setError('Failed to fetch price feeds');
        setLoading(false);
      }
    };

    fetchPriceFeeds();
    const interval = setInterval(fetchPriceFeeds, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-10 text-indigo-600">Loading price feeds...</div>;
  if (error) return <div className="text-center py-10 text-rose-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Oracle Aggregator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(priceFeeds).map(([category, feeds]) => (
          <div key={category} className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100">
            <h2 className="text-xl font-semibold mb-4 capitalize text-indigo-700">{category}</h2>
            <div className="space-y-4">
              {feeds.map((feed) => (
                <div key={feed.id} className="border-b border-indigo-100 pb-2">
                  <h3 className="text-lg font-medium text-slate-800">{feed.symbol}</h3>
                  <p className="text-2xl font-bold text-slate-700">
                    ${feed.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500">
                    ±${feed.confidence.toFixed(2)} | {new Date(feed.publishTime).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceDisplay;