
import React from 'react';
import { PriceData } from '../types';

interface PriceTickerProps {
  prices: PriceData;
  loading: boolean;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({ prices, loading }) => {
  return (
    <div className="h-10 flex items-center overflow-hidden border-b border-black/5 bg-[#FFF9F0]">
      <div className="bg-[#B90000] text-white h-full flex items-center px-4 text-[10px] font-black uppercase tracking-widest z-10 shrink-0 shadow-lg">
        LIVE
      </div>
      <div className="whitespace-nowrap animate-marquee-fast flex items-center gap-12 px-8 text-[11px] font-bold tracking-[0.05em] uppercase text-black/80">
        <div className="flex items-center gap-8">
          <span>GOLD 24K: ₹{prices.gold24k.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>GOLD 22K: ₹{prices.gold22k.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>SILVER: ₹{prices.silver.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>POT MARKET: STEADY</span>
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8">
          <span>GOLD 24K: ₹{prices.gold24k.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>GOLD 22K: ₹{prices.gold22k.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>SILVER: ₹{prices.silver.toLocaleString()}</span>
          <span className="opacity-20">|</span>
          <span>POT MARKET: STEADY</span>
        </div>
      </div>
    </div>
  );
};
