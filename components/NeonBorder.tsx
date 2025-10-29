
import React from 'react';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
}

const NeonBorder: React.FC<NeonBorderProps> = ({ children, className = '' }) => (
  <div className={`p-px rounded-xl ${className} bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 shadow-md shadow-fuchsia-900/20`}>
    <div className="bg-[#101015] rounded-xl h-full w-full">
      {children}
    </div>
  </div>
);

export default NeonBorder;
