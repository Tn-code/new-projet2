import React, { useState, useEffect } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import DataFormGemba from '../components/DataFormGemba';
import StackedBarChart3D from '../components/charts/StackedBarChart3D';
import { TrendingUp, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { getAllGembaData } from '../services/firebaseGembaService';

const GembaOJT = ({ currentWeek, onWeekChange }) => {
  const [gembaData, setGembaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGembaData();
      setGembaData(data);
    } catch (err) {
      console.error('Erreur chargement Firebase:', err);
      setError('Erreur de chargement des données');
      setGembaData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDataChange = (newData) => {
    setGembaData(newData);
  };

  const validData = gembaData.filter(row => row.planifie > 0 || row.realise > 0);
  const totalPlanned = validData.reduce((sum, row) => sum + (row.planifie || 0), 0);
  const totalActual = validData.reduce((sum, row) => sum + (row.realise || 0), 0);
  const avgRate = validData.length > 0 
    ? Math.round(validData.reduce((sum, row) => sum + (row.taux_realisation || 0), 0) / validData.length)
    : 0;

  const stats = { totalPlanned, totalActual, avgRate, totalWeeks: validData.length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👥 Gemba OJT</h1>
          <p className="text-sm text-gray-500">Suivi des formations - Données sauvegardées dans Firebase</p>
        </div>
        <div className="flex items-center gap-4">
          <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
          <button 
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Users className="w-4 h-4" />
            {loading ? 'Chargement...' : 'Rafraîchir'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Chargement des données depuis Firebase...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Saisie des données Gemba OJT
        </h3>
        <DataFormGemba data={gembaData} onDataChange={handleDataChange} />
      </div>

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Semaines</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalWeeks}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Conformité</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.avgRate}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-orange-600">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Total Planifié</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalPlanned}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-purple-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Total Réalisé</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalActual}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Évolution Gemba OJT</h2>
            <StackedBarChart3D data={gembaData} xKey="semaine" />
          </div>
        </>
      )}
    </div>
  );
};

export default GembaOJT;
