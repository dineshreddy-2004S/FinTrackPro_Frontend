import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/formatters';

const VIBRANT_PALETTE = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AllocationPie({ data = [] }) {
  const { theme } = useTheme();

  return (
    <div className="h-[270px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) =>
              percentage > 0 ? `${name} ${percentage.toFixed(0)}%` : ''
            }
            outerRadius={95}
            innerRadius={52}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [formatINR(val), 'Value']}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#0d1322' : '#ffffff',
              borderColor: theme === 'dark' ? '#1f293d' : '#e2e8f0',
              borderRadius: '16px',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}