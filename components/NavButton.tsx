
import React from 'react';
import { HomeOrModelId, AIModel } from '../types';
import { LucideProps } from 'lucide-react';

interface NavButtonProps {
  model: { id: HomeOrModelId; icon: React.ComponentType<LucideProps>; displayName: string };
  currentTab: HomeOrModelId;
  setCurrentTab: (tab: HomeOrModelId) => void;
  isCenter?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ model, currentTab, setCurrentTab, isCenter = false }) => {
  const isActive = currentTab === model.id;
  const Icon = model.icon;

  if (isCenter) {
    return (
      <div className="relative -top-4">
        <div className="p-px rounded-full bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 shadow-lg shadow-fuchsia-900/30">
          <button
            onClick={() => setCurrentTab(model.id)}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'bg-cyan-900/50' : 'bg-[#0a0a0f] hover:bg-white/5'}`}
          >
            <Icon className={`w-8 h-8 ${isActive ? 'text-cyan-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setCurrentTab(model.id)}
      className="flex flex-col items-center justify-center p-2 w-1/5 h-full transition duration-150 hover:bg-white/5"
    >
      <Icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-cyan-500' : 'text-gray-500'}`} />
      <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-cyan-500' : 'text-gray-500'}`}>
        {model.displayName}
      </span>
    </button>
  );
};

export default NavButton;
