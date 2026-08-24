import React, { useState, useEffect } from 'react';
import WeekSelector from '../components/common/WeekSelector';
import { TrendingUp, CheckCircle, AlertCircle, Database, Plus, Trash2, Save, Edit2, Building2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

const Action5S = ({ currentWeek, onWeekChange }) => {
  const [actionsData, setActionsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newEntry, setNewEntry] = useState({
    uap: 'UAP1',
    planifie: '',
    realise: ''
  });

  const uapOptions = ['UAP1', 'UAP2', 'Logistique'];

  // Charger les données depuis Firebase
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'actions5S'), orderBy('semaine', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setActionsData(data);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur de chargement des données');
      // Données d'exemple
      setActionsData([
        { id: '1', semaine: 'S1', uap: 'UAP1', planifie: 5, realise: 4, taux_realisation: 80 },
        { id: '2', semaine: 'S1', uap: 'UAP2', planifie: 3, realise: 2, taux_realisation: 67 },
        { id: '3', semaine: 'S2', uap: 'UAP1', planifie: 4, realise: 4, taux_realisation: 100 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ajouter une nouvelle ligne
  const handleAdd = async () => {
    const errors = {};
    if (!newEntry.uap) errors.uap = 'UAP requis';
    if (!newEntry.planifie) errors.planifie = 'Planifié requis';
    if (!newEntry.realise) errors.realise = 'Réalisé requis';
    
    if (Object.keys(errors).length > 0) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const planifie = parseInt(newEntry.planifie);
    const realise = parseInt(newEntry.realise);
    const taux = planifie > 0 ? Math.round((realise / planifie) * 100) : 0;

    const newData = {
      semaine: `S${currentWeek}`,
      uap: newEntry.uap,
      planifie: planifie,
      realise: realise,
      taux_realisation: taux,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'actions5S'), newData);
      setActionsData([...actionsData, { id: docRef.id, ...newData }]);
      setNewEntry({ uap: 'UAP1', planifie: '', realise: '' });
      setError(null);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une ligne
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette ligne ?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'actions5S', id));
      setActionsData(actionsData.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Modifier une ligne
  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewEntry({
      uap: item.uap,
      planifie: item.planifie.toString(),
      realise: item.realise.toString()
    });
  };

  // Sauvegarder la modification
  const handleUpdate = async () => {
    if (!editingId) return;

    const errors = {};
    if (!newEntry.uap) errors.uap = 'UAP requis';
    if (!newEntry.planifie) errors.planifie = 'Planifié requis';
    if (!newEntry.realise) errors.realise = 'Réalisé requis';
    
    if (Object.keys(errors).length > 0) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const planifie = parseInt(newEntry.planifie);
    const realise = parseInt(newEntry.realise);
    const taux = planifie > 0 ? Math.round((realise / planifie) * 100) : 0;

    const updatedData = {
      uap: newEntry.uap,
      planifie: planifie,
      realise: realise,
      taux_realisation: taux,
      updatedAt: Timestamp.now()
    };

    setLoading(true);
    try {
      await updateDoc(doc(db, 'actions5S', editingId), updatedData);
      setActionsData(actionsData.map(item => 
        item.id === editingId ? { ...item, ...updatedData } : item
      ));
      setNewEntry({ uap: 'UAP1', planifie: '', realise: '' });
      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewEntry({ uap: 'UAP1', planifie: '', realise: '' });
    setEditingId(null);
    setError(null);
  };

  // Calculer les statistiques par UAP
  const getStatsByUAP = (uap) => {
    const items = actionsData.filter(item => item.uap === uap);
    const totalPlanifie = items.reduce((sum, item) => sum + (item.planifie || 0), 0);
    const totalRealise = items.reduce((sum, item) => sum + (item.realise || 0), 0);
    const taux = totalPlanifie > 0 ? Math.round((totalRealise / totalPlanifie) * 100) : 0;
    return { totalPlanifie, totalRealise, taux, count: items.length };
  };

  const statsUAP1 = getStatsByUAP('UAP1');
  const statsUAP2 = getStatsByUAP('UAP2');
  const statsLogistique = getStatsByUAP('Logistique');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">✅ Action 5S</h1>
          <p className="text-sm text-gray-500">Suivi des actions 5S par UAP</p>
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

      {/* Statistiques par UAP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-blue-600">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">UAP1</span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Planifié</span>
              <span className="font-semibold">{statsUAP1.totalPlanifie}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Réalisé</span>
              <span className="font-semibold text-green-600">{statsUAP1.totalRealise}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-500">Taux</span>
              <span className={`font-bold ${statsUAP1.taux >= 80 ? 'text-green-600' : statsUAP1.taux >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                {statsUAP1.taux}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-green-600">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">UAP2</span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Planifié</span>
              <span className="font-semibold">{statsUAP2.totalPlanifie}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Réalisé</span>
              <span className="font-semibold text-green-600">{statsUAP2.totalRealise}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-500">Taux</span>
              <span className={`font-bold ${statsUAP2.taux >= 80 ? 'text-green-600' : statsUAP2.taux >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                {statsUAP2.taux}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-orange-600">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Logistique</span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Planifié</span>
              <span className="font-semibold">{statsLogistique.totalPlanifie}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Réalisé</span>
              <span className="font-semibold text-green-600">{statsLogistique.totalRealise}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-500">Taux</span>
              <span className={`font-bold ${statsLogistique.taux >= 80 ? 'text-green-600' : statsLogistique.taux >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                {statsLogistique.taux}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {editingId ? '✏️ Modifier une action' : '➕ Ajouter une action'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <select
              value={newEntry.uap}
              onChange={(e) => setNewEntry({ ...newEntry, uap: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
            >
              {uapOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder="Planifié"
              value={newEntry.planifie}
              onChange={(e) => setNewEntry({ ...newEntry, planifie: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
              min="0"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Réalisé"
              value={newEntry.realise}
              onChange={(e) => setNewEntry({ ...newEntry, realise: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
              min="0"
            />
          </div>
          <div className="flex gap-2">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Sauvegarder
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>

      {/* Tableau des actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">📋 Liste des actions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semaine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UAP</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Planifié</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Réalisé</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {actionsData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Aucune action saisie
                  </td>
                </tr>
              ) : (
                actionsData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.semaine || 'S1'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.uap}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.planifie}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.realise}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`font-semibold ${
                        item.taux_realisation >= 80 ? 'text-green-600' :
                        item.taux_realisation >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {item.taux_realisation}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Planifié</p>
          <p className="text-2xl font-bold text-blue-600">
            {actionsData.reduce((sum, item) => sum + (item.planifie || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Réalisé</p>
          <p className="text-2xl font-bold text-green-600">
            {actionsData.reduce((sum, item) => sum + (item.realise || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Taux Global</p>
          <p className="text-2xl font-bold text-purple-600">
            {actionsData.length > 0 ? 
              Math.round(actionsData.reduce((sum, item) => sum + (item.taux_realisation || 0), 0) / actionsData.length) 
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Action5S;
