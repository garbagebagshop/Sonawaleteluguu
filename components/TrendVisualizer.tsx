
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendVisualizerProps {
  history: Array<{ time: string; price: number; fullDate?: string }>;
}

export const TrendVisualizer: React.FC<TrendVisualizerProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 text-[10px] font-bold opacity-30 utility-font uppercase">
        History Syncing...
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="1 4" vertical={false} stroke="#ccc" />
          <XAxis 
            dataKey="time" 
            axisLine={{ stroke: '#000', strokeWidth: 1 }} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#000' }} 
          />
          <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
          <Tooltip 
            cursor={{ stroke: '#000', strokeWidth: 1 }}
            contentStyle={{ 
              backgroundColor: '#000', 
              color: '#fff', 
              fontSize: '10px',
              border: 'none',
              borderRadius: '0',
              padding: '8px'
            }} 
            formatter={(value: number) => [`₹${value.toLocaleString()}`, '24K Gold']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#000" 
            strokeWidth={2}
            fill="url(#colorPrice)" 
            fillOpacity={1}
            animationDuration={1500}
          />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#000" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
