
import React from 'react';
import { Message, ModelId } from '../types';

interface MessageBubbleProps {
  message: Message;
  modelId: ModelId;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, modelId }) => {
  const isUser = message.role === 'user';
  const accentColor = modelId === 'ChatGPT' ? 'bg-green-600/30' :
                      modelId === 'Gemini' ? 'bg-yellow-600/30' :
                      modelId === 'Grok' ? 'bg-purple-600/30' :
                      modelId === 'Claude' ? 'bg-orange-600/30' : 'bg-gray-700/30';
  
  return (
    <div
      className={`max-w-[85%] p-4 rounded-xl shadow-lg mb-4 
        ${isUser 
          ? 'self-end rounded-br-sm bg-gray-800 text-gray-100' 
          : `self-start rounded-tl-sm ${accentColor} text-white`
        }`}
    >
      <div className={`text-sm ${isUser ? 'font-semibold text-gray-300' : 'font-bold text-cyan-200'}`}>
        {isUser ? 'You' : modelId}
      </div>
      <p className="mt-1 text-base leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    </div>
  );
};

export default MessageBubble;
