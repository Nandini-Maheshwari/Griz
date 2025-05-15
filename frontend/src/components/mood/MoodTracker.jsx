import React, { useState } from 'react';
import MoodLogger from './MoodLogger';
import MoodCalendar from './MoodCalendar';
import MoodStats from './MoodStats';

const MoodTracker = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Mood Tracker</h1>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button 
          className={`py-2 px-4 ${activeTab === 'calendar' ? 'text-green-600 border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'stats' ? 'text-green-600 border-b-2 border-green-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>
      
      {/* Content */}
      <div className="mt-4">
        {activeTab === 'calendar' && (
          <div>
            <MoodLogger />
            <MoodCalendar />
          </div>
        )}
        {activeTab === 'stats' && (
          <MoodStats />
        )}
      </div>
    </div>
  );
};

export default MoodTracker;