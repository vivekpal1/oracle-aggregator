import React from 'react';

interface AggregatedPriceProps {
  symbol: string;
  pythPrice: number;
  switchboardPrice: number | undefined;
  aggregatedPrice: number;
  expo: number;
}

const AggregatedPrice: React.FC<AggregatedPriceProps> = ({ 
  symbol, 
  pythPrice, 
  switchboardPrice, 
  aggregatedPrice, 
  expo 
}) => {
  const formatPrice = (price: number) => {
    return (price * Math.pow(10, expo)).toFixed(2);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{symbol}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-gray-400">Pyth</p>
          <p className="text-lg">${formatPrice(pythPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Switchboard</p>
          <p className="text-lg">{switchboardPrice ? `$${formatPrice(switchboardPrice)}` : 'N/A'}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-400">Aggregated Price</p>
        <p className="text-2xl font-bold">${formatPrice(aggregatedPrice)}</p>
      </div>
    </div>
  );
};

export default AggregatedPrice;