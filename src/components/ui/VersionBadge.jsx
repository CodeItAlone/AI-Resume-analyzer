import React from 'react';
import { APP_VERSION } from '../../config';

export function VersionBadge({ text = APP_VERSION, className = '' }) {
  return (
    <span className={`font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] border border-[#7A1F1F] px-2 py-0.5 select-none ${className}`}>
      {text}
    </span>
  );
}
