import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Rectangle } from 'recharts';

const CustomBar = (props) => {
  const { fill, x, y, width, height, value } = props;
  const radius = 4, depth = 6;
  return (
    <g>
      <Rectangle x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <polygon points={`${x + width},${y + depth} ${x + width},${y + height} ${x + width - depth},${y + height + depth} ${x + width - depth},${y + depth}`} fill={fill} opacity={0.3} />
      <polygon points={`${x + width - depth},${y + height + depth} ${x},${y + height + depth} ${x},${y + height} ${x + width},${y + height}`} fill={fill} opacity={0.2} />
      {value > 0 && <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">{value}</text>}
    </g>
  );
};

const StackedBarChart3D = ({ data, xKey = 'semaine' }) => {
  const [filterWeeks, setFilterWeeks] = useState(10);
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg"><p className="text-gray-500">📊 Aucune donnée</p></div>;

  const colors = { planifie: '#3b82f6', realise: '#10b981', ecart: '#f59e0b' };
  const dataWithGap = data.map(item => ({
    ...item,
    planifie: item.planifie || 0,
    realise: item.realise || 0,
    ecart: Math.max(0, (item.planifie || 0) - (item.realise || 0)),
    taux_realisation: (item.planifie || 0) > 0 ? Math.round(((item.realise || 0) / (item.planifie || 0)) * 100) : 0
  }));

  const validData = dataWithGap.filter(item => item.planifie > 0 || item.realise > 0);
  const getFilteredData = () => {
    if (filterWeeks === 'all' || filterWeeks === 0) return validData;
    return validData.slice(-filterWeeks);
  };
  const filteredData = getFilteredData();

  const filterOptions = [{ value: 5, label: '5 sem.' }, { value: 10, label: '10 sem.' }, { value: 15, label: '15 sem.' }, { value: 20, label: '20 sem.' }, { value: 'all', label: 'Toutes' }];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4"><span className="text-blue-600">📋 Planifié</span><span className="font-medium">{d.planifie || 0}</span></div>
            <div className="flex justify-between gap-4"><span className="text-green-600">✅ Réalisé</span><span className="font-medium">{d.realise || 0}</span></div>
            {d.ecart > 0 && <div className="flex justify-between gap-4"><span className="text-orange-600">⚠️ Écart</span><span className="font-medium">{d.ecart}</span></div>}
            <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between gap-4">
              <span className="text-gray-600">📊 Taux</span>
              <span className={`font-medium ${d.taux_realisation >= 80 ? 'text-green-600' : d.taux_realisation >= 60 ? 'text-orange-600' : 'text-red-600'}`}>{d.taux_realisation}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">📅 Afficher:</span>
          {filterOptions.map((option) => (
            <button key={option.value} onClick={() => setFilterWeeks(option.value)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${filterWeeks === option.value ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {option.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{filteredData.length} semaines</span>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={filteredData} margin={{ top: 40, right: 30, left: 20, bottom: 40 }} barGap={6} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} strokeOpacity={0.5} />
          <XAxis dataKey={xKey} stroke="#6b7280" tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }} axisLine={{ stroke: '#d1d5db' }} interval={0} tickMargin={8} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5]} label={{ value: 'Valeurs (sur 5)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12, fontWeight: 500 } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" formatter={(value) => ({ planifie: '📋 Planifié', realise: '✅ Réalisé', ecart: '⚠️ Écart' }[value] || value)} />
          <Bar dataKey="planifie" stackId="stack" fill={colors.planifie} name="planifie" shape={<CustomBar />} />
          <Bar dataKey="ecart" stackId="stack" fill={colors.ecart} name="ecart" shape={<CustomBar />}>
            {filteredData.map((entry, index) => <Cell key={`ecart-${index}`} fill={entry.ecart > 0 ? colors.ecart : '#d1d5db'} opacity={entry.ecart > 0 ? 0.8 : 0.2} />)}
          </Bar>
          <Bar dataKey="realise" stackId="stack" fill={colors.realise} name="realise" shape={<CustomBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart3D;
