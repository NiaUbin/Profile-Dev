"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GameButton: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, type }) => {
  const baseStyles = "relative px-6 py-2 font-orbitron text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden group";
  
  const variants = {
    primary: "text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]",
    secondary: "text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    danger: "text-rose-400 border border-rose-500/50 hover:bg-rose-500/10 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current transition-all group-hover:w-4 group-hover:h-4"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current transition-all group-hover:w-4 group-hover:h-4"></div>
    </button>
  );
};

export const CardFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg overflow-hidden group/frame hover:border-cyan-500/30 transition-colors duration-500 ${className}`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none group-hover/frame:from-cyan-500/20 transition-colors duration-500"></div>
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40 group-hover/frame:bg-cyan-400 group-hover/frame:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-500"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const ProgressBar: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'bg-cyan-500' }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 font-sans text-xs uppercase tracking-wider font-semibold text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};
