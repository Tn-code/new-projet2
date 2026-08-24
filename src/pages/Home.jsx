import React, { useState, useEffect } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import StackedBarChart3D from '../components/charts/StackedBarChart3D';
import ResultatsChart from '../components/charts/ResultatsChart';
import { Download, TrendingUp, Users, ClipboardCheck, Lightbulb, BarChart3, Database, Activity } from 'lucide-react';
import { getAllAuditData } from '../services/firebaseService';
import { getAllGembaData } from '../services/firebaseGembaService';
import { getAllResultatsData } from '../services/firebaseResultatsService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts';

// Données d'exemple pour la tendance
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

const Home = ({ currentWeek, onWeekChange }) => {
  const [auditData, setAuditData] = useState([]);
  const [gembaData, setGembaData] = useState([]);
  const [resultatsData, setResultatsData] = useState([]);
  const [tendanceData, setTendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger Audit 5S
      const audit = await getAllAuditData();
      setAuditData(audit.length > 0 ? audit : [
        { semaine: 'S1', planifie: 5, realise: 5, taux_realisation: 100 },
        { semaine: 'S2', planifie: 5, realise: 5, taux_realisation: 100 },
        { semaine: 'S3', planifie: 5, realise: 5, taux_realisation: 100 },
        { semaine: 'S4', planifie: 5, realise: 3, taux_realisation: 60 },
        { semaine: 'S5', planifie: 5, realise: 5, taux_realisation: 100 },
        { semaine: 'S6', planifie: 5, realise: 4, taux_realisation: 80 },
      ]);

      // Charger Gemba OJT
      const gemba = await getAllGembaData();
      setGembaData(gemba.length > 0 ? gemba : [
        { semaine: 'S1', planifie: 10, realise: 8, taux_realisation: 80 },
        { semaine: 'S2', planifie: 8, realise: 7, taux_realisation: 87 },
        { semaine: 'S3', planifie: 12, realise: 10, taux_realisation: 83 },
        { semaine: 'S4', planifie: 6, realise: 4, taux_realisation: 67 },
      ]);

      // Charger Résultats 5S
      const resultats = await getAllResultatsData();
      setResultatsData(resultats.length > 0 ? resultats : [
        { uap: 'UAP1', ligne: 'Mur Qualité', semaines: { S5: 85, S7: 85, S9: 88 } },
        { uap: 'UAP1', ligne: 'L77', semaines: { S4: 85, S7: 85, S10: 73 } },
        { uap: 'UAP2', ligne: 'L84', semaines: { S1: 77, S3: 77, S5: 85 } },
      ]);

      // Charger données pour la tendance
      const tendance = await getAllResultatsData();
      setTendanceData(tendance.length > 0 ? tendance : SAMPLE_DATA);

    } catch (err) {
      console.error('Erreur chargement Firebase:', err);
      setError('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données de tendance pour le graphique
  const getTendanceChartData = () => {
    if (tendanceData.length === 0) return [];
    
    // Prendre les 4 premières lignes pour l'affichage
    const selectedLines = tendanceData.slice(0, 4);
    
    // Collecter toutes les semaines
    const allWeeks = new Set();
    selectedLines.forEach(item => {
      Object.keys(item.semaines || {}).forEach(week => allWeeks.add(week));
    });
    const sortedWeeks = Array.from(allWeeks).sort((a, b) => {
      const numA = parseInt(a.replace('S', ''));
      const numB = parseInt(b.replace('S', ''));
      return numA - numB;
    });

    return sortedWeeks.map(week => {
      const row = { semaine: week };
      selectedLines.forEach(item => {
        row[item.ligne] = item.semaines[week] || null;
      });
      return row;
    });
  };

  const tendanceChartData = getTendanceChartData();

  // Tooltip personnalisé pour la tendance
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
          <p className="font-semibold text-gray-800 text-center border-b pb-2 mb-2">{label}</p>
          {payload.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">{p.name}</span>
              <span className="text-sm font-bold" style={{ color: p.color }}>
                {p.value !== null && p.value !== undefined ? `${p.value}%` : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const auditStats = {
    totalWeeks: auditData.filter(row => row.planifie > 0 || row.realise > 0).length,
    avgRate: auditData.length > 0 ? Math.round(auditData.reduce((sum, row) => sum + (row.taux_realisation || 0), 0) / auditData.length) : 0
  };

  const gembaStats = {
    totalWeeks: gembaData.filter(row => row.planifie > 0 || row.realise > 0).length,
    avgRate: gembaData.length > 0 ? Math.round(gembaData.reduce((sum, row) => sum + (row.taux_realisation || 0), 0) / gembaData.length) : 0
  };

  const committeeData = {
    date: new Date(2026, 0, 1 + (currentWeek - 1) * 7).toLocaleDateString('fr-FR'),
    metrics: { totalAudits: 12, complianceRate: 87, actionsCompleted: 45, openActions: 8 }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏠 Accueil</h1>
          <p className="text-sm text-gray-500">Tableau de bord CI - Semaine {currentWeek}</p>
        </div>
        <div className="flex items-center gap-4">
          <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
          <button 
            onClick={loadAllData}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Rafraîchir
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
          ❌ {error} - Utilisation des données locales
        </div>
      )}

      {/* Section: PPT CI Committee */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">📊 PPT CI Committee - W{currentWeek}</h2>
              <p className="text-sm text-gray-500 mt-1">Review du {committeeData.date}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Download className="w-4 h-4" /> Exporter PDF
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <ClipboardCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Audits</span>
              </div>
              <p className="text-2xl font-bold mt-1">{committeeData.metrics.totalAudits}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Conformité</span>
              </div>
              <p className="text-2xl font-bold mt-1">{committeeData.metrics.complianceRate}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Actions</span>
              </div>
              <p className="text-2xl font-bold mt-1">{committeeData.metrics.actionsCompleted}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600">
                <Lightbulb className="w-5 h-5" />
                <span className="text-sm font-medium">Propositions</span>
              </div>
              <p className="text-2xl font-bold mt-1">{committeeData.metrics.openActions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Audit 5S */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                Audit 5S
              </h2>
              <p className="text-xs text-gray-500">{auditStats.totalWeeks} semaines · {auditStats.avgRate}% conformité</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Échelle: 0-5</span>
          </div>
        </div>
        <div className="p-4">
          <StackedBarChart3D data={auditData} xKey="semaine" />
        </div>
      </div>

      {/* Section: Gemba OJT */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Gemba OJT
              </h2>
              <p className="text-xs text-gray-500">{gembaStats.totalWeeks} semaines · {gembaStats.avgRate}% conformité</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Nombre de formations</span>
          </div>
        </div>
        <div className="p-4">
          <StackedBarChart3D data={gembaData} xKey="semaine" />
        </div>
      </div>

      {/* Section: Résultats 5S */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Résultats 5S
              </h2>
              <p className="text-xs text-gray-500">{resultatsData.length} lignes · Semaine {currentWeek}</p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Taux de conformité</span>
          </div>
        </div>
        <div className="p-4">
          <ResultatsChart data={resultatsData} currentWeek={currentWeek} uapFilter="all" />
        </div>
      </div>

      {/* Section: Tendance des lignes 5S */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Tendance des lignes 5S
              </h2>
              <p className="text-xs text-gray-500">{tendanceData.length} lignes · Aperçu</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">Évolution</span>
          </div>
        </div>
        <div className="p-4">
          {tendanceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={tendanceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="semaine" 
                  stroke="#6b7280"
                  tick={{ fontSize: 10, fontWeight: 500 }}
                  axisLine={{ stroke: '#d1d5db' }}
                  interval={0}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={CustomTooltip} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <ReferenceLine y={85} stroke="#10b981" strokeDasharray="5 5" label={{ value: '85%', position: 'right', fill: '#10b981', fontSize: 9 }} />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: '70%', position: 'right', fill: '#f59e0b', fontSize: 9 }} />
                
                {tendanceData.slice(0, 4).map((item, index) => {
                  const color = COLORS[index % COLORS.length];
                  return (
                    <Line
                      key={`tendance_${index}`}
                      type="monotone"
                      dataKey={item.ligne}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: color }}
                      activeDot={{ r: 6, fill: color }}
                      name={`${item.ligne} (${item.uap})`}
                      connectNulls={true}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
              <p className="text-gray-500">📊 Aucune donnée de tendance disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
