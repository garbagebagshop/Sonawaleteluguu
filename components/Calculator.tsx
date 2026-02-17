import React, { useState, useMemo } from 'react';
import { PriceData } from '../types';

interface CalculatorProps {
  prices: PriceData;
}

export const Calculator: React.FC<CalculatorProps> = ({ prices }) => {
  const [weight, setWeight] = useState<number>(10);
  const [purity, setPurity] = useState<'24k' | '22k'>('22k');
  const [making, setMaking] = useState<number>(12); // Percentage

  const calculation = useMemo(() => {
    const basePrice = purity === '24k' ? prices.gold24k : prices.gold22k;
    const value = (basePrice / 10) * weight;
    const makingCharge = value * (making / 100);
    const subtotal = value + makingCharge;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    return { value, makingCharge, gst, total };
  }, [weight, purity, making, prices]);

  return (
    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-black pb-1 utility-font">
        Price Estimator (అంచనా యంత్రం)
      </h3>
      
      <div className="space-y-3 mb-6">
        <div>
          <label className="text-[9px] font-black uppercase block mb-1">Weight (Grams)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full border border-black p-2 text-sm bg-white text-black focus:bg-yellow-50 outline-none rounded-none"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setPurity('22k')}
            className={`flex-1 text-[9px] font-black uppercase py-2 border border-black transition-colors ${purity === '22k' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            22K (Jewelry)
          </button>
          <button 
            onClick={() => setPurity('24k')}
            className={`flex-1 text-[9px] font-black uppercase py-2 border border-black transition-colors ${purity === '24k' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            24K (Pure)
          </button>
        </div>

        <div>
          <label className="text-[9px] font-black uppercase block mb-1">Making Charges (%)</label>
          <input 
            type="range" min="3" max="25" step="1"
            value={making} 
            onChange={(e) => setMaking(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-bold mt-1 uppercase">
            <span>Market Low: 3%</span>
            <span>{making}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-dotted border-black pt-4 telugu-text">
        <div className="flex justify-between text-xs">
          <span>బంగారం విలువ:</span>
          <span className="font-bold">₹{calculation.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>తరుగు (Making):</span>
          <span className="font-bold">₹{calculation.makingCharge.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>GST (3%):</span>
          <span className="font-bold">₹{calculation.gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-lg font-black border-t-2 border-black pt-2 mt-2">
          <span>మొత్తం:</span>
          <span>₹{calculation.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      
      <p className="text-[7px] font-bold uppercase opacity-40 mt-4 leading-tight italic">
        * Includes standard 3% GST. Making charges vary by jeweler showroom in Abids/Somajiguda.
      </p>
    </div>
  );
};