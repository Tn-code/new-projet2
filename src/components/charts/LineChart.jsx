import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomLineChart = ({ data, xKey = 'semaine', lines = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">📈 Aucune donnée à afficher</p>
      </div>
    );
  }

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
        />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name || line.key}
            stroke={colors[index % colors.length]}
            strokeWidth={2.5}
            dot={{ r: 5, strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
