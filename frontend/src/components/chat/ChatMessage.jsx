const ChatMessage = ({ message, theme }) => {
  const isAi = message.sender === 'ai';
  
  // Format timestamp if available
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div 
        className={`max-w-[80%] rounded-2xl py-2 px-4 ${
          isAi 
            ? theme === 'dark'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-200 text-gray-800'
            : theme === 'dark'
              ? 'bg-green-700 text-white'
              : 'bg-green-500 text-white'
        }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
        {formattedTime && (
          <p className={`text-xs mt-1 text-right ${
            isAi 
              ? theme === 'dark' ? 'text-gray-400' : 'text-gray-500' 
              : theme === 'dark' ? 'text-green-300' : 'text-green-100'
          }`}>
            {formattedTime}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;