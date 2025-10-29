
import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { ModelId, Message } from '../../types';
import NeonBorder from '../NeonBorder';
import MessageBubble from '../MessageBubble';

interface AiTabScreenProps {
  modelId: ModelId;
  conversation: Message[];
  handleReply: (modelId: ModelId, reply: string) => void;
  isModelLoading: boolean;
}

const AiTabScreen: React.FC<AiTabScreenProps> = ({ modelId, conversation, handleReply, isModelLoading }) => {
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSend = () => {
    if (replyText.trim()) {
      handleReply(modelId, replyText.trim());
      setReplyText('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="flex flex-col">
          {conversation.map((msg, index) => (
            <MessageBubble key={index} message={msg} modelId={modelId} />
          ))}
          {isModelLoading && (
            <div className="self-start text-gray-500 italic p-3">
              <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin" />
              {modelId} is thinking...
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#0a0a0f]">
        <div className="flex gap-3">
          <div className="flex-1">
            <NeonBorder>
              <input
                type="text"
                className="w-full py-3 px-4 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-base"
                placeholder={`Reply to ${modelId}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isModelLoading}
              />
            </NeonBorder>
          </div>
          
          <div className="w-14 h-14 shrink-0">
            <NeonBorder className="w-full h-full">
              <button
                onClick={handleSend}
                disabled={isModelLoading || !replyText.trim()}
                className="w-full h-full flex items-center justify-center bg-transparent rounded-xl hover:bg-white/10 transition duration-150 disabled:opacity-50"
              >
                <Send className="w-6 h-6 text-cyan-500" />
              </button>
            </NeonBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTabScreen;
