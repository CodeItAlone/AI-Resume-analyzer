import React from 'react';

export function StageChip({ stage, status = 'pending', index, className = '' }) {
  // status: 'active' (oxblood) | 'completed' (forest + strikethrough) | 'pending' (faint)
  let statusStyles = "border-[#1C1B19]/20 text-[#1C1B19]/40 bg-transparent";
  
  if (status === 'active') {
    statusStyles = "border-[#7A1F1F] text-[#7A1F1F] font-bold bg-[#7A1F1F]/5 shadow-sm";
  } else if (status === 'completed') {
    statusStyles = "border-[#2F5233] text-[#2F5233] line-through opacity-75 bg-[#2F5233]/5";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[10px] sm:text-xs tracking-wider transition-all duration-300 select-none ${statusStyles} ${className}`}>
      {index !== undefined && <span className="opacity-60">{index + 1}.</span>}
      {stage}
    </span>
  );
}
