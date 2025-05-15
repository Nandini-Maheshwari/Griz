// src/pages/MoodPage.jsx
import React from 'react';
import MoodTracker from '../components/mood/MoodTracker';

const MoodPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <MoodTracker />
    </div>
  );
};

export default MoodPage;