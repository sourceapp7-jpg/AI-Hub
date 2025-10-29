
import React, { useState, useCallback, useEffect } from 'react';
import { HomeOrModelId, ModelId, Message, ApiKeySet, ImageAttachment } from './types';
import { AI_MODELS, COLORS } from './constants';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/screens/HomeScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import AiTabScreen from './components/screens/AiTabScreen';
import { getChatGPTResponse, getGeminiResponse, getGrokResponse, getClaudeResponse } from './services/apiService';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<HomeOrModelId>('Home');
  const [prompt, setPrompt] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState<Partial<Record<ModelId, boolean>>>({});
  const [imageAttachment, setImageAttachment] = useState<ImageAttachment | null>(null);

  const [apiKeys, setApiKeys] = useState<ApiKeySet>(() => {
    try {
      const savedKeys = window.localStorage.getItem('aiApiKeys');
      if (savedKeys) {
        return JSON.parse(savedKeys);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
    return { ChatGPT: '', Gemini: '', Grok: '', Claude: '' };
  });

  const [conversations, setConversations] = useState<Record<ModelId, Message[]>>(
    AI_MODELS.reduce((acc, model) => {
      acc[model.id] = [];
      return acc;
    }, {} as Record<ModelId, Message[]>)
  );

  const handleGetResponses = useCallback(async () => {
    if (!prompt.trim() || isInitialLoading) return;

    setIsInitialLoading(true);
    
    const initialConversation: Message = { role: 'user', content: prompt.trim() };
    const initialLoadingState = AI_MODELS.reduce((acc, model) => ({ ...acc, [model.id]: true }), {});
    setLoadingModels(initialLoadingState);
    
    const newConversations = AI_MODELS.reduce((acc, model) => {
      acc[model.id] = [initialConversation];
      return acc;
    }, {} as Record<ModelId, Message[]>);
    setConversations(newConversations);

    const query = prompt.trim();
    const currentImage = imageAttachment;
    setPrompt('');
    setImageAttachment(null);
    
    const [geminiResponse, chatGptResponse, grokResponse, claudeResponse] = await Promise.all([
      getGeminiResponse([{ role: 'user', content: query }], apiKeys.Gemini, true, currentImage)
        .finally(() => setLoadingModels(p => ({ ...p, 'Gemini': false }))),
      getChatGPTResponse([{ role: 'user', content: query }], apiKeys.ChatGPT, currentImage)
        .finally(() => setLoadingModels(p => ({ ...p, 'ChatGPT': false }))),
      getGrokResponse([{ role: 'user', content: query }], apiKeys.Grok)
        .finally(() => setLoadingModels(p => ({ ...p, 'Grok': false }))),
      getClaudeResponse([{ role: 'user', content: query }], apiKeys.Claude)
        .finally(() => setLoadingModels(p => ({ ...p, 'Claude': false }))),
    ]);
        
    setConversations(prev => ({
      Gemini: [...prev['Gemini'], { role: 'ai', content: geminiResponse }],
      ChatGPT: [...prev['ChatGPT'], { role: 'ai', content: chatGptResponse }],
      Grok: [...prev['Grok'], { role: 'ai', content: grokResponse }],
      Claude: [...prev['Claude'], { role: 'ai', content: claudeResponse }],
    }));

    setIsInitialLoading(false);
    
  }, [prompt, isInitialLoading, apiKeys, imageAttachment]);

  const handleReply = useCallback(async (modelId: ModelId, userReply: string) => {
    setConversations(prev => ({
      ...prev,
      [modelId]: [...prev[modelId], { role: 'user', content: userReply }]
    }));
    
    setLoadingModels(p => ({ ...p, [modelId]: true }));

    const history = [...conversations[modelId], { role: 'user', content: userReply }];

    let aiResponse: string;
    
    try {
      if (modelId === 'Gemini') {
        aiResponse = await getGeminiResponse(history, apiKeys.Gemini, false, null);
      } else if (modelId === 'ChatGPT') {
        aiResponse = await getChatGPTResponse(history, apiKeys.ChatGPT, null);
      } else if (modelId === 'Grok') {
        aiResponse = await getGrokResponse(history, apiKeys.Grok);
      } else {
        aiResponse = await getClaudeResponse(history, apiKeys.Claude);
      }

      setConversations(prev => ({
        ...prev,
        [modelId]: [...prev[modelId], { role: 'ai', content: aiResponse }]
      }));

    } catch (error: any) {
      console.error(`Failed to get reply for ${modelId}:`, error);
      setConversations(prev => ({
        ...prev,
        [modelId]: [...prev[modelId], { role: 'ai', content: `[System Error] Failed to get reply. ${error.message}` }]
      }));
    } finally {
      setLoadingModels(p => ({ ...p, [modelId]: false }));
    }

  }, [conversations, apiKeys]);

  const renderContent = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen 
          prompt={prompt} 
          setPrompt={setPrompt} 
          handleGetResponses={handleGetResponses} 
          isLoading={isInitialLoading}
          imageAttachment={imageAttachment}
          setImageAttachment={setImageAttachment}
        />;
      case 'Settings':
        return <SettingsScreen
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          setCurrentTab={setCurrentTab}
        />;
      default:
        const model = AI_MODELS.find(m => m.id === currentTab);
        if (model) {
          return <AiTabScreen 
            modelId={model.id} 
            conversation={conversations[model.id]} 
            handleReply={handleReply}
            isModelLoading={!!loadingModels[model.id]} 
          />;
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col antialiased overflow-hidden" style={{ backgroundColor: COLORS.BACKGROUND, color: COLORS.TEXT_LIGHT }}>
      <Header setCurrentTab={setCurrentTab} />

      <main className="flex-1 overflow-hidden mt-20 mb-20">
        {renderContent()}
      </main>

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default App;
