#!/bin/bash

echo "========================================="
echo "🚀 Installation de l'application CI Dashboard"
echo "========================================="

# 1. Installation des dépendances
echo "📦 Installation des dépendances..."
npm install firebase lucide-react recharts

# 2. Création des dossiers
echo "📁 Création des dossiers..."
mkdir -p src/components/charts
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/firebase
mkdir -p src/utils

# 3. Firebase Config
echo "🔥 Configuration Firebase..."
cat > src/firebase/config.js << 'FIREBASECONFIG'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAb-IkzbTpZKl98FGAMSrNxgieocy4A95w",
  authDomain: "projet-7b395.firebaseapp.com",
  projectId: "projet-7b395",
  storageBucket: "projet-7b395.firebasestorage.app",
  messagingSenderId: "810556209254",
  appId: "1:810556209254:web:4124c788656d89ef49d5a7",
  measurementId: "G-JT7FC2EWR6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
FIREBASECONFIG

# 4. Services Firebase
echo "📊 Création des services Firebase..."
cat > src/services/firebaseService.js << 'FIREBASESERVICE'
import { db } from '../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, 
  query, orderBy, where, Timestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'audit5S';

export const saveAuditData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      semaine: data.semaine,
      planifie: data.planifie || 0,
      realise: data.realise || 0,
      taux_realisation: data.taux_realisation || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    throw error;
  }
};

export const getAllAuditData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('semaine', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération:", error);
    throw error;
  }
};

export const getAuditDataByWeek = async (week) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('semaine', '==', week));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Erreur récupération semaine:", error);
    throw error;
  }
};

export const updateAuditData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour:", error);
    throw error;
  }
};

export const deleteAuditData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression:", error);
    throw error;
  }
};

export const saveMultipleAuditData = async (dataArray) => {
  try {
    const results = [];
    for (const data of dataArray) {
      const result = await saveAuditData(data);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error("Erreur sauvegarde multiple:", error);
    throw error;
  }
};
FIREBASESERVICE

cat > src/services/firebaseGembaService.js << 'FIREBASEGEMBASERVICE'
import { db } from '../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, 
  query, orderBy, where, Timestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'gembaOJT';

export const saveGembaData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      semaine: data.semaine,
      planifie: data.planifie || 0,
      realise: data.realise || 0,
      taux_realisation: data.taux_realisation || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erreur sauvegarde Gemba:", error);
    throw error;
  }
};

export const getAllGembaData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('semaine', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération Gemba:", error);
    throw error;
  }
};

export const getGembaDataByWeek = async (week) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('semaine', '==', week));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Erreur récupération semaine Gemba:", error);
    throw error;
  }
};

export const updateGembaData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour Gemba:", error);
    throw error;
  }
};

export const deleteGembaData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression Gemba:", error);
    throw error;
  }
};

export const saveMultipleGembaData = async (dataArray) => {
  try {
    const results = [];
    for (const data of dataArray) {
      const result = await saveGembaData(data);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error("Erreur sauvegarde multiple Gemba:", error);
    throw error;
  }
};
FIREBASEGEMBASERVICE

cat > src/services/firebaseResultatsService.js << 'FIREBASERESULTATSSERVICE'
import { db } from '../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, 
  query, orderBy, where, Timestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'resultats5S';

export const saveResultatsData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      uap: data.uap,
      ligne: data.ligne,
      semaines: data.semaines || {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erreur sauvegarde Résultats:", error);
    throw error;
  }
};

export const getAllResultatsData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uap', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération Résultats:", error);
    throw error;
  }
};

export const getResultatsByUAP = async (uap) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('uap', '==', uap));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération par UAP:", error);
    throw error;
  }
};

export const updateResultatsData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour Résultats:", error);
    throw error;
  }
};

export const deleteResultatsData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression Résultats:", error);
    throw error;
  }
};
FIREBASERESULTATSSERVICE

# 5. Composants communs
echo "🧩 Création des composants..."

cat > src/components/common/WeekSelector.jsx << 'WEEKSELECTOR'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const WeekSelector = ({ currentWeek, onWeekChange, label = "Semaine" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const weeks = Array.from({ length: 52 }, (_, i) => ({ value: i + 1, label: `W${i + 1}` }));

  const handlePrev = () => { if (currentWeek > 1) onWeekChange(currentWeek - 1); };
  const handleNext = () => { if (currentWeek < 52) onWeekChange(currentWeek + 1); };
  const handleSelect = (week) => { onWeekChange(week); setIsOpen(false); };

  const currentRealWeek = new Date().getWeek();

  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-1">
          <button onClick={handlePrev} className="p-1 rounded hover:bg-gray-100" disabled={currentWeek <= 1}>
            <ChevronLeft className={`w-4 h-4 ${currentWeek <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold text-sm hover:bg-blue-100 min-w-[60px]">
            W{currentWeek}
          </button>
          <button onClick={handleNext} className="p-1 rounded hover:bg-gray-100" disabled={currentWeek >= 52}>
            <ChevronRight className={`w-4 h-4 ${currentWeek >= 52 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
        {currentWeek === currentRealWeek && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">En cours</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
            <input type="text" placeholder="Rechercher..." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const search = e.target.value.toLowerCase();
                document.querySelectorAll('.week-item').forEach(item => {
                  item.style.display = item.textContent.toLowerCase().includes(search) ? 'flex' : 'none';
                });
              }}
            />
          </div>
          <div className="p-1">
            {weeks.map((week) => (
              <button key={week.value} onClick={() => handleSelect(week.value)}
                className={`week-item w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-50 transition-colors ${
                  currentWeek === week.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}>
                <span className="font-medium">{week.label}</span>
                {week.value === currentRealWeek && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Actuelle</span>}
                {currentWeek === week.value && <span className="text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Date.prototype.getWeek = function() {
  const d = new Date(this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default WeekSelector;
WEEKSELECTOR

# 6. Sidebar
cat > src/components/layout/Sidebar.jsx << 'SIDEBAR'
import React from 'react';
import { Home, ClipboardCheck, Users, TrendingUp, BarChart3 } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'audit', label: 'Audit 5S', icon: ClipboardCheck },
    { id: 'gemba', label: 'Gemba OJT', icon: Users },
    { id: 'resultats', label: 'Résultats 5S', icon: BarChart3 },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <span>Amélioration</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">CI Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}>
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {activePage === item.id && <span className="ml-auto w-1.5 h-8 bg-white rounded-full" />}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">Version 2.0<br />Semaine {new Date().getWeek()}</p>
      </div>
    </div>
  );
};

Date.prototype.getWeek = function() {
  const d = new Date(this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default Sidebar;
SIDEBAR

# 7. Graphiques
echo "📊 Création des graphiques..."

cat > src/components/charts/StackedBarChart3D.jsx << 'STACKEDBAR'
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
STACKEDBAR

# 8. ResultatsChart
cat > src/components/charts/ResultatsChart.jsx << 'RESULTATSCHART'
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
RESULTATSCHART

# 9. ResultatsForm
cat > src/components/ResultatsForm.jsx << 'RESULTATFORM'
import React, { useState } from 'react';
import { Plus, Trash2, Save, Edit2 } from 'lucide-react';

const LIGNES_PAR_UAP = {
  'UAP1': ['Mur Qualité', 'L77', 'L76', 'F01', 'F02', 'F99', 'F85', 'F86', 'F83'],
  'UAP2': ['L84', 'F87 (BR463)', 'L107', 'F79', 'F27', 'F73 (U channel)', 'L101', 'L108', '550T', '125T', '520T', 'F06', 'RJI', '80T', '120T', 'A12/ Boy 2/ Boy 3', 'PF1/ PF2 (finition)', 'F87 (PR)', 'F15', 'F55 (PR)', '400T', 'F31'],
  'Logistique': ['Magasin P1', 'Magasin Genarale', 'Magasin P2']
};

const generateWeeks = () => { const weeks = []; for (let i = 1; i <= 52; i++) weeks.push(`S${i}`); return weeks; };

const ResultatsForm = ({ data, onDataChange, currentWeek }) => {
  const [newEntry, setNewEntry] = useState({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const uapOptions = ['UAP1', 'UAP2', 'Logistique'];
  const weekOptions = generateWeeks();
  const getLignesForUAP = (uap) => LIGNES_PAR_UAP[uap] || [];

  const handleAdd = () => {
    const errors = {};
    if (!newEntry.ligne) errors.ligne = 'Ligne requise';
    if (!newEntry.semaine) errors.semaine = 'Semaine requise';
    if (!newEntry.resultat) errors.resultat = 'Résultat requis';
    if (Object.keys(errors).length > 0) { setErrors(errors); return; }

    const resultat = parseFloat(newEntry.resultat);
    if (isNaN(resultat) || resultat < 0 || resultat > 100) { errors.resultat = 'Entre 0 et 100'; setErrors(errors); return; }

    const weekKey = newEntry.semaine;
    const existingIndex = data.findIndex(item => item.uap === newEntry.uap && item.ligne === newEntry.ligne);
    let newData;
    if (existingIndex !== -1) {
      newData = [...data];
      newData[existingIndex] = { ...newData[existingIndex], semaines: { ...newData[existingIndex].semaines, [weekKey]: resultat } };
    } else {
      newData = [...data, { uap: newEntry.uap, ligne: newEntry.ligne, semaines: { [weekKey]: resultat } }];
    }
    onDataChange(newData);
    setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
    setErrors({});
  };

  const handleDelete = (index) => { onDataChange(data.filter((_, i) => i !== index)); };

  const handleEdit = (index) => {
    const entry = data[index];
    setNewEntry({ uap: entry.uap, ligne: entry.ligne, semaine: `S${currentWeek}`, resultat: entry.semaines[`S${currentWeek}`]?.toString() || '' });
    setEditingIndex(index);
  };

  const handleUpdate = () => {
    if (editingIndex === null) return;
    const errors = {};
    if (!newEntry.ligne) errors.ligne = 'Ligne requise';
    if (!newEntry.resultat) errors.resultat = 'Résultat requis';
    if (Object.keys(errors).length > 0) { setErrors(errors); return; }

    const resultat = parseFloat(newEntry.resultat);
    if (isNaN(resultat) || resultat < 0 || resultat > 100) { errors.resultat = 'Entre 0 et 100'; setErrors(errors); return; }

    const weekKey = `S${currentWeek}`;
    const newData = [...data];
    newData[editingIndex] = { ...newData[editingIndex], semaines: { ...newData[editingIndex].semaines, [weekKey]: resultat } };
    onDataChange(newData);
    setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
    setEditingIndex(null);
    setErrors({});
  };

  const handleCancel = () => { setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' }); setEditingIndex(null); setErrors({}); };

  const lignesDisponibles = getLignesForUAP(newEntry.uap);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {editingIndex !== null ? '✏️ Modifier' : '➕ Ajouter un résultat'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={newEntry.uap} onChange={(e) => setNewEntry({ ...newEntry, uap: e.target.value, ligne: '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            {uapOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select value={newEntry.ligne} onChange={(e) => setNewEntry({ ...newEntry, ligne: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.ligne ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            {lignesDisponibles.map(ligne => <option key={ligne} value={ligne}>{ligne}</option>)}
          </select>
          <select value={newEntry.semaine} onChange={(e) => setNewEntry({ ...newEntry, semaine: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.semaine ? 'border-red-500' : 'border-gray-300'}`}>
            {weekOptions.map(week => <option key={week} value={week}>{week} {week === `S${currentWeek}` ? '📌' : ''}</option>)}
          </select>
          <input type="number" placeholder="Résultat (%)" value={newEntry.resultat} onChange={(e) => setNewEntry({ ...newEntry, resultat: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.resultat ? 'border-red-500' : 'border-gray-300'}`} min="0" max="100" />
          <div className="flex gap-2">
            {editingIndex !== null ? (
              <>
                <button onClick={handleUpdate} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1">
                  <Save className="w-4 h-4" /> Sauvegarder
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">Annuler</button>
              </>
            ) : (
              <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
        </div>
      </div>
      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UAP</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ligne</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Semaine</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Résultat</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => {
                const semaines = Object.keys(item.semaines).filter(s => item.semaines[s] !== undefined && item.semaines[s] !== null);
                return semaines.map((semaine, subIndex) => {
                  const value = item.semaines[semaine];
                  return (
                    <tr key={`${index}-${subIndex}`} className="hover:bg-gray-50">
                      {subIndex === 0 && <td rowSpan={semaines.length} className="px-4 py-3 text-sm font-medium text-gray-900 border-r">{item.uap}</td>}
                      {subIndex === 0 && <td rowSpan={semaines.length} className="px-4 py-3 text-sm text-gray-600 border-r">{item.ligne}</td>}
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{semaine}</td>
                      <td className="px-4 py-3 text-center"><span className={`font-semibold ${value >= 85 ? 'text-green-600' : value >= 70 ? 'text-orange-600' : 'text-red-600'}`}>{value}%</span></td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setNewEntry({ uap: item.uap, ligne: item.ligne, semaine: semaine, resultat: value.toString() }); setEditingIndex(index); }} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { const newData = [...data]; const newSemaines = { ...newData[index].semaines }; delete newSemaines[semaine]; if (Object.keys(newSemaines).length === 0) newData.splice(index, 1); else newData[index].semaines = newSemaines; onDataChange(newData); }} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}
      {data.length === 0 && <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300"><p className="text-gray-500">Aucun résultat</p></div>}
    </div>
  );
};

export default ResultatsForm;
RESULTATFORM

# 10. Pages
echo "📄 Création des pages..."

cat > src/pages/Home.jsx << 'HOME'
import React from 'react';
import WeekSelector from '../components/common/WeekSelector';
import { Download, TrendingUp, Users, ClipboardCheck, Lightbulb } from 'lucide-react';

const Home = ({ currentWeek, onWeekChange }) => {
  const committeeData = {
    date: new Date(2026, 0, 1 + (currentWeek - 1) * 7).toLocaleDateString('fr-FR'),
    metrics: { totalAudits: 12, complianceRate: 87, actionsCompleted: 45, openActions: 8 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">🏠 Accueil</h1><p className="text-sm text-gray-500">Tableau de bord CI - Semaine {currentWeek}</p></div>
        <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div><h2 className="text-xl font-bold text-gray-800">📊 PPT CI Committee - W{currentWeek}</h2><p className="text-sm text-gray-500 mt-1">Review du {committeeData.date}</p></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"><Download className="w-4 h-4" /> Exporter PDF</button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg"><div className="flex items-center gap-2 text-blue-600"><ClipboardCheck className="w-5 h-5" /><span className="text-sm font-medium">Audits</span></div><p className="text-2xl font-bold mt-1">{committeeData.metrics.totalAudits}</p></div>
            <div className="bg-green-50 p-4 rounded-lg"><div className="flex items-center gap-2 text-green-600"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium">Conformité</span></div><p className="text-2xl font-bold mt-1">{committeeData.metrics.complianceRate}%</p></div>
            <div className="bg-purple-50 p-4 rounded-lg"><div className="flex items-center gap-2 text-purple-600"><Users className="w-5 h-5" /><span className="text-sm font-medium">Actions</span></div><p className="text-2xl font-bold mt-1">{committeeData.metrics.actionsCompleted}</p></div>
            <div className="bg-orange-50 p-4 rounded-lg"><div className="flex items-center gap-2 text-orange-600"><Lightbulb className="w-5 h-5" /><span className="text-sm font-medium">Propositions</span></div><p className="text-2xl font-bold mt-1">{committeeData.metrics.openActions}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
HOME

cat > src/pages/Audit5S.jsx << 'AUDIT'
import React, { useState } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import StackedBarChart3D from '../components/charts/StackedBarChart3D';
import { TrendingUp, AlertCircle, CheckCircle, Database } from 'lucide-react';

const Audit5S = ({ currentWeek, onWeekChange }) => {
  const [auditData] = useState([
    { semaine: 'S1', planifie: 5, realise: 5, taux_realisation: 100 },
    { semaine: 'S2', planifie: 5, realise: 5, taux_realisation: 100 },
    { semaine: 'S3', planifie: 5, realise: 5, taux_realisation: 100 },
    { semaine: 'S4', planifie: 5, realise: 3, taux_realisation: 60 },
    { semaine: 'S5', planifie: 5, realise: 5, taux_realisation: 100 },
    { semaine: 'S6', planifie: 5, realise: 4, taux_realisation: 80 },
  ]);

  const stats = { totalPlanned: 30, totalActual: 27, avgRate: 90, totalWeeks: 6, completedWeeks: 5 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">🏭 Audit 5S</h1><p className="text-sm text-gray-500">Suivi des audits 5S</p></div>
        <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-blue-600"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Semaines</span></div><p className="text-2xl font-bold mt-1">{stats.totalWeeks}</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-green-600"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium">Conformité</span></div><p className="text-2xl font-bold mt-1">{stats.avgRate}%</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-orange-600"><Database className="w-5 h-5" /><span className="text-sm font-medium">Total Planifié</span></div><p className="text-2xl font-bold mt-1">{stats.totalPlanned}</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-purple-600"><AlertCircle className="w-5 h-5" /><span className="text-sm font-medium">Total Réalisé</span></div><p className="text-2xl font-bold mt-1">{stats.totalActual}</p></div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Évolution des audits 5S</h2>
        <StackedBarChart3D data={auditData} xKey="semaine" />
      </div>
    </div>
  );
};

export default Audit5S;
AUDIT

cat > src/pages/GembaOJT.jsx << 'GEMBA'
import React, { useState } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import StackedBarChart3D from '../components/charts/StackedBarChart3D';
import { TrendingUp, AlertCircle, CheckCircle, Users } from 'lucide-react';

const GembaOJT = ({ currentWeek, onWeekChange }) => {
  const [gembaData] = useState([
    { semaine: 'S1', planifie: 10, realise: 8, taux_realisation: 80 },
    { semaine: 'S2', planifie: 8, realise: 7, taux_realisation: 87 },
    { semaine: 'S3', planifie: 12, realise: 10, taux_realisation: 83 },
    { semaine: 'S4', planifie: 6, realise: 4, taux_realisation: 67 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">👥 Gemba OJT</h1><p className="text-sm text-gray-500">Suivi des formations</p></div>
        <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-blue-600"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Semaines</span></div><p className="text-2xl font-bold mt-1">4</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-green-600"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium">Conformité</span></div><p className="text-2xl font-bold mt-1">79%</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-orange-600"><Users className="w-5 h-5" /><span className="text-sm font-medium">Total Planifié</span></div><p className="text-2xl font-bold mt-1">36</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-purple-600"><AlertCircle className="w-5 h-5" /><span className="text-sm font-medium">Total Réalisé</span></div><p className="text-2xl font-bold mt-1">29</p></div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Évolution Gemba OJT</h2>
        <StackedBarChart3D data={gembaData} xKey="semaine" />
      </div>
    </div>
  );
};

export default GembaOJT;
GEMBA

cat > src/pages/Resultats5S.jsx << 'RESULTATS'
import React, { useState } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import ResultatsForm from '../components/ResultatsForm';
import ResultatsChart from '../components/charts/ResultatsChart';
import { TrendingUp, CheckCircle, Building2, BarChart3, Filter } from 'lucide-react';

const Resultats5S = ({ currentWeek, onWeekChange }) => {
  const [resultatsData, setResultatsData] = useState([
    { uap: 'UAP1', ligne: 'Mur Qualité', semaines: { S5: 85, S7: 85, S9: 88 } },
    { uap: 'UAP1', ligne: 'L77', semaines: { S4: 85, S7: 85, S10: 73 } },
    { uap: 'UAP2', ligne: 'L84', semaines: { S1: 77, S3: 77, S5: 85 } },
    { uap: 'Logistique', ligne: 'Magasin Genarale', semaines: { S1: 92, S3: 92, S5: 92 } },
  ]);
  const [uapFilter, setUapFilter] = useState('all');

  const weekKey = `S${currentWeek}`;
  const uapGroups = resultatsData.reduce((acc, item) => {
    if (!acc[item.uap]) acc[item.uap] = [];
    acc[item.uap].push(item);
    return acc;
  }, {});

  const calculateUAPAverage = (items) => {
    const values = items.map(item => item.semaines && item.semaines[weekKey]).filter(v => v !== undefined && !isNaN(v) && v > 0);
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">📊 Résultats 5S</h1><p className="text-sm text-gray-500">Par UAP et Ligne</p></div>
        <WeekSelector currentWeek={currentWeek} onWeekChange={onWeekChange} label="Semaine" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-blue-600"><Building2 className="w-5 h-5" /><span className="text-sm font-medium">UAP</span></div><p className="text-2xl font-bold mt-1">{Object.keys(uapGroups).length}</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-green-600"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Lignes</span></div><p className="text-2xl font-bold mt-1">{resultatsData.length}</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-orange-600"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium">Moyenne UAP1</span></div><p className="text-2xl font-bold mt-1">{calculateUAPAverage(uapGroups['UAP1'] || []) || '-'}%</p></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><div className="flex items-center gap-2 text-purple-600"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium">Moyenne UAP2</span></div><p className="text-2xl font-bold mt-1">{calculateUAPAverage(uapGroups['UAP2'] || []) || '-'}%</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Saisie des résultats</h3>
        <ResultatsForm data={resultatsData} onDataChange={setResultatsData} currentWeek={currentWeek} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Histogramme - Semaine {currentWeek}</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={uapFilter} onChange={(e) => setUapFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="all">Tous</option>
              <option value="UAP1">UAP1</option>
              <option value="UAP2">UAP2</option>
              <option value="Logistique">Logistique</option>
            </select>
          </div>
        </div>
        <ResultatsChart data={resultatsData} currentWeek={currentWeek} uapFilter={uapFilter} />
      </div>
    </div>
  );
};

export default Resultats5S;
RESULTATS

# 11. App.jsx
echo "📱 Création de App.jsx..."
cat > src/App.jsx << 'APP'
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Audit5S from './pages/Audit5S';
import GembaOJT from './pages/GembaOJT';
import Resultats5S from './pages/Resultats5S';
import './index.css';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentWeek, setCurrentWeek] = useState(35);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'audit': return <Audit5S currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'gemba': return <GembaOJT currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'resultats': return <Resultats5S currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      default: return <Home currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-6">{renderPage()}</main>
    </div>
  );
}

export default App;
APP

# 12. Fichiers CSS
echo "🎨 Création des fichiers CSS..."
cat > src/index.css << 'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
CSS

cat > src/App.css << 'CSS'
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; }
CSS

# 13. main.jsx
echo "📄 Création de main.jsx..."
cat > src/main.jsx << 'MAIN'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
MAIN

# 14. Tailwind config
echo "⚙️ Configuration Tailwind..."
cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
TAILWIND

cat > postcss.config.js << 'POSTCSS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS

# 15. index.html
echo "📄 Création de index.html..."
cat > index.html << 'INDEX'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CI Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
INDEX

# 16. Firestore Rules
echo "🔒 Création des règles Firestore..."
cat > firestore.rules << 'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audit5S/{documentId} {
      allow read: if true;
      allow write: if true;
      allow write: if request.resource.data.keys().hasAll(['semaine', 'planifie', 'realise', 'taux_realisation']) &&
        request.resource.data.semaine is string &&
        request.resource.data.planifie is number &&
        request.resource.data.realise is number &&
        request.resource.data.taux_realisation is number;
    }
    match /gembaOJT/{documentId} {
      allow read: if true;
      allow write: if true;
      allow write: if request.resource.data.keys().hasAll(['semaine', 'planifie', 'realise', 'taux_realisation']) &&
        request.resource.data.semaine is string &&
        request.resource.data.planifie is number &&
        request.resource.data.realise is number &&
        request.resource.data.taux_realisation is number;
    }
    match /resultats5S/{documentId} {
      allow read: if true;
      allow write: if true;
      allow write: if request.resource.data.keys().hasAll(['uap', 'ligne', 'semaines']) &&
        request.resource.data.uap is string &&
        request.resource.data.ligne is string &&
        request.resource.data.semaines is map;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
RULES

echo "========================================="
echo "✅ Installation terminée !"
echo "========================================="
echo ""
echo "🚀 Pour lancer l'application :"
echo "   npm run dev"
echo ""
echo "📊 Pages disponibles :"
echo "   - Accueil (Home)"
echo "   - Audit 5S"
echo "   - Gemba OJT"
echo "   - Résultats 5S"
echo ""
echo "🔥 Firebase configuré avec :"
echo "   - Collection: audit5S"
echo "   - Collection: gembaOJT"
echo "   - Collection: resultats5S"
echo "========================================="
