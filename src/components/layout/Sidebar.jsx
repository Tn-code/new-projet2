import React from 'react';
import { 
  Home, 
  ClipboardCheck, 
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  CheckCircle
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'audit', label: 'Audit 5S', icon: ClipboardCheck },
    { id: 'gemba', label: 'Gemba OJT', icon: Users },
    { id: 'resultats', label: 'Résultats 5S', icon: BarChart3 },
    { id: 'action', label: 'Action 5S', icon: CheckCircle },
    { id: 'tendance', label: 'Tendance Lignes', icon: Activity },
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
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {activePage === item.id && (
                <span className="ml-auto w-1.5 h-8 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Version 2.0<br />
          Semaine {new Date().getWeek()}
        </p>
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
