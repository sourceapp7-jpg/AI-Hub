
import React from 'react';
import { Home } from 'lucide-react';
import { HomeOrModelId } from '../types';
import { AI_MODELS } from '../constants';
import NavButton from './NavButton';

interface BottomNavProps {
  currentTab: HomeOrModelId;
  setCurrentTab: (tab: HomeOrModelId) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0f] border-t border-cyan-500/30 shadow-2xl shadow-black z-50">
    <div className="flex justify-around h-full">
      {AI_MODELS.slice(0, 2).map(model => (
        <NavButton key={model.id} model={model} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      ))}

      <NavButton 
        model={{ id: 'Home', icon: Home, displayName: 'Home' }} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isCenter={true} 
      />

      {AI_MODELS.slice(2, 4).map(model => (
        <NavButton key={model.id} model={model} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      ))}
    </div>
  </nav>
);

export default BottomNav;
