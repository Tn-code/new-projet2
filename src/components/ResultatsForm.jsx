import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { 
  saveResultatsData, 
  getAllResultatsData, 
  updateResultatsData, 
  deleteResultatsData 
} from '../services/firebaseResultatsService';

// Liste complète des lignes par UAP
const LIGNES_PAR_UAP = {
  'UAP1': [
    'Mur Qualité', 'L77', 'L76', 'F01', 'F02', 'F99', 'F85', 'F86', 'F83'
  ],
  'UAP2': [
    'L84', 'F87 (BR463)', 'L107', 'F79', 'F27', 'F73 (U channel)', 'L101', 'L108',
    '550T', '125T', '520T', 'F06', 'RJI', '80T', '120T', 'A12/ Boy 2/ Boy 3',
    'PF1/ PF2 (finition)', 'F87 (PR)', 'F15', 'F55 (PR)', '400T', 'F31'
  ],
  'Logistique': [
    'Magasin P1', 'Magasin Genarale', 'Magasin P2'
  ]
};

// Générer les semaines de S1 à S52
const generateWeeks = () => {
  const weeks = [];
  for (let i = 1; i <= 52; i++) {
    weeks.push(`S${i}`);
  }
  return weeks;
};

const ResultatsForm = ({ data, onDataChange, currentWeek }) => {
  const [newEntry, setNewEntry] = useState({
    uap: 'UAP1',
    ligne: '',
    semaine: `S${currentWeek}`,
    resultat: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('saved');

  const uapOptions = ['UAP1', 'UAP2', 'Logistique'];
  const weekOptions = generateWeeks();

  const getLignesForUAP = (uap) => {
    return LIGNES_PAR_UAP[uap] || [];
  };

  // Ajouter une nouvelle ligne
  const handleAdd = async () => {
    const errors = {};
    if (!newEntry.ligne) errors.ligne = 'Ligne requise';
    if (!newEntry.semaine) errors.semaine = 'Semaine requise';
    if (!newEntry.resultat) errors.resultat = 'Résultat requis';
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const resultat = parseFloat(newEntry.resultat);
    if (isNaN(resultat) || resultat < 0 || resultat > 100) {
      errors.resultat = 'Résultat doit être entre 0 et 100';
      setErrors(errors);
      return;
    }

    const weekKey = newEntry.semaine;
    
    // Chercher si la ligne existe déjà
    const existingIndex = data.findIndex(
      item => item.uap === newEntry.uap && item.ligne === newEntry.ligne
    );

    let newData;
    if (existingIndex !== -1) {
      // Mettre à jour la ligne existante
      newData = [...data];
      newData[existingIndex] = {
        ...newData[existingIndex],
        semaines: {
          ...newData[existingIndex].semaines,
          [weekKey]: resultat
        }
      };
    } else {
      // Ajouter une nouvelle ligne
      newData = [...data, {
        uap: newEntry.uap,
        ligne: newEntry.ligne,
        semaines: { [weekKey]: resultat }
      }];
    }

    setLoading(true);
    setSyncStatus('saving');
    try {
      // Sauvegarder dans Firebase
      const savedData = await saveResultatsData({
        uap: newEntry.uap,
        ligne: newEntry.ligne,
        semaines: { [weekKey]: resultat }
      });
      
      // Mettre à jour avec l'ID Firebase
      const newDataWithId = newData.map(item => {
        if (item.uap === newEntry.uap && item.ligne === newEntry.ligne) {
          return { ...item, id: savedData.id };
        }
        return item;
      });
      
      onDataChange(newDataWithId);
      setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
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
      await deleteResultatsData(itemToDelete.id);
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
      uap: entry.uap,
      ligne: entry.ligne,
      semaine: `S${currentWeek}`,
      resultat: entry.semaines[`S${currentWeek}`]?.toString() || ''
    });
    setEditingIndex(index);
    setEditingId(entry.id || null);
  };

  // Sauvegarder la modification
  const handleUpdate = async () => {
    if (editingIndex === null) return;

    const errors = {};
    if (!newEntry.ligne) errors.ligne = 'Ligne requise';
    if (!newEntry.semaine) errors.semaine = 'Semaine requise';
    if (!newEntry.resultat) errors.resultat = 'Résultat requis';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const resultat = parseFloat(newEntry.resultat);
    if (isNaN(resultat) || resultat < 0 || resultat > 100) {
      errors.resultat = 'Résultat doit être entre 0 et 100';
      setErrors(errors);
      return;
    }

    const weekKey = newEntry.semaine;
    const newData = [...data];
    newData[editingIndex] = {
      ...newData[editingIndex],
      semaines: {
        ...newData[editingIndex].semaines,
        [weekKey]: resultat
      }
    };

    setLoading(true);
    setSyncStatus('saving');
    try {
      if (editingId) {
        // Mettre à jour dans Firebase
        await updateResultatsData(editingId, {
          uap: newEntry.uap,
          ligne: newEntry.ligne,
          semaines: newData[editingIndex].semaines
        });
        onDataChange(newData);
      } else {
        // Créer un nouveau document
        const savedData = await saveResultatsData({
          uap: newEntry.uap,
          ligne: newEntry.ligne,
          semaines: newData[editingIndex].semaines
        });
        newData[editingIndex] = { ...newData[editingIndex], id: savedData.id };
        onDataChange(newData);
      }
      
      setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
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
    setNewEntry({ uap: 'UAP1', ligne: '', semaine: `S${currentWeek}`, resultat: '' });
    setEditingIndex(null);
    setEditingId(null);
    setErrors({});
  };

  const lignesDisponibles = getLignesForUAP(newEntry.uap);

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
          {editingIndex !== null ? '✏️ Modifier le résultat' : '➕ Ajouter un résultat 5S'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* UAP */}
          <div>
            <select
              value={newEntry.uap}
              onChange={(e) => {
                setNewEntry({ ...newEntry, uap: e.target.value, ligne: '' });
                setErrors({});
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
            >
              {uapOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          {/* Ligne */}
          <div>
            <select
              value={newEntry.ligne}
              onChange={(e) => setNewEntry({ ...newEntry, ligne: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.ligne ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Sélectionner une ligne</option>
              {lignesDisponibles.map(ligne => (
                <option key={ligne} value={ligne}>{ligne}</option>
              ))}
            </select>
            {errors.ligne && <p className="text-xs text-red-500 mt-1">{errors.ligne}</p>}
          </div>
          
          {/* Semaine */}
          <div>
            <select
              value={newEntry.semaine}
              onChange={(e) => setNewEntry({ ...newEntry, semaine: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.semaine ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              {weekOptions.map(week => (
                <option key={week} value={week}>
                  {week} {week === `S${currentWeek}` ? '📌' : ''}
                </option>
              ))}
            </select>
            {errors.semaine && <p className="text-xs text-red-500 mt-1">{errors.semaine}</p>}
          </div>
          
          {/* Résultat */}
          <div>
            <input
              type="number"
              placeholder="Résultat (%)"
              value={newEntry.resultat}
              onChange={(e) => setNewEntry({ ...newEntry, resultat: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.resultat ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              max="100"
              disabled={loading}
            />
            {errors.resultat && <p className="text-xs text-red-500 mt-1">{errors.resultat}</p>}
          </div>
          
          {/* Actions */}
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

      {/* Tableau des résultats */}
      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UAP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ligne</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Semaine</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Résultat</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => {
                const semaines = Object.keys(item.semaines).filter(
                  s => item.semaines[s] !== undefined && item.semaines[s] !== null
                );
                
                return semaines.map((semaine, subIndex) => {
                  const value = item.semaines[semaine];
                  return (
                    <tr key={`${index}-${subIndex}`} className="hover:bg-gray-50">
                      {subIndex === 0 && (
                        <td rowSpan={semaines.length} className="px-4 py-3 text-sm font-medium text-gray-900 border-r">
                          {item.uap}
                        </td>
                      )}
                      {subIndex === 0 && (
                        <td rowSpan={semaines.length} className="px-4 py-3 text-sm text-gray-600 border-r">
                          {item.ligne}
                        </td>
                      )}
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{semaine}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${
                          value >= 85 ? 'text-green-600' :
                          value >= 70 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {value}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setNewEntry({
                                uap: item.uap,
                                ligne: item.ligne,
                                semaine: semaine,
                                resultat: value.toString()
                              });
                              setEditingIndex(index);
                              setEditingId(item.id || null);
                            }}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer ${semaine} de ${item.ligne} ?`)) {
                                const newData = [...data];
                                const newSemaines = { ...newData[index].semaines };
                                delete newSemaines[semaine];
                                if (Object.keys(newSemaines).length === 0) {
                                  // Supprimer la ligne entière
                                  if (item.id) {
                                    deleteResultatsData(item.id).then(() => {
                                      newData.splice(index, 1);
                                      onDataChange(newData);
                                    }).catch(console.error);
                                  } else {
                                    newData.splice(index, 1);
                                    onDataChange(newData);
                                  }
                                } else {
                                  // Mettre à jour avec Firebase
                                  if (item.id) {
                                    updateResultatsData(item.id, {
                                      uap: item.uap,
                                      ligne: item.ligne,
                                      semaines: newSemaines
                                    }).then(() => {
                                      newData[index].semaines = newSemaines;
                                      onDataChange(newData);
                                    }).catch(console.error);
                                  } else {
                                    newData[index].semaines = newSemaines;
                                    onDataChange(newData);
                                  }
                                }
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
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Aucune donnée */}
      {data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Aucun résultat 5S saisi</p>
          <p className="text-sm text-gray-400">Ajoutez vos résultats ci-dessus</p>
        </div>
      )}
    </div>
  );
};

export default ResultatsForm;
