import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/formatters';

export default function TopHoldingsBar({ data = [] }) {
  const { theme } = useTheme();

  return (
    <div className="h-[270px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <XAxis
            type="number"
            tickFormatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
            stroke={theme === 'dark' ? '#71717a' : '#a1a1aa'}
            fontSize={10}
          />
          <YAxis
            dataKey="ticker"
            type="category"
            stroke={theme === 'dark' ? '#d4d4d8' : '#3f3f46'}
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            formatter={(val) => [formatINR(val), 'Valuation']}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#0d1322' : '#ffffff',
              borderColor: theme === 'dark' ? '#1f293d' : '#e2e8f0',
              borderRadius: '16px',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="marketValue" fill="#06b6d4" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}