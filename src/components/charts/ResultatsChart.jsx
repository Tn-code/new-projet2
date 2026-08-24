import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ResultatsChart = ({ data, currentWeek, uapFilter = 'all' }) => {
  const weekKey = `S${currentWeek}`;
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg"><p className="text-gray-500">📊 Aucune donnée</p></div>;
  }

  let filteredData = data;
  if (uapFilter !== 'all') filteredData = data.filter(item => item.uap === uapFilter);

  const chartData = filteredData
    .map(item => ({ ligne: item.ligne || 'Sans nom', uap: item.uap || 'Inconnu', resultat: item.semaines && item.semaines[weekKey] !== undefined ? item.semaines[weekKey] : null }))
    .filter(item => item.resultat !== null && !isNaN(item.resultat) && item.resultat > 0)
    .sort((a, b) => b.resultat - a.resultat);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg"><div className="text-center"><p className="text-gray-500">📊 Aucun résultat pour la semaine {currentWeek}</p></div></div>;
  }

  const getColor = (uap, index) => {
    const colors = { 'UAP1': ['#3b82f6', '#60a5fa', '#93c5fd'], 'UAP2': ['#10b981', '#34d399', '#6ee7b7'], 'Logistique': ['#f59e0b', '#fbbf24', '#fcd34d'] };
    const defaultColors = ['#8b5cf6', '#a78bfa', '#c4b5fd'];
    const uapColors = colors[uap] || defaultColors;
    return uapColors[index % uapColors.length];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[180px]">
        <p className="font-semibold text-gray-800 text-sm">{d.ligne}</p>
        <p className="text-xs text-gray-500">{d.uap}</p>
        <p className="text-lg font-bold text-blue-600 mt-1">{d.resultat}%</p>
        <p className="text-xs text-gray-400">Semaine {currentWeek}</p>
      </div>;
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 35)}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical" barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
          <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} domain={[0, 100]} label={{ value: 'Taux (%)', position: 'bottom', style: { fill: '#6b7280', fontSize: 11 } }} />
          <YAxis type="category" dataKey="ligne" stroke="#6b7280" tick={{ fontSize: 10 }} width={140} interval={0} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="resultat" name="Résultat 5S" fill="#3b82f6" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getColor(entry.uap, index)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultatsChart;
