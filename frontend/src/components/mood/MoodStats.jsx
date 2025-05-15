import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

const MoodStats = () => {
  const { authToken } = useAuth();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  
  const fetchMoodStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        '/api/v1/mood/stats',
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching mood statistics:', error);
      toast.error('Failed to load mood statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMoodStats();
  }, [authToken]);
  
  // Colors for each mood
  const moodColors = {
    happy: '#fef9c3', // yellow-100
    excited: '#ffedd5', // orange-100
    neutral: '#dbeafe', // blue-100
    anxious: '#f3e8ff', // purple-100
    sad: '#f3f4f6', // gray-100
  };
  
  // Darker colors for chart
  const chartColors = {
    happy: '#facc15', // yellow-400
    excited: '#fb923c', // orange-400
    neutral: '#60a5fa', // blue-400
    anxious: '#c084fc', // purple-400
    sad: '#9ca3af', // gray-400
  };
  
  // Format data for the charts
  const chartData = stats.map(item => ({
    name: item.mood.charAt(0).toUpperCase() + item.mood.slice(1),
    value: item.count,
    emoji: item.emoji,
    color: chartColors[item.mood] || '#000000'
  }));
  
  const totalEntries = chartData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mood Statistics</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md ${
              chartType === 'bar' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-md ${
              chartType === 'pie' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Pie
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No mood data available yet. Start logging your moods to see statistics.
        </div>
      ) : (
        <>
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    // formatter={(value, name, props) => [`${value} entries`, 'Count']}
                    formatter={(value) => [`${value} entries`, 'Count']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="value" name="Count">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    // formatter={(value, name, props) => [`${value} entries (${((value/totalEntries)*100).toFixed(1)}%)`, 'Count']}
                    formatter={(value) => [`${value} entries (${((value/totalEntries)*100).toFixed(1)}%)`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Mood Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-center p-3 rounded-lg"
                  style={{ backgroundColor: moodColors[item.name.toLowerCase()] || '#f9fafb' }}
                >
                  <span className="text-2xl mr-3">{item.emoji}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.value} entries ({((item.value/totalEntries)*100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodStats;