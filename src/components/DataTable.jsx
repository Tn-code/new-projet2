import React, { useState } from 'react';

const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune donnée à afficher
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {headers.map(header => {
                let label = header;
                if (header === 'semaine') label = '📅 Semaine';
                else if (header === 'planifie') label = '📋 Planifié';
                else if (header === 'realise') label = '✅ Réalisé';
                else if (header === 'taux_realisation') label = '📊 Taux';
                return (
                  <th key={header} className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider text-xs">
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                {headers.map(header => {
                  let value = row[header] !== undefined && row[header] !== null ? row[header] : '-';
                  // Formater le taux de réalisation
                  if (header === 'taux_realisation' && value !== '-') {
                    value = `${value}%`;
                  }
                  return (
                    <td key={`${idx}-${header}`} className="px-4 py-2.5 whitespace-nowrap text-gray-700">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages} ({data.length} lignes)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
