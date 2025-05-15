import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './context/ThemeProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import Layout from './components/layout/Layout';
import ProtectedRoute from './utils/protectedRoutes.jsx';
import Landing from './pages/Landing';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import ChatPage from './pages/Chat';
import MoodPage from './pages/Mood.jsx';

// Placeholder component for routes that are not yet implemented
const UnderConstruction = ({ pageName }) => (
  <div className="flex flex-col items-center justify-center h-96">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">{pageName} Coming Soon</h2>
    <p className="mt-2 text-gray-600 dark:text-gray-400">This page is under construction.</p>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Layout>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/mood" element={<MoodPage />} />
              </Route>
              <Route path="*" element={<UnderConstruction pageName="Page" />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;