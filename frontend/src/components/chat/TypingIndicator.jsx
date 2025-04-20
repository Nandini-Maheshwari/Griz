const TypingIndicator = ({ theme }) => {
    return (
      <div className="flex justify-start mb-4">
        <div 
          className={`rounded-2xl py-3 px-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '200ms' }}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TypingIndicator;