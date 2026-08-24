import React, { useState, useEffect } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import ResultatsForm from '../components/ResultatsForm';
import ResultatsChart from '../components/charts/ResultatsChart';
import { TrendingUp, CheckCircle, Building2, BarChart3, Filter, Database } from 'lucide-react';
import { getAllResultatsData } from '../services/firebaseResultatsService';

const Resultats5S = ({ currentWeek, onWeekChange }) => {
  const [resultatsData, setResultatsData] = useState([]);
  const [uapFilter, setUapFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données depuis Firebase
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResultatsData();
      setResultatsData(data);
    } catch (err) {
      console.error('Erreur chargement Firebase:', err);
      setError('Erreur de chargement des données');
      setResultatsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDataChange = (newData) => {
    setResultatsData(newData);
  };

  // Calculer les statistiques
  const weekKey = `S${currentWeek}`;
  const uapGroups = resultatsData.reduce((acc, item) => {
    if (!acc[item.uap]) acc[item.uap] = [];
    acc[item.uap].push(item);
    return acc;
  }, {});

  const calculateUAPAverage = (items) => {
    const values = items
      .map(item => item.semaines && item.semaines[weekKey])
      .filter(v => v !== undefined && v !== null && !isNaN(v) && v > 0);
    if (values.length === 0) return null;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const countLinesWithData = (items) => {
    return items.filter(item => 
      item.semaines && item.semaines[weekKey] !== undefined && 
      !isNaN(item.semaines[weekKey]) && item.semaines[weekKey] > 0
    ).length;
  };

  const totalLignes = resultatsData.length;
  const totalUAP = Object.keys(uapGroups).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Résultats 5S</h1>
          <p className="text-sm text-gray-500">Par UAP et Ligne - Données sauvegardées dans Firebase</p>
        </div>
        <div className="flex items-center gap-4">
          <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
          <button 
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {loading ? 'Chargement...' : 'Rafraîchir'}
          </button>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Chargement des données depuis Firebase...
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-blue-600">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">UAP</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalUAP}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Lignes</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalLignes}</p>
            <p className="text-xs text-gray-500">{countLinesWithData(resultatsData)} avec données S{currentWeek}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-orange-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Moyenne UAP1</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {calculateUAPAverage(uapGroups['UAP1'] || []) || '-'}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Moyenne UAP2</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {calculateUAPAverage(uapGroups['UAP2'] || []) || '-'}%
            </p>
          </div>
        </div>
      )}

      {/* Formulaire de saisie */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Saisie des résultats 5S - Semaine {currentWeek}
        </h3>
        <ResultatsForm 
          data={resultatsData} 
          onDataChange={handleDataChange}
          currentWeek={currentWeek}
        />
      </div>

      {/* Graphique */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Histogramme des résultats - Semaine {currentWeek}
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">UAP:</span>
            <select
              value={uapFilter}
              onChange={(e) => setUapFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="all">Tous</option>
              <option value="UAP1">UAP1</option>
              <option value="UAP2">UAP2</option>
              <option value="Logistique">Logistique</option>
            </select>
          </div>
        </div>
        <ResultatsChart 
          data={resultatsData} 
          currentWeek={currentWeek}
          uapFilter={uapFilter}
        />
      </div>
    </div>
  );
};

export default Resultats5S;
