
import React, { useState } from 'react';
import { Settings, Link, Save } from 'lucide-react';
import { ApiKeySet, HomeOrModelId, ModelId } from '../../types';
import { AI_MODELS } from '../../constants';
import NeonBorder from '../NeonBorder';

interface SettingsScreenProps {
  apiKeys: ApiKeySet;
  setApiKeys: (keys: ApiKeySet) => void;
  setCurrentTab: (tab: HomeOrModelId) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ apiKeys, setApiKeys, setCurrentTab }) => {
  const [tempKeys, setTempKeys] = useState(apiKeys);

  const handleKeyChange = (modelId: ModelId, key: string) => {
    setTempKeys(prev => ({ ...prev, [modelId]: key }));
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem('aiApiKeys', JSON.stringify(tempKeys));
      setApiKeys(tempKeys);
      setCurrentTab('Home');
    } catch (error) {
      console.error('Failed to save API keys:', error);
      alert('Failed to save settings. Please try again.');
    }
  };
  
  const isSaveDisabled = JSON.stringify(tempKeys) === JSON.stringify(apiKeys);

  const keyLinks: Record<ModelId, string> = {
    ChatGPT: 'https://platform.openai.com/api-keys',
    Gemini: 'https://aistudio.google.com/app/apikey',
    Grok: 'https://console.x.ai',
    Claude: 'https://console.anthropic.com'
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-2xl">
          
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
            <Settings className="inline-block w-6 h-6 mr-2 -mt-1" />
            API Key Settings
          </h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Enter your personal API keys below. They are saved securely on this device only.
          </p>

          {AI_MODELS.map(({ id, displayName }) => (
            <div key={id} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-cyan-300">{displayName} API Key</label>
                <a href={keyLinks[id]} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                  Get Key <Link className="ml-1 w-3 h-3" />
                </a>
              </div>
              <NeonBorder>
                <input
                  type="password"
                  className="w-full py-3 px-4 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-base"
                  value={tempKeys[id] || ''}
                  onChange={(e) => handleKeyChange(id, e.target.value)}
                  placeholder={`Enter your ${displayName} API Key...`}
                />
              </NeonBorder>
            </div>
          ))}
          
          <NeonBorder className="mt-8 mb-6">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="w-full py-3 text-lg font-bold uppercase transition duration-200 rounded-xl flex items-center justify-center space-x-2 text-fuchsia-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            >
              <Save className="w-5 h-5" />
              <span>Save Keys & Return</span>
            </button>
          </NeonBorder>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
