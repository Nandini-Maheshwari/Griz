import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import toast from 'react-hot-toast'; // Make sure to install react-hot-toast if not already done

const MoodLogger = ({ onMoodLogged = () => {} }) => {
  const { authToken } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const moods = [
    { name: 'happy', emoji: '😊', color: 'bg-yellow-100 border-yellow-400' },
    { name: 'excited', emoji: '😃', color: 'bg-orange-100 border-orange-400' },
    { name: 'neutral', emoji: '😐', color: 'bg-blue-100 border-blue-400' },
    { name: 'anxious', emoji: '😰', color: 'bg-purple-100 border-purple-400' },
    { name: 'sad', emoji: '😔', color: 'bg-gray-100 border-gray-400' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const logMood = async () => {
    if (!selectedMood) return;
    
    setIsLoading(true);
    try {
      await axios.post(
        '/api/v1/mood/log',
        { mood: selectedMood.name, emoji: selectedMood.emoji },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success('Mood logged successfully!');
      setSelectedMood(null);
      onMoodLogged(); // Notify parent component that mood was logged
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedMood?.name === mood.name 
                ? `${mood.color} border-opacity-100` 
                : 'bg-white border-gray-200 opacity-70'
            }`}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="capitalize text-sm">{mood.name}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={logMood}
        disabled={!selectedMood || isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          selectedMood && !isLoading
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Logging...' : 'Log Mood'}
      </button>
    </div>
  );
};

export default MoodLogger;