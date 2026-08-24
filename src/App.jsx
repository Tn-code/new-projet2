import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Audit5S from './pages/Audit5S';
import GembaOJT from './pages/GembaOJT';
import Resultats5S from './pages/Resultats5S';
import TendanceLignes from './pages/TendanceLignes';
import Action5S from './pages/Action5S';
import './index.css';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentWeek, setCurrentWeek] = useState(35);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'audit':
        return <Audit5S currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'gemba':
        return <GembaOJT currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'resultats':
        return <Resultats5S currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'tendance':
        return <TendanceLignes currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      case 'action':
        return <Action5S currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
      default:
        return <Home currentWeek={currentWeek} onWeekChange={setCurrentWeek} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 ml-64 p-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
