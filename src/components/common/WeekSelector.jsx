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
