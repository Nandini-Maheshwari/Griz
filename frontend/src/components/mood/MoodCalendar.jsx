import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import toast from 'react-hot-toast';

const MoodCalendar = () => {
  const { authToken } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyMoods, setMonthlyMoods] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getMonthYear = (date) => {
    return {
      month: date.getMonth() + 1, // JavaScript months are 0-indexed
      year: date.getFullYear()
    };
  };

  const fetchMonthlyMoods = async () => {
    setIsLoading(true);
    const { month, year } = getMonthYear(currentDate);
    
    try {
      const response = await axios.get(
        `/api/v1/mood/monthly?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      // Transform array to object with date as key for easier lookup
      const moodsByDate = {};
      response.data.data.forEach((mood) => {
        const dateStr = new Date(mood.date).toISOString().split('T')[0];
        moodsByDate[dateStr] = mood;
      });
      
      setMonthlyMoods(moodsByDate);
    } catch (error) {
      console.error('Error fetching moods:', error);
      toast.error('Failed to load mood data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyMoods();
  }, [currentDate, authToken]);

  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  // Calendar rendering logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  
  const getMoodEmoji = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return monthlyMoods[dateStr]?.emoji || null;
  };

  const getMoodClass = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const mood = monthlyMoods[dateStr]?.mood;
    
    if (!mood) return '';
    
    const moodColors = {
      happy: 'bg-yellow-100',
      excited: 'bg-orange-100',
      neutral: 'bg-blue-100',
      anxious: 'bg-purple-100',
      sad: 'bg-gray-100'
    };
    
    return moodColors[mood] || '';
  };

  // Create calendar grid
  const calendarRows = [];
  let days = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 border border-gray-100"></div>);
  }

  // Add cells for each day in month
  daysInMonth.forEach((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
    const emoji = getMoodEmoji(day);
    const moodClass = getMoodClass(day);
    
    days.push(
      <div 
        key={dateStr} 
        className={`h-12 border border-gray-200 relative ${moodClass} transition-all duration-300
                    ${isToday ? 'border-green-500 border-2' : ''}`}
      >
        <span className="absolute top-1 left-1 text-xs">{format(day, 'd')}</span>
        {emoji && (
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            {emoji}
          </span>
        )}
      </div>
    );
    
    // Start a new row every 7 days
    if (days.length === 7) {
      calendarRows.push(<div key={`row-${calendarRows.length}`} className="grid grid-cols-7 gap-0">{days}</div>);
      days = [];
    }
  });

  // Add remaining days to the last row
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(<div key={`empty-end-${days.length}`} className="h-12 border border-gray-100"></div>);
    }
    calendarRows.push(<div key={`row-${calendarRows.length}`} className="grid grid-cols-7 gap-0">{days}</div>);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          ←
        </button>
        
        <h2 className="text-xl font-semibold text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          →
        </button>
      </div>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="space-y-0">
          {calendarRows}
        </div>
      )}
      
      {/* Mood legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Mood Legend:</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 mr-1"></div>
            <span className="text-sm">Happy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-100 mr-1"></div>
            <span className="text-sm">Excited</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 mr-1"></div>
            <span className="text-sm">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 mr-1"></div>
            <span className="text-sm">Anxious</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 mr-1"></div>
            <span className="text-sm">Sad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;