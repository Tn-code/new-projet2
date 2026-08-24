import React, { useState, useEffect, useMemo } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import { TrendingUp, Filter, Database, BarChart3, Activity, Check, X, Table } from 'lucide-react';
import { getAllResultatsData } from '../services/firebaseResultatsService';

// Données intégrées avec toutes les semaines
const SAMPLE_DATA = [
  { uap: 'UAP1', ligne: 'Mur Qualité', semaines: { S5: 85, S7: 85, S9: 88, S12: 88 } },
  { uap: 'UAP1', ligne: 'L77', semaines: { S4: 85, S7: 85, S10: 73, S12: 73, S19: 65, S21: 73, S34: 62, S13: 88 } },
  { uap: 'UAP1', ligne: 'L76', semaines: { S1: 79, S5: 69, S8: 85, S11: 88, S14: 85, S17: 77, S22: 73 } },
  { uap: 'UAP1', ligne: 'F01', semaines: { S1: 82, S3: 85, S6: 88, S9: 73, S11: 88, S14: 88, S18: 88, S22: 88 } },
  { uap: 'UAP1', ligne: 'F02', semaines: { S1: 82, S4: 85, S6: 61, S9: 77, S12: 81, S15: 88 } },
  { uap: 'UAP1', ligne: 'F99', semaines: { S1: 80, S3: 85, S7: 71, S10: 81, S13: 81, S17: 85, S20: 65, S23: 85 } },
  { uap: 'UAP1', ligne: 'F85', semaines: { S1: 86, S3: 88, S7: 73, S10: 81, S13: 81, S16: 85, S22: 81, S24: 69 } },
  { uap: 'UAP1', ligne: 'F86', semaines: { S1: 84, S4: 88, S8: 77, S11: 85, S14: 85 } },
  { uap: 'UAP1', ligne: 'F83', semaines: { S1: 74, S3: 84, S5: 77, S7: 69, S11: 84, S20: 81 } },
  { uap: 'UAP2', ligne: 'L84', semaines: { S1: 77, S3: 77, S5: 85, S8: 85, S10: 65, S13: 75, S16: 88, S19: 75, S22: 77, S24: 61, S34: 73 } },
  { uap: 'UAP2', ligne: 'F87 (BR463)', semaines: { S1: 80, S3: 81, S7: 87, S10: 85, S13: 85, S16: 88, S21: 80 } },
  { uap: 'UAP2', ligne: '125T', semaines: { S1: 82, S5: 85, S8: 81, S10: 81, S14: 85, S19: 81 } },
  { uap: 'UAP2', ligne: 'F06', semaines: { S3: 78, S5: 85, S7: 77, S9: 81, S11: 81, S13: 76, S15: 81, S17: 69, S20: 68 } },
  { uap: 'UAP2', ligne: '80T', semaines: { S1: 85, S3: 81, S16: 85, S20: 65, S34: 63 } },
  { uap: 'UAP2', ligne: '120T', semaines: { S1: 74, S5: 88, S7: 80, S12: 88 } },
  { uap: 'UAP2', ligne: 'A12/ Boy 2/ Boy 3', semaines: { S1: 65, S3: 73, S5: 73, S8: 81, S11: 77, S14: 85, S17: 73, S20: 69, S23: 69 } },
  { uap: 'UAP2', ligne: 'F15', semaines: { S1: 81, S4: 81, S5: 85, S7: 80, S9: 92, S12: 85, S15: 88, S18: 88, S22: 77 } },
  { uap: 'Logistique', ligne: 'Magasin P1', semaines: { S7: 81 } },
  { uap: 'Logistique', ligne: 'Magasin Genarale', semaines: { S1: 92, S3: 92, S5: 92, S7: 92, S9: 96, S10: 88, S13: 96, S16: 88 } },
  { uap: 'Logistique', ligne: 'Magasin P2', semaines: { S1: 74, S3: 81, S6: 88, S15: 78, S16: 78 } },
];

const TendanceLignes = ({ currentWeek, onWeekChange }) => {
  const [data, setData] = useState([]);
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [selectedUAP, setSelectedUAP] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showLineSelector, setShowLineSelector] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' uniquement

  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#06b6d4'
  ];

  const getLineId = (item, index) => `${item.uap}_${item.ligne}_${index}`;

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const firebaseData = await getAllResultatsData();
        if (firebaseData && firebaseData.length > 0) {
          setData(firebaseData);
        } else {
          setData(SAMPLE_DATA);
        }
      } catch (err) {
        console.error('Erreur, utilisation des données locales:', err);
        setData(SAMPLE_DATA);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getLinesByUAP = (uap) => {
    if (uap === 'all') return data;
    return data.filter(item => item.uap === uap);
  };

  const availableLines = useMemo(() => {
    return getLinesByUAP(selectedUAP);
  }, [data, selectedUAP]);

  // Initialiser la sélection
  useEffect(() => {
    if (availableLines.length > 0 && selectedLineIds.length === 0) {
      const defaultLines = availableLines.slice(0, Math.min(4, availableLines.length));
      setSelectedLineIds(defaultLines.map((item, index) => getLineId(item, index)));
    }
  }, [availableLines]);

  const toggleLine = (id) => {
    if (selectedLineIds.includes(id)) {
      if (selectedLineIds.length > 1) {
        setSelectedLineIds(selectedLineIds.filter(l => l !== id));
      }
    } else {
      if (selectedLineIds.length < 10) {
        setSelectedLineIds([...selectedLineIds, id]);
      }
    }
  };

  const selectAllLines = () => {
    const maxLines = Math.min(10, availableLines.length);
    setSelectedLineIds(availableLines.slice(0, maxLines).map((item, index) => getLineId(item, index)));
  };

  const deselectAllLines = () => {
    if (selectedLineIds.length > 0) {
      setSelectedLineIds([]);
    }
  };

  const getLineColor = (index) => COLORS[index % COLORS.length];

  // Données sélectionnées
  const selectedData = data.filter((item, index) => {
    const id = getLineId(item, index);
    return selectedLineIds.includes(id);
  });

  // Collecter toutes les semaines
  const allWeeks = new Set();
  selectedData.forEach(item => {
    Object.keys(item.semaines || {}).forEach(week => allWeeks.add(week));
  });
  const sortedWeeks = Array.from(allWeeks).sort((a, b) => {
    const numA = parseInt(a.replace('S', ''));
    const numB = parseInt(b.replace('S', ''));
    return numA - numB;
  });

  const uapList = ['all', ...new Set(data.map(item => item.uap))];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Tendance des lignes 5S</h1>
          <p className="text-sm text-gray-500">
            {selectedLineIds.length} ligne(s) sélectionnée(s) · {sortedWeeks.length} semaines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              <Filter className="w-4 h-4 inline mr-1" />
              UAP
            </label>
            <select
              value={selectedUAP}
              onChange={(e) => {
                setSelectedUAP(e.target.value);
                const lines = getLinesByUAP(e.target.value);
                if (lines.length > 0) {
                  setSelectedLineIds(lines.slice(0, Math.min(4, lines.length)).map((item, index) => getLineId(item, index)));
                } else {
                  setSelectedLineIds([]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {uapList.map(uap => (
                <option key={`uap_${uap}`} value={uap}>
                  {uap === 'all' ? 'Tous les UAP' : uap}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Lignes sélectionnées ({selectedLineIds.length}/{Math.min(10, availableLines.length)})
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLineSelector(!showLineSelector)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                {showLineSelector ? 'Cacher' : 'Afficher'}
              </button>
              <button
                onClick={selectAllLines}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                title="Sélectionner tout"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={deselectAllLines}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                title="Désélectionner tout"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{availableLines.length}</span> lignes disponibles
            </div>
          </div>
        </div>

        {showLineSelector && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableLines.map((item, index) => {
                const id = getLineId(item, index);
                const isSelected = selectedLineIds.includes(id);
                return (
                  <button
                    key={`selector_${id}`}
                    onClick={() => toggleLine(id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLineColor(index) }} />
                    <span className="truncate">{item.ligne}</span>
                    <span className="text-xs text-gray-400">({item.uap})</span>
                    {isSelected && <Check className="w-3 h-3 ml-auto text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tableau des données */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">📋 Données des lignes sélectionnées</h2>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {selectedData.length} lignes · {sortedWeeks.length} semaines
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gray-50">
            <p className="text-gray-500">⏳ Chargement...</p>
          </div>
        ) : selectedData.length === 0 || selectedLineIds.length === 0 ? (
          <div className="flex items-center justify-center h-96 bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 text-lg">📊 Aucune donnée disponible</p>
              <p className="text-sm text-gray-400 mt-2">Sélectionnez une ou plusieurs lignes</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    UAP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    Ligne
                  </th>
                  {sortedWeeks.map(week => (
                    <th key={`header_${week}`} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      {week}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    Moyenne
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedData.map((item, idx) => {
                  const values = sortedWeeks.map(week => item.semaines[week] || null);
                  const validValues = values.filter(v => v !== null && !isNaN(v));
                  const average = validValues.length > 0 
                    ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length)
                    : null;
                  
                  return (
                    <tr key={`row_${idx}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border border-gray-200">
                        {item.uap}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLineColor(idx) }} />
                          {item.ligne}
                        </div>
                      </td>
                      {sortedWeeks.map(week => {
                        const value = item.semaines[week];
                        return (
                          <td key={`${idx}_${week}`} className="px-4 py-3 text-center border border-gray-200">
                            {value !== undefined && value !== null && !isNaN(value) ? (
                              <span className={`font-semibold ${
                                value >= 85 ? 'text-green-600' :
                                value >= 70 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {value}%
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center font-bold border border-gray-200">
                        {average !== null ? (
                          <span className={`${
                            average >= 85 ? 'text-green-600' :
                            average >= 70 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {average}%
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      {selectedData.length > 0 && sortedWeeks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Lignes</p>
            <p className="text-2xl font-bold text-blue-600">{selectedData.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Semaines</p>
            <p className="text-2xl font-bold text-green-600">{sortedWeeks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Données totales</p>
            <p className="text-2xl font-bold text-purple-600">
              {selectedData.reduce((acc, item) => {
                return acc + Object.keys(item.semaines || {}).length;
              }, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Taux moyen</p>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(selectedData.reduce((acc, item) => {
                const values = Object.values(item.semaines || {}).filter(v => !isNaN(v) && v !== null);
                return acc + (values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0);
              }, 0) / selectedData.length)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TendanceLignes;
