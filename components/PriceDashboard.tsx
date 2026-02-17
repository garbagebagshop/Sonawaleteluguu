import React from 'react';
import { PriceData } from '../types';

interface PriceDashboardProps {
  prices: PriceData;
  loading: boolean;
}

const PriceRow: React.FC<{ title: string; price: number; trend: string }> = ({ 
  title, price, trend 
}) => (
  <div className="flex justify-between items-center py-4 border-b border-black/10 last:border-0 text-black">
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-2xl font-black">₹{price.toLocaleString()}</p>
    </div>
    <div className="text-right">
      <span className="text-[9px] font-bold bg-green-100 text-green-800 px-1 py-0.5">{trend}</span>
      <p className="text-[9px] font-bold opacity-40 mt-1 uppercase">PER 10G</p>
    </div>
  </div>
);

export const PriceDashboard: React.FC<PriceDashboardProps> = ({ prices, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 border border-gray-200"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="border-y-2 border-black divide-y divide-black/10">
      <PriceRow title="Gold (24K)" price={prices.gold24k} trend="+0.12%" />
      <PriceRow title="Gold (22K)" price={prices.gold22k} trend="+0.08%" />
      <div className="flex justify-between items-center py-4 border-b border-black/10 last:border-0 text-black">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Silver (999)</h4>
          <p className="text-2xl font-black">₹{prices.silver.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1 py-0.5">-0.04%</span>
          <p className="text-[9px] font-bold opacity-40 mt-1 uppercase">PER 1KG</p>
        </div>
      </div>
    </div>
  );
};