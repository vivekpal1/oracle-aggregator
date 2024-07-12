'use client';

import React, { useState, useEffect } from 'react';

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
        console.log('Fetched data:', data);  // Debug log
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

  if (loading) return <div className="text-center py-10">Loading price feeds...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  const formatPrice = (price: number, expo: number) => {
    return (price * Math.pow(10, expo)).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Oracle Aggregator</h1>
      {Object.entries(priceFeeds).map(([category, feeds]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {feeds.map((feed) => (
              <div key={feed.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{feed.symbol}</h3>
                <p className="text-2xl font-bold">${formatPrice(feed.price, feed.expo)}</p>
                <p className="text-sm text-gray-500">
                  Confidence: ±${formatPrice(feed.confidence, feed.expo)}
                </p>
                <p className="text-sm text-gray-500">
                  EMA: ${formatPrice(feed.emaPrice, feed.expo)}
                </p>
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(feed.publishTime * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceDisplay;