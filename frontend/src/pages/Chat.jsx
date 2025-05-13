import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/themeContext'; // Adjust path as needed
import ChatMessage from '../components/chat/ChatMessage';
import TypingIndicator from '../components/chat/TypingIndicator';
import { useNavigate } from 'react-router-dom'; // For redirection if needed
import { Dialog } from '@headlessui/react';

const ChatPage = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState('initial'); // 'initial', 'chatting', 'loading'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleStartNewChat = () => {
    setMessages([
      {
        text: "Hello! I'm your AI therapist. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
    ]);
    setChatState('chatting');
  };
  
  const handleOpenPreviousChat = async () => {
    if (!isAuthenticated) {
      handleStartNewChat();
      return;
    }
    
    setChatState('loading');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      
      if (data.data && data.data.messages && data.data.messages.length > 0) {
        setMessages(data.data.messages);
      } else {
        // No previous messages, start a new chat
        handleStartNewChat();
      }
      
      setChatState('chatting');
    } catch (error) {
      console.error('Error fetching previous chat:', error);
      handleStartNewChat();
    }
  };
  
  const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  if (!isAuthenticated) {
    // Show message asking user to log in
    const aiResponse = {
      text: "To continue the conversation and receive a response, please log in.",
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiResponse]);
    setInputMessage('');
    return;
  }

  const newUserMessage = {
    text: inputMessage,
    sender: 'user',
    timestamp: new Date().toISOString()
  };

  setMessages(prev => [...prev, newUserMessage]);
  setInputMessage('');
  setIsTyping(true);

  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch('/api/v1/chats', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: inputMessage })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();

    setIsTyping(false);

    const aiResponse = {
      text: data.data.reply,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error sending message:', error);
    setIsTyping(false);

    const errorMessage = {
      text: "Sorry, I'm having trouble connecting. Please try again later.",
      sender: 'ai',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, errorMessage]);
  }
};
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
  <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
    <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col">
      <h1 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
        AI Therapist Chat
      </h1>

      {/* Initial State */}
      {chatState === 'initial' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            What would you like to do?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowLoginDialog(true);
                } else {
                  handleStartNewChat();
                }
              }}
              className={`px-6 py-3 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              } transition-colors`}
            >
              Start New Chat
            </button>

            <button
              onClick={handleOpenPreviousChat}
              className={`px-6 py-3 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors`}
            >
              Open Previous Chat
            </button>
          </div>

          {!isAuthenticated && (
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Note: You must log in to start a chat.
            </p>
          )}
        </div>
      )}

      {/* Chatting or Loading State */}
      {(chatState === 'chatting' || chatState === 'loading') && (
        <>
          <div className={`flex-1 overflow-y-auto rounded-lg p-4 mb-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            {messages.length === 0 && chatState === 'loading' ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} theme={theme} />
                ))}
                {isTyping && <TypingIndicator theme={theme} />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className={`flex items-center rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-300'
          }`}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isAuthenticated}
              className={`flex-1 p-3 rounded-l-lg resize-none outline-none h-12 ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isAuthenticated}
              className={`p-3 rounded-r-lg ${
                inputMessage.trim() && isAuthenticated
                  ? theme === 'dark'
                    ? 'bg-green-700 hover:bg-green-600 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
              } transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>

          {!isAuthenticated && (
            <p className="mt-3 text-sm text-center text-red-500">
              You must be logged in to send messages.
            </p>
          )}
        </>
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 shadow-lg`}>
            <Dialog.Title className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Login Required
            </Dialog.Title>
            <Dialog.Description className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You need to log in to start a new chat.
            </Dialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowLoginDialog(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
              >
                Log In
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  </div>
);
};

export default ChatPage;