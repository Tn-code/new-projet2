import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { 
  saveAuditData, 
  getAllAuditData, 
  updateAuditData, 
  deleteAuditData 
} from '../services/firebaseService';

const DataForm = ({ data, onDataChange }) => {
  const [newEntry, setNewEntry] = useState({
    semaine: '',
    planifie: '',
    realise: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('saved');

  // Ajouter une nouvelle ligne
  const handleAdd = async () => {
    const errors = {};
    if (!newEntry.semaine) errors.semaine = 'Semaine requise';
    if (!newEntry.planifie) errors.planifie = 'Planifié requis';
    if (!newEntry.realise) errors.realise = 'Réalisé requis';
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const planifie = parseFloat(newEntry.planifie);
    const realise = parseFloat(newEntry.realise);
    const taux = planifie > 0 ? Math.round((realise / planifie) * 100) : 0;

    const newData = {
      semaine: newEntry.semaine,
      planifie: planifie,
      realise: realise,
      taux_realisation: taux
    };

    setLoading(true);
    setSyncStatus('saving');
    try {
      const savedData = await saveAuditData(newData);
      const newDataWithId = { ...newData, id: savedData.id };
      const updatedData = [...data, newDataWithId];
      onDataChange(updatedData);
      setNewEntry({ semaine: '', planifie: '', realise: '' });
      setErrors({});
      setSyncStatus('saved');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une ligne
  const handleDelete = async (index) => {
    const itemToDelete = data[index];
    if (!itemToDelete.id) {
      const newData = data.filter((_, i) => i !== index);
      onDataChange(newData);
      return;
    }

    setLoading(true);
    setSyncStatus('saving');
    try {
      await deleteAuditData(itemToDelete.id);
      const newData = data.filter((_, i) => i !== index);
      onDataChange(newData);
      setSyncStatus('saved');
    } catch (error) {
      console.error('Erreur suppression:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Modifier une ligne
  const handleEdit = (index) => {
    const entry = data[index];
    setNewEntry({
      semaine: entry.semaine,
      planifie: entry.planifie.toString(),
      realise: entry.realise.toString()
    });
    setEditingIndex(index);
    setEditingId(entry.id || null);
  };

  // Sauvegarder la modification
  const handleUpdate = async () => {
    if (editingIndex === null) return;

    const errors = {};
    if (!newEntry.semaine) errors.semaine = 'Semaine requise';
    if (!newEntry.planifie) errors.planifie = 'Planifié requis';
    if (!newEntry.realise) errors.realise = 'Réalisé requis';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const planifie = parseFloat(newEntry.planifie);
    const realise = parseFloat(newEntry.realise);
    const taux = planifie > 0 ? Math.round((realise / planifie) * 100) : 0;

    const updatedData = {
      semaine: newEntry.semaine,
      planifie: planifie,
      realise: realise,
      taux_realisation: taux
    };

    setLoading(true);
    setSyncStatus('saving');
    try {
      if (editingId) {
        await updateAuditData(editingId, updatedData);
        const newData = [...data];
        newData[editingIndex] = { ...updatedData, id: editingId };
        onDataChange(newData);
      } else {
        const savedData = await saveAuditData(updatedData);
        const newData = [...data];
        newData[editingIndex] = { ...updatedData, id: savedData.id };
        onDataChange(newData);
      }
      setNewEntry({ semaine: '', planifie: '', realise: '' });
      setEditingIndex(null);
      setEditingId(null);
      setErrors({});
      setSyncStatus('saved');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Annuler la modification
  const handleCancel = () => {
    setNewEntry({ semaine: '', planifie: '', realise: '' });
    setEditingIndex(null);
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="space-y-4">
      {/* Barre d'état de synchronisation */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          {syncStatus === 'saved' && (
            <>
              <Cloud className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">✅ Synchronisé</span>
            </>
          )}
          {syncStatus === 'saving' && (
            <>
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-600">⏳ Sauvegarde...</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <CloudOff className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">❌ Erreur de synchronisation</span>
            </>
          )}
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {editingIndex !== null ? '✏️ Modifier la semaine' : '➕ Ajouter une semaine'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <input
              type="text"
              placeholder="Ex: S1, S2, ..."
              value={newEntry.semaine}
              onChange={(e) => setNewEntry({ ...newEntry, semaine: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.semaine ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.semaine && <p className="text-xs text-red-500 mt-1">{errors.semaine}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Planifié (sur 5)"
              value={newEntry.planifie}
              onChange={(e) => setNewEntry({ ...newEntry, planifie: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.planifie ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.planifie && <p className="text-xs text-red-500 mt-1">{errors.planifie}</p>}
          </div>
          <div>
            <input
              type="number"
              placeholder="Réalisé (sur 5)"
              value={newEntry.realise}
              onChange={(e) => setNewEntry({ ...newEntry, realise: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.realise ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.realise && <p className="text-xs text-red-500 mt-1">{errors.realise}</p>}
          </div>
          <div className="flex gap-2">
            {editingIndex !== null ? (
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
      </div>

      {/* Tableau des données */}
      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semaine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planifié</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réalisé</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taux</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.semaine}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.planifie}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.realise}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${
                      item.taux_realisation >= 80 ? 'text-green-600' :
                      item.taux_realisation >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {item.taux_realisation}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer la semaine ${item.semaine} ?`)) {
                            handleDelete(index);
                          }
                        }}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Aucune donnée Audit 5S</p>
          <p className="text-sm text-gray-400">Ajoutez vos semaines ci-dessus</p>
        </div>
      )}
    </div>
  );
};

export default DataForm;
