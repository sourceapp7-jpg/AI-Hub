
import React from 'react';
import { Settings, Brain, Link } from 'lucide-react';
import { HomeOrModelId } from '../types';

interface HeaderProps {
  setCurrentTab: (tab: HomeOrModelId) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentTab }) => (
  <header className="fixed top-0 left-0 right-0 h-20 w-full flex items-center justify-center bg-[#0a0a0f] z-50 border-b border-cyan-500/30 shadow-2xl shadow-black px-4">
    <div className="absolute inset-0 bg-[#0a0a0f]"></div>
    <div className="flex flex-col items-center relative z-10">
      <div className="text-3xl font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 flex items-center">
        <Brain className="w-8 h-8 mr-2 text-cyan-400" />
        AI HUB
      </div>
      <a
        href="https://github.com/MHK-322"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs mt-0.5 font-light tracking-wider text-cyan-500 hover:text-cyan-300 transition duration-150 flex items-center"
      >
        by MHK
        <Link className="ml-1 w-3 h-3" />
      </a>
    </div>
    
    <button 
      onClick={() => setCurrentTab('Settings')}
      className="absolute right-4 p-2 text-gray-500 hover:text-cyan-500 transition duration-150 z-10"
      title="Settings"
    >
      <Settings className="w-6 h-6" />
    </button>
  </header>
);

export default Header;
