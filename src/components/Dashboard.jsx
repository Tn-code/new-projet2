import React, { useState } from 'react';
import ExcelImporter from './ExcelImporter';
import StackedBarChart3D from './charts/StackedBarChart3D';
import CustomLineChart from './charts/LineChart';
import DataTable from './DataTable';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState(['planifie', 'realise', 'taux_realisation']);
  const [chartType, setChartType] = useState('stacked'); // 'stacked' ou 'line'
  const [stats, setStats] = useState(null);

  const handleDataLoaded = (rawData) => {
    setData(rawData);
    setError(null);
    
    if (rawData.length > 0) {
      const totalPlanned = rawData.reduce((sum, row) => sum + (row.planifie || 0), 0);
      const totalActual = rawData.reduce((sum, row) => sum + (row.realise || 0), 0);
      const avgRate = rawData.reduce((sum, row) => sum + (row.taux_realisation || 0), 0) / rawData.length;
      
      setStats({
        totalPlanned,
        totalActual,
        avgRate: Math.round(avgRate),
        totalWeeks: rawData.length
      });
    }
  };

  const toggleIndicator = (key) => {
    setSelectedIndicators(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const lineConfigs = selectedIndicators.map(key => ({
    key,
    name: key === 'planifie' ? '📋 Planifié' : 
          key === 'realise' ? '✅ Réalisé' : 
          '📊 Taux Réalisation'
  }));

  const allIndicators = ['planifie', 'realise', 'taux_realisation'];
  const indicatorLabels = {
    planifie: '📋 Planifié',
    realise: '✅ Réalisé',
    taux_realisation: '📊 Taux Réalisation'
  };

  const getWeekNumber = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                📊 Suivi des Indicateurs 5S
              </h1>
              <p className="text-sm text-gray-500">
                Semaine {getWeekNumber()} · {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {data.length} semaines
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Import */}
        <section>
          <ExcelImporter 
            onDataLoaded={handleDataLoaded}
            onError={setError}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {error}
            </div>
          )}
        </section>

        {data.length > 0 && (
          <>
            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Semaines analysées</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalWeeks || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Total Planifié</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalPlanned || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Total Réalisé</p>
                <p className="text-2xl font-bold text-green-600">{stats?.totalActual || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">Taux moyen</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.avgRate || 0}%</p>
              </div>
            </section>

            {/* Sélecteurs */}
            <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    📌 Indicateurs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allIndicators.map(key => (
                      <button
                        key={key}
                        onClick={() => toggleIndicator(key)}
                        className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                          selectedIndicators.includes(key)
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {indicatorLabels[key]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    📊 Type de graphique
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType('stacked')}
                      className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                        chartType === 'stacked'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📊 Barres 3D
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                        chartType === 'line'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📈 Courbes
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Graphique */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {chartType === 'stacked' ? '📊 Évolution hebdomadaire (Barres empilées 3D)' : '📈 Évolution hebdomadaire (Courbes)'}
              </h2>
              {chartType === 'stacked' ? (
                <StackedBarChart3D 
                  data={data} 
                  xKey="semaine" 
                />
              ) : (
                <CustomLineChart 
                  data={data} 
                  xKey="semaine" 
                  lines={lineConfigs} 
                />
              )}
            </section>

            {/* Tableau */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Détail des données
              </h2>
              <DataTable data={data} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
