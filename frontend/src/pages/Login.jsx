import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, isLoading, authError } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }
    
    const success = await login({ email, password });
    if (success) {
      navigate('/chat');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h1 className={`text-2xl font-bold mb-6 text-center ${
          theme === 'dark' ? 'text-green-400' : 'text-green-700'
        }`}>
          Log In
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {(authError || formError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {formError || authError}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-green-700 hover:bg-green-600'
                    : 'bg-green-600 hover:bg-green-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-medium ${
                theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'
              }`}>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;